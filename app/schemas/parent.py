from pydantic import BaseModel, Field, EmailStr

class ParentCreate(BaseModel):
    email : EmailStr = Field(...,title="Parent's email")
    name : str = Field(..., title="Parent's full name")
    password : str = Field(..., title="Parent's account password")

class ParentCreatePYPL(BaseModel):
    email : EmailStr = Field(...,title="Parent's email")
    name : str = Field(..., title="Parent's full name")

class Parent(BaseModel):
    id : int
    email : EmailStr
    name : str
    is_paypal_login : bool

    class Config:
        orm_mode = True