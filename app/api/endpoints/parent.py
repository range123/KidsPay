from app.core import paypal_admin
from fastapi import APIRouter, Depends, HTTPException, Body
from app import schemas, crud, models
from sqlalchemy.orm import Session
from app.api import deps
from typing import Any, List
import uuid

router = APIRouter()

@router.post("/add_balance", response_model=schemas.Child)
def add_balance_to_child(*,
    db : Session = Depends(deps.get_db),
    parent : models.Parent = Depends(deps.get_current_parent),
    child_id : int = Body(...),
    amount : float = Body(...,gt=1)
) -> Any:
    child = crud.child.get_by_parentid_and_childid(db, parent.id, child_id=child_id)
    if not child:
        raise HTTPException(status=400, detail="Not authorised or child does not exist!")
    child = crud.child.add_balance(db,child.id,amount)
    return child
    

@router.post("/set_restrictions", response_model=schemas.Child)
def set_restrictions_to_child(*,
    db : Session = Depends(deps.get_db),
    parent : models.Parent = Depends(deps.get_current_parent),
    child_id : int = Body(...),
    max_single_transaction_limit : float = Body(...,gt=0)
) -> Any:
    child = crud.child.get_by_parentid_and_childid(db, parent.id, child_id=child_id)
    if not child:
        raise HTTPException(status=400, detail="Not authorised or child does not exist!")
    child = crud.child.set_transaction_restriction(db, child.id, max_single_transaction_limit)
    return child

@router.post("/withdraw", response_model=schemas.Child)
def withdraw_from_child(*,
    db : Session = Depends(deps.get_db),
    parent : models.Parent = Depends(deps.get_current_parent),
    child_id : int = Body(...),
    amount : float = Body(..., gt=0)
) -> Any:
    child = crud.child.get_by_parentid_and_childid(db, parent.id, child_id=child_id)
    if not child:
        raise HTTPException(status=400, detail="Not authorised or child does not exist!")
    if child.balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient Balance")
    refund_id = uuid.uuid1().int>>34
    try:
        paypal_admin.make_payment_to_receiver(parent.email, refund_id, amount, sender="KidsPay")
    except:
        raise HTTPException(status_code=500, detail="Payment Failed")
    child = crud.child.withdraw_balance(db, child.id, amount)
    return child

@router.get("/child_transactions/{child_id}", response_model=List[schemas.Transaction])
def get_child_transactions(*,
    db : Session = Depends(deps.get_db),
    parent : models.Parent = Depends(deps.get_current_parent),
    child_id : int
) -> Any:
    child = crud.child.get_by_parentid_and_childid(db, parent.id, child_id=child_id)
    if not child:
        raise HTTPException(status=400, detail="Not authorised or child does not exist!")
    return child.transactions

@router.get("/children", response_model=List[schemas.Child])
def get_children(
    *,db: Session = Depends(deps.get_db), 
    parent : models.Parent = Depends(deps.get_current_parent)
)-> Any:
    return parent.children

    