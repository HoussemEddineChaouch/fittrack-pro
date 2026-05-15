from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth import get_current_user
from .. import models, schemas

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me")
@router.get("/me/")
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.put("/me")
@router.put("/me/")
def update_me(
    update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if update.name:
        current_user.name = update.name
    if update.fitness_goal:
        current_user.fitness_goal = update.fitness_goal
    db.commit()
    db.refresh(current_user)
    return current_user