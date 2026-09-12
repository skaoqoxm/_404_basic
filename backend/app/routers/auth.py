"""
认证路由：注册 + 登录 + 获取当前用户
"""

from fastapi import APIRouter, Depends,HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm 
from app.database import get_db
from app.models import User
from app.schemas import UserCreate,Token,UserResponse
from app.core.security import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user

router = APIRouter()   

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