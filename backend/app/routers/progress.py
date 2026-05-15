from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth import get_current_user
from .. import models, schemas

router = APIRouter(prefix="/api/progress", tags=["progress"])

@router.get("")
@router.get("/")
def get_progress(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.ProgressEntry).filter(
        models.ProgressEntry.user_id == current_user.id
    ).order_by(models.ProgressEntry.date.desc()).all()

@router.post("")
@router.post("/")
def add_progress(entry: schemas.ProgressCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_entry = models.ProgressEntry(user_id=current_user.id, **entry.dict())
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

@router.delete("/{entry_id}")
@router.delete("/{entry_id}/")
def delete_progress(entry_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    entry = db.query(models.ProgressEntry).filter(
        models.ProgressEntry.id == entry_id,
        models.ProgressEntry.user_id == current_user.id
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
    return {"message": "Deleted"}