from pydantic import BaseModel, Field


class TestCreate(BaseModel):
    data: str = Field(..., title="test data")


class TestUpdate(BaseModel):
    id: str
    data: str

    class Config:
        orm_mode = True
