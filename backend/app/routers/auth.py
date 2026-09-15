"""
认证路由：注册 + 登录 + 获取当前用户
"""

from fastapi import APIRouter, Depends,HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm 
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserUpdate, Token, UserResponse, ItemCreate, ItemResponse, ItemUpdate
from app.models import Item
from app.core.security import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user,get_item_service

from app.services import Item_Service

router = APIRouter()   
 #这里—>传的类就是把返回的结果按照Item_Service的格式来


@router.post("/register", response_model=UserResponse, summary="用户注册")

def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # 检查用户名是否已存在
   if db.query(User).filter(User.username == user_in.username).first():
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="用户名已存在",
    )
   if db.query(User).filter(User.email == user_in.email).first():
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="邮箱已存在"
    )
   user = User(
        username=user_in.username,
        email=user_in.email,
        password_hash=hash_password(user_in.password)
   )
   db.add(user)
   db.commit()
   db.refresh(user)
   return user

@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm=Depends(),
    db: Session = Depends(get_db)
    ):
     
    user = db.query(User).filter(User.username == form_data.username).first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="用户名或密码错误")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="账户已被禁用")
    token = create_access_token(user.id)
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).order_by(User.id.desc()).all()

@router.patch("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_data: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="用户不存在")
    for field, value in user_data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="用户不存在")
    db.delete(user)
    db.commit()
    return {"ok": True}

@router.get("/items", response_model=list[ItemResponse])
def get_items(db: Session = Depends(get_db)):
    return db.query(Item).order_by(Item.id.desc()).all()

@router.get("/{item_id}",response_model=UserResponse)
def get_item_id(
   item_id:int,
   service:Item_Service = Depends(get_item_service)    # service是变量名":"后跟的是类型注解
):
   return service.get_Item(item_id)

@router.delete("/del/{item_id}")
def del_item_id(
    item_id:int,
   sservice:Item_Service=Depends(get_item_service)
):
    return sservice.delete_item(item_id)

@router.post("/create", response_model=ItemResponse)

def create_item(
    item_data:ItemCreate,
    service:Item_Service = Depends(get_item_service)  
):
   return service.create_items(item_data)


@router.patch("/ut/{item_id}")
def update_item(
    item_id: int,
    item_data: ItemUpdate,
    service: Item_Service = Depends(get_item_service)
):
    return service.update_item(item_data, item_id)