from fastapi import APIRouter, Depends, HTTPException
from app.core.config import settings
from app import schemas, crud, models
from sqlalchemy.orm import Session
from datetime import timedelta
from app.api import deps
from typing import Any, List
from app.core import security
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

# Parent login & sign up

@router.post("/parent/login/access-token", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    parent = crud.parent.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not parent:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            parent.id, expires_delta=access_token_expires, secret_key=settings.SECRET_KEY_PARENT
        ),
        "token_type": "bearer",
    }

@router.post("/parent/signup", response_model=schemas.Parent)
def signup_parent(
    *,db: Session = Depends(deps.get_db), parent_in : schemas.ParentCreate
) -> Any:
    parent = crud.parent.get_by_email(db, email=parent_in.email)
    if parent:
        raise HTTPException(status_code=400, detail="User already exists")
    parent = crud.parent.create(db, parent_in)
    return parent

@router.get("/parent/me", response_model=schemas.Parent)
def read_parent_me(
    db : Session = Depends(deps.get_db),
    current_parent : models.Parent = Depends(deps.get_current_parent)
) -> Any:
    return current_parent


@router.post("/parent/add_child", response_model=schemas.Child)
def signup_parent(
    *,db: Session = Depends(deps.get_db), 
    parent : models.Parent = Depends(deps.get_current_parent),
    child_in : schemas.ChildCreate
) -> Any:
    child = crud.child.get_by_username(db, username=child_in.username)
    if child:
        raise HTTPException(status_code=400, detail="Child User already exists")
    print(child_in)
    child = crud.child.create(db, child_in, parent.id)
    return child

@router.get("/parent/children", response_model=List[schemas.Child])
def get_children(
    *,db: Session = Depends(deps.get_db), 
    parent : models.Parent = Depends(deps.get_current_parent)
)-> Any:
    children = crud.child.get_by_parentid(db,parent.id)
    print(children[0].balance)
    return children

@router.post("/child/login/access-token", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    child = crud.child.authenticate(
        db, username=form_data.username, password=form_data.password
    )
    if not child:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            child.id, expires_delta=access_token_expires, secret_key=settings.SECRET_KEY_CHILD
        ),
        "token_type": "bearer",
    }
    
@router.get("/child/me", response_model=schemas.Child)
def read_child_me(db: Session = Depends(deps.get_db), 
    child : models.Child = Depends(deps.get_current_child)) -> Any:
    return child