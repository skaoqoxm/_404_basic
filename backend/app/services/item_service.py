from fastapi import HTTPException,status
from sqlalchemy.orm import session
from app.schemas.item import ItemCreate,ItemBase,ItemUpdate
from app.Repository import ItemRepository

class Item_Service:
    def __init__(self,db:session):
        self.repo = ItemRepository(db)
    ###  下面这个是因为复用不了没办法只好再创建个查询方法的函数
  
    
    def get_Item(self,item_id:int):
        item = self.repo.get_by_id(item_id)
        if item is None:
            raise HTTPException(404,"无法找到对应ID")
        
        return item

    def get_items(self):
        return self.repo.get_all()

    def delete_item(self,item_id:int):
        item = self.repo.get_by_id(item_id)
        if item is None:
            raise HTTPException(status_code=404, detail="无法找到要删除的 id")

        self.repo.delete(item)
        return {"OK":True}

    
    def create_items(self,item_data:ItemCreate):
        existing_item = self.repo.get_by_owner_id(item_data.owner_id)
        if existing_item is not None: 
            raise HTTPException(
            status_code=409,
            detail="已存在相同的 Item"
            )

        return self.repo.creat_item(item_data)

    def update_item(self,item_data:ItemUpdate,item_id:int):
        item=self.repo.get_by_id(item_id)
        if item is None:
            raise HTTPException(
            status_code=404,
            detail="无法找到对应 ID"
        )
        update_data = item_data.model_dump(exclude_unset=True)
        return self.repo.update(item, update_data)

    

