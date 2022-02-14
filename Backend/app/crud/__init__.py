# from .crud_item import item
# from .crud_user import user

# For a new basic set of CRUD operations you could just do

# from .base import CRUDBase
# from app.models.item import Item
# from app.schemas.item import ItemCreate, ItemUpdate

# item = CRUDBase[Item, ItemCreate, ItemUpdate](Item)
from .crud_test import test
from .crud_parent import parent
from .crud_child import child
from .crud_transaction import transaction
