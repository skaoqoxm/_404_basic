from fastapi import HTTPException,status
from sqlalchemy.orm import session
from app.schemas.item import ItemCreate,ItemUpdate
from app.Repository import ItemRepository

class Item_Service:
    def __init__(self,db:session):
        self.repo = ItemRepository(db)

    def get_Item(self,item_id:int):
        item = self.repo.get_by_id(item_id)
        if item is None:
            raise HTTPException(404,"无法找到对应ID")
        return item

    def delete_item(self,item_id:int):
        item_id=item_id   
        if item_id is None:
            raise HTTPException(404,"无法找到对应id")
        self.repo.delete(item_id)
        return {"OK":True}

    
    def create_items(self,item_data:ItemCreate):
       # if self.get_Item(item_data.get("id")):
         #   raise HTTPException(404,"已存在相同的Item")
        return self.repo.creat_item(item_data)

