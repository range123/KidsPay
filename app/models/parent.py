from typing import TYPE_CHECKING

from app.db.base_class import Base
from sqlalchemy import Column, ForeignKey, Integer, String, Boolean
from sqlalchemy.orm import relationship

if TYPE_CHECKING:
    from .child import Child


class Parent(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, index=True, nullable=False)
    hashed_password = Column(String, index=True)
    children = relationship("Child", back_populates="parent")
    is_paypal_login = Column(Boolean, default=False)
