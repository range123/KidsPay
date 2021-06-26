from app.core import paypal_admin
from fastapi import APIRouter, Depends, HTTPException, Body
from app import schemas, crud, models
from sqlalchemy.orm import Session
from app.api import deps
from typing import Any, List
import uuid

router = APIRouter()


@router.get("/transactions", response_model=List[schemas.Transaction])
def get_transactions(*,
                     db: Session = Depends(deps.get_db),
                     child: models.Child = Depends(deps.get_current_child)
                     ) -> Any:
    return child.transactions


@router.post("/merchant_transfer", response_model=schemas.Transaction)
def transfer_to_merchant(*,
                         db: Session = Depends(deps.get_db),
                         child: models.Child = Depends(deps.get_current_child),
                         transaction_in: schemas.TransactionCreate
                         ) -> Any:
    if transaction_in.amount > child.balance:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    if transaction_in.amount > child.max_single_transaction_limit:
        raise HTTPException(
            status_code=400, detail="Amount exceeds restriction set")
    transaction_id = uuid.uuid1().int >> 34
    try:
        paypal_admin.make_payment_to_receiver(
            transaction_in.receiver_id, transaction_id, transaction_in.amount, child.name)
    except:
        raise HTTPException(status_code=500, detail="Payment Failed")
    crud.child.withdraw_balance(db, child.id, transaction_in.amount)
    transaction = crud.transaction.create(db, transaction_in, child.id)
    return transaction


@router.post("/child_transfer", response_model=schemas.Transaction)
def transfer_to_child(*,
                      db: Session = Depends(deps.get_db),
                      child: models.Child = Depends(deps.get_current_child),
                      transaction_in: schemas.TransactionCreateChild
                      ) -> Any:
    if transaction_in.amount > child.balance:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    if transaction_in.amount > child.max_single_transaction_limit:
        raise HTTPException(
            status_code=400, detail="Amount exceeds restriction set")

    other_child: models.Child = crud.child.get_by_username(
        db, transaction_in.receiver_id)
    if not other_child:
        raise HTTPException(
            status_code=400, detail="Receiver child does not exist")
    crud.child.withdraw_balance(db, child.id, transaction_in.amount)
    crud.child.add_balance(db, other_child.id, transaction_in.amount)

    transaction = crud.transaction.create(db, transaction_in, child.id, False)
    return transaction
