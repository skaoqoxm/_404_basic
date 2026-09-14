from sqlalchemy.orm import session
from app.models import Item
from app.schemas import ItemCreate
class ItemRepository:
    def __init__(self,db:session):
        self.db = db

    def get_by_id(self,item_id:int) -> Item | None:  #查
        return self.db.get(Item,item_id)


    #增
    def creat_item(self,data:ItemCreate)->Item:
        item=Item(**data.model_dump())
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
         #很简单，commit是提交给sql把内存对象的改动同步到数据库INDEX.而refresh就是select选取对应的字段（item)返回过来
        return item
    #删
    def delete(self, item: Item) -> None:
        self.db.delete(item)
        self.db.commit()
    #改
    def update(self, item: Item, data: dict) -> Item:
        for id, value in data.items():
            setattr(item, id, value)
        self.db.commit()
        self.db.refresh(item)
        return item
    ##加上增，改，删