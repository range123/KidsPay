from pydantic import BaseModel, Field, EmailStr


class ParentCreate(BaseModel):
    email: EmailStr = Field(..., title="Parent's email")
    name: str = Field(..., title="Parent's full name", min_length=1)
    password: str = Field(..., title="Parent's account password", min_length=4)


class ParentCreatePYPL(BaseModel):
    email: EmailStr = Field(..., title="Parent's email")
    name: str = Field(..., title="Parent's full name", min_length=1)


class Parent(BaseModel):
    id: int
    email: EmailStr
    name: str
    is_paypal_login: bool

    class Config:
        orm_mode = True
