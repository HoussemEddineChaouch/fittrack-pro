from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth import get_current_user
from .. import models, schemas

router = APIRouter(prefix="/api/plans", tags=["plans"])

@router.get("")
@router.get("/")
def get_plans(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.WorkoutPlan).filter(models.WorkoutPlan.user_id == current_user.id).all()

@router.post("")
@router.post("/")
def create_plan(plan: schemas.PlanCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_plan = models.WorkoutPlan(user_id=current_user.id, **plan.dict())
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    return new_plan

@router.delete("/{plan_id}")
@router.delete("/{plan_id}/")
def delete_plan(plan_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    plan = db.query(models.WorkoutPlan).filter(
        models.WorkoutPlan.id == plan_id,
        models.WorkoutPlan.user_id == current_user.id
    ).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    db.delete(plan)
    db.commit()
    return {"message": "Deleted"}

@router.post("/{plan_id}/exercises")
@router.post("/{plan_id}/exercises/")
def add_exercise_to_plan(plan_id: int, exercise: schemas.PlanExerciseCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    plan = db.query(models.WorkoutPlan).filter(
        models.WorkoutPlan.id == plan_id,
        models.WorkoutPlan.user_id == current_user.id
    ).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    new_ex = models.PlanExercise(plan_id=plan_id, **exercise.dict())
    db.add(new_ex)
    db.commit()
    db.refresh(new_ex)
    return new_ex

@router.delete("/{plan_id}/exercises/{exercise_id}")
@router.delete("/{plan_id}/exercises/{exercise_id}/")
def remove_exercise_from_plan(plan_id: int, exercise_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    ex = db.query(models.PlanExercise).filter(
        models.PlanExercise.id == exercise_id,
        models.PlanExercise.plan_id == plan_id
    ).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Exercise not found")
    db.delete(ex)
    db.commit()
    return {"message": "Removed"}