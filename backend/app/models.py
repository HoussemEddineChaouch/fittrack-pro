from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    fitness_goal = Column(String, default="Gain muscle")
    created_at = Column(DateTime, default=datetime.utcnow)

    favorites = relationship("Favorite", back_populates="user")
    plans = relationship("WorkoutPlan", back_populates="user")
    progress = relationship("ProgressEntry", back_populates="user")

class Favorite(Base):
    __tablename__ = "favorites"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    exercise_id = Column(String, nullable=False)
    exercise_name = Column(String, nullable=False)
    exercise_data = Column(Text, nullable=False)
    user = relationship("User", back_populates="favorites")

class WorkoutPlan(Base):
    __tablename__ = "workout_plans"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    goal = Column(String)
    description = Column(Text)
    category = Column(String)
    difficulty = Column(String)
    duration = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="plans")
    exercises = relationship("PlanExercise", back_populates="plan")

class PlanExercise(Base):
    __tablename__ = "plan_exercises"
    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("workout_plans.id"))
    exercise_id = Column(String)
    exercise_name = Column(String)
    sets = Column(Integer)
    reps = Column(Integer)
    rest_seconds = Column(Integer)
    plan = relationship("WorkoutPlan", back_populates="exercises")

class ProgressEntry(Base):
    __tablename__ = "progress_entries"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    weight = Column(Float)
    chest = Column(Float)
    waist = Column(Float)
    arms = Column(Float)
    legs = Column(Float)
    user = relationship("User", back_populates="progress")