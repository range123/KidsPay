from typing import TYPE_CHECKING
from app.db.base_class import Base
from sqlalchemy import Column, ForeignKey, Integer, String, Float
from sqlalchemy.orm import relationship

if TYPE_CHECKING:
    from .parent import Parent
    from .transaction import Transaction

class Child(Base):
    id = Column(Integer, index=True, primary_key=True)
    name = Column(String)
    balance = Column(Float, default=0.0, index=True)

    parent_id = Column(Integer,ForeignKey("parent.id"))
    parent = relationship("Parent", back_populates="children")

    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, index=True, nullable=False)

    max_single_transaction_limit = Column(Float, default=1e7, index=True)

    transactions = relationship("Transaction", back_populates="child")
