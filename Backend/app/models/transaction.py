from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy.sql import func


from app.db.base_class import Base
from sqlalchemy import Column, ForeignKey, Integer, String, Float, DateTime, Boolean
from sqlalchemy.orm import relationship

if TYPE_CHECKING:
    from .child import Child


class Transaction(Base):
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True, nullable=False)
    amount = Column(Float, index=True, nullable=False)

    receiver_id = Column(String, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True),
                        index=True, server_default=func.now())

    child_id = Column(Integer, ForeignKey("child.id"))
    child = relationship("Child", back_populates="transactions")

    is_merchant_transfer = Column(Boolean, default=True)
