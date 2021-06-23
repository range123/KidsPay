from pydantic import BaseModel, Field, EmailStr

class ParentCreate(BaseModel):
    email : EmailStr = Field(...,title="Parent's email")
    name : str = Field(..., title="Parent's full name")
    password : str = Field(..., title="Parent's account password")

class Parent(BaseModel):
    id : int
    email : EmailStr
    name : str

    class Config:
        orm_mode = True