from sqlalchemy.orm import session
from app.models import Item
class ItemRepository:
    def __init__(self,db:session):
        self.db = db

    def get_by_id(self,item_id:int) -> Item | None:
        return self.db.get(Item,item_id)


    ##加上增，改，删