from fastapi import APIRouter
from app.api.endpoints import Test
from app.api.endpoints import authentication

api_router = APIRouter()
api_router.include_router(Test.router, prefix="/test", tags=['Test'])
api_router.include_router(authentication.router, tags=["Auth"])