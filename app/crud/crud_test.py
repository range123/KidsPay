from app.crud.base import CRUDBase
from app.models.test import Test
from app.schemas.test import TestUpdate, TestCreate
test = CRUDBase[Test, TestCreate, TestUpdate](Test)
