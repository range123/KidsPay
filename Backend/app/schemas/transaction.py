from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr


class TransactionCreate(BaseModel):
    category: str = Field(..., title="Transaction category", min_length=1)
    amount: float = Field(..., title="Transaction amount", gt=0)
    receiver_id: EmailStr = Field(..., title="receiver paypal Email id")


class TransactionCreateChild(BaseModel):
    category: str = Field(..., title="Transaction category", min_length=1)
    amount: float = Field(..., title="Transaction amount", gt=0)
    receiver_id: str = Field(..., title="Receiving Child username",
                             regex="^[a-zA-Z0-9_.-]+$")


class Transaction(BaseModel):
    id: int
    category: str
    amount: float
    receiver_id: str
    created_at: datetime
    child_id: int
    is_merchant_transfer: bool

    class Config:
        orm_mode = True


class TransactionQuery(BaseModel):
    start: Optional[datetime] = Field(datetime.utcnow())
    end: Optional[datetime] = Field(datetime.utcnow())
    amount_low: Optional[float] = Field(0)
    amount_high: Optional[float] = Field(1e7)
    category: Optional[str]
