from fastapi import APIRouter
from app.api.endpoints import Test
from app.api.endpoints import authentication, child, parent

api_router = APIRouter()
api_router.include_router(Test.router, prefix="/test", tags=['Test'])
api_router.include_router(authentication.router, tags=["Auth Operations"])
api_router.include_router(child.router, prefix="/child", tags=["Child Operations"])
api_router.include_router(parent.router, prefix="/parent", tags=["Parent Operations"])