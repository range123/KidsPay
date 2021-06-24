from app.schemas.parent import ParentCreate, ParentCreatePYPL
from app.core.security import get_password_hash, verify_password
from typing import Any, Optional
from sqlalchemy.orm import Session
from app.models.parent import Parent
class CRUDParent:
    def __init__(self, model : Parent) -> None:
        self.model = model

    def get(self, db : Session, id : int) -> Optional[Parent]:
        return db.query(self.model).filter(self.model.id == id).first()
    
    def get_by_email(self, db : Session, email : str) -> Optional[Parent]:
        return db.query(self.model).filter(self.model.email == email).first()
    
    def create(self, db : Session, obj_in : ParentCreate) -> Parent:
        db_obj = Parent(email=obj_in.email,
                        hashed_password=get_password_hash(obj_in.password),
                        name=obj_in.name)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def create_pypl(self, db : Session, obj_in : ParentCreatePYPL) -> Parent:
        db_obj = Parent(email=obj_in.email,
                        is_paypal_login = True,
                        name=obj_in.name)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def remove(self, db : Session, id : int) -> Parent:
        obj = db.query(self.model).get(id)
        db.delete(obj)
        db.commit()
        return obj
    
    def authenticate(self, db : Session, email : str, password : str) -> Optional[Parent]:
        parent = self.get_by_email(db, email=email)
        if not parent:
            return None
        if not verify_password(password, parent.hashed_password):
            return None
        return parent

parent = CRUDParent(Parent)