from fastapi import Depends, status, HTTPException
from app.db.session import SessionLocal
from sqlalchemy.orm import Session
from typing import Generator
from fastapi.security import OAuth2PasswordBearer
from app import models
from jose import jwt
from app.core import security
from app.core.config import settings
from app import schemas
from pydantic import ValidationError
from app import crud

parent_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"parent/login/access-token"
)
child_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"child/login/access-token"
)


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_current_parent(
    db: Session = Depends(get_db), token: str = Depends(parent_oauth2)
) -> models.Parent:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY_PARENT, algorithms=[security.ALGORITHM]
        )
        token_data = schemas.TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    parent = crud.parent.get(db, id=token_data.sub)
    if not parent:
        raise HTTPException(status_code=404, detail="User not found")
    return parent


def get_current_child(
    db: Session = Depends(get_db), token: str = Depends(child_oauth2)
) -> models.Child:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY_CHILD, algorithms=[security.ALGORITHM]
        )
        token_data = schemas.TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials, Attemp to relogin",
        )
    child = crud.child.get(db, id=token_data.sub)
    if not child:
        raise HTTPException(status_code=404, detail="User not found")
    return child
