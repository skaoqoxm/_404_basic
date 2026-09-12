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
    