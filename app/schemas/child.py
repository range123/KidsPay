from pydantic import BaseModel, Field
from typing import Optional

class ChildCreate(BaseModel):
    name : str = Field(...,title="Name of the child", min_length=1)
    username : str = Field(..., title="Child's username", regex="^[a-zA-Z0-9_.-]+$")
    password : str = Field(..., title="Child's password", min_length=4)
    max_single_transaction_limit : Optional[float]

class Child(BaseModel):
    id : int
    username : str
    name : str
    balance : float
    parent_id : int
    username : str
    max_single_transaction_limit : float

    class Config:
        orm_mode = True

