from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth import get_current_user
from .. import models, schemas

router = APIRouter(prefix="/api/favorites", tags=["favorites"])

@router.get("")
@router.get("/")
def get_favorites(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Favorite).filter(models.Favorite.user_id == current_user.id).all()

@router.post("")
@router.post("/")
def add_favorite(fav: schemas.FavoriteCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    existing = db.query(models.Favorite).filter(
        models.Favorite.user_id == current_user.id,
        models.Favorite.exercise_id == fav.exercise_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already in favorites")
    new_fav = models.Favorite(user_id=current_user.id, **fav.dict())
    db.add(new_fav)
    db.commit()
    db.refresh(new_fav)
    return new_fav

@router.delete("/{exercise_id}")
@router.delete("/{exercise_id}/")
def remove_favorite(exercise_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    fav = db.query(models.Favorite).filter(
        models.Favorite.user_id == current_user.id,
        models.Favorite.exercise_id == exercise_id
    ).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(fav)
    db.commit()
    return {"message": "Removed"}