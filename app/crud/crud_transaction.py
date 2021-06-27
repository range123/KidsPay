from app.schemas.transaction import TransactionCreate, TransactionQuery
from typing import Any, List, Optional
from sqlalchemy.orm import Session
from app.models.transaction import Transaction


class CRUDTransaction:
    def __init__(self, model: Transaction) -> None:
        self.model = model

    def get(self, db: Session, id: int) -> Optional[Transaction]:
        return db.query(self.model).filter(self.model.id == id).first()

    def get_by_child_id(self, db: Session, child_id: int) -> List[Transaction]:
        return db.query(self.model).filter(self.model.child_id == child_id).all()

    def get_by_child_id_and_receiver(self, db: Session, child_id: int, child_uname: str) -> List[Transaction]:
        return db.query(self.model).filter((self.model.child_id == child_id) | (self.model.receiver_id == child_uname)).all()

    def create(self, db: Session, obj_in: TransactionCreate, child_id, is_merchant_transfer=True) -> Transaction:
        db_obj = Transaction(amount=obj_in.amount,
                             category=obj_in.category,
                             child_id=child_id,
                             receiver_id=obj_in.receiver_id,
                             is_merchant_transfer=is_merchant_transfer)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def query(self, db: Session, query: TransactionQuery, child_id) -> List[Transaction]:
        if (query.category):
            db.query(self.model).filter(self.model.amount > query.amount_low,
                                        self.model.amount <= query.amount_high,
                                        self.model.created_at >= query.start,
                                        self.model.created_at <= query.end,
                                        self.model.category == query.category,
                                        self.model.child_id == child_id).all()
        else:
            db.query(self.model).filter(self.model.amount > query.amount_low,
                                        self.model.amount <= query.amount_high,
                                        self.model.created_at >= query.start,
                                        self.model.created_at <= query.end,
                                        self.model.child_id == child_id).all()


transaction = CRUDTransaction(Transaction)
