from sqlalchemy.sql.functions import user
from app.schemas.child import ChildCreate
from app.core.security import get_password_hash, verify_password
from typing import Any, List, Optional
from sqlalchemy.orm import Session
from app.models.child import Child
from app.schemas.child import ChildCreate
class CRUDCHild:
    def __init__(self, model : Child) -> None:
        self.model = model

    def get(self, db : Session, id : int) -> Optional[Child]:
        return db.query(self.model).filter(self.model.id == id).first()
    
    def get_by_username(self, db : Session, username : str) -> Optional[Child]:
        return db.query(self.model).filter(self.model.username == username).first()
    
    def create(self, db : Session, obj_in : ChildCreate, pid : int) -> Child:
        db_obj = Child( name=obj_in.name,
                        username=obj_in.username,
                        hashed_password=get_password_hash(obj_in.password),
                        parent_id=pid
                        )
        if obj_in.max_single_transaction_limit:
            db_obj.max_single_transaction_limit = obj_in.max_single_transaction_limit
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def remove(self, db : Session, id : int) -> Child:
        obj = db.query(self.model).get(id)
        db.delete(obj)
        db.commit()
        return obj
    
    def authenticate(self, db : Session, username : str, password : str) -> Optional[Child]:
        child = self.get_by_username(db, username=username)
        if not child:
            return None
        if not verify_password(password, child.hashed_password):
            return None
        return child
    
    def add_balance(self, db : Session, id : int, amt : float) -> Optional[Child]:
        child = db.query(self.model).get(id)
        child.balance += amt
        db.add(child)
        db.commit()
        db.refresh(child)
        return child
    
    def withdraw_balance(self, db : Session, id : int, amt : float) -> Optional[Child]:
        child = db.query(self.model).get(id)
        child.balance -= amt
        db.add(child)
        db.commit()
        db.refresh(child)
        return child
    
    def set_transaction_restriction(self, db : Session, id : int, restriction_amt : float) -> Optional[Child]:
        child = db.query(self.model).get(id)
        child.max_single_transaction_limit = restriction_amt
        db.add(child)
        db.commit()
        db.refresh(child)
        return child
    
    def get_by_parentid(self, db : Session, parent_id : int) -> List[Child]:
        children = db.query(self.model).filter(Child.parent_id == parent_id).all()
        return children

    def get_by_parentid_and_childid(self, db : Session, parent_id : int, child_id : int) -> Optional[Child]:
        child = db.query(self.model).filter(Child.parent_id == parent_id,
                                                Child.id == child_id).first()
        return child

    

child = CRUDCHild(Child)