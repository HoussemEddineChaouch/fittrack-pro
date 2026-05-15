from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Auth
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    fitness_goal: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Favorites
class FavoriteCreate(BaseModel):
    exercise_id: str
    exercise_name: str
    exercise_data: str

class FavoriteOut(BaseModel):
    id: int
    exercise_id: str
    exercise_name: str
    exercise_data: str
    class Config:
        from_attributes = True

# Plans
class PlanExerciseCreate(BaseModel):
    exercise_id: str
    exercise_name: str
    sets: int
    reps: int
    rest_seconds: int

class PlanExerciseOut(PlanExerciseCreate):
    id: int
    class Config:
        from_attributes = True

class PlanCreate(BaseModel):
    name: str
    goal: Optional[str] = ""
    description: Optional[str] = ""
    category: Optional[str] = ""
    difficulty: Optional[str] = "Beginner"
    duration: Optional[int] = 45

class PlanOut(PlanCreate):
    id: int
    exercises: List[PlanExerciseOut] = []
    created_at: datetime
    class Config:
        from_attributes = True

# Progress
class ProgressCreate(BaseModel):
    weight: Optional[float] = None
    chest: Optional[float] = None
    waist: Optional[float] = None
    arms: Optional[float] = None
    legs: Optional[float] = None

class ProgressOut(ProgressCreate):
    id: int
    date: datetime
    class Config:
        from_attributes = True

# Settings
class UserUpdate(BaseModel):
    name: Optional[str] = None
    fitness_goal: Optional[str] = None