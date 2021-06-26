from app.db.base_class import Base
from sqlalchemy import Column, Integer, String


class Test(Base):
    id = Column(Integer, primary_key=True, index=True)
    data = Column(String, index=True)
