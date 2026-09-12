from sqlalchemy.orm import session
from app.models import Item
class ItemRepository:
    def __init__(self,db:session):
        self.db = db

    def get_by_id(self,item_id:int) -> Item | None:
        return self.db.get(Item,item_id)


    
    def creat_item(self,id:int,title:str,description:str,status:bool,owner_id:int,
                   created_at:str,updated_at:str)->Item:
        item=Item(
            id = id,
            title = title,
            description = description,
            status = status,
            owner_id = owner_id,
            created_at = created_at,
            updated_at = updated_at
        )
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
         #很简单，commit是提交给sql把内存对象的改动同步到数据库INDEX.而refresh就是select选取对应的字段（item)返回过来
        return item
    def delete(self, item: Item) -> None:
        self.db.delete(item)
        self.db.commit()
    def update(self, item: Item, data: dict) -> Item:
        for id, value in data.items():
            setattr(item, id, value)
        self.db.commit()
        self.db.refresh(item)
        return item
    ##加上增，改，删