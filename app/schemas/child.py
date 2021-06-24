from pydantic import BaseModel, Field
from typing import Optional

class ChildCreate(BaseModel):
    name : str = Field(...,title="Name of the child")
    username : str = Field(..., title="Child's username")
    password : str = Field(..., title="Child's password")
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

