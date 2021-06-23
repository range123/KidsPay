from fastapi import APIRouter
from app.api.endpoints import Test

api_router = APIRouter()
api_router.include_router(Test.router, prefix="/test", tags=['Test'])