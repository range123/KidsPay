from pydantic import BaseModel, Field
from typing import List, Optional


class ChildCreate(BaseModel):
    name: str = Field(..., title="Name of the child", min_length=1)
    username: str = Field(..., title="Child's username",
                          regex="^[a-zA-Z0-9_.-]+$")
    password: str = Field(..., title="Child's password", min_length=4)
    max_single_transaction_limit: Optional[float]
    allowed_ids: Optional[List[str]] = []


class Child(BaseModel):
    id: int
    username: str
    name: str
    balance: float
    parent_id: int
    username: str
    max_single_transaction_limit: float
    allowed_ids: List[str]

    class Config:
        orm_mode = True
