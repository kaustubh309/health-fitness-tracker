from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)

    # Profile fields
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    height = Column(Float, nullable=True) # in cm
    weight = Column(Float, nullable=True) # in kg
    medical_conditions = Column(String, nullable=True)
    goal = Column(String, nullable=True) # e.g. "lose_weight", "gain_muscle", "maintain"
    experience_level = Column(String, nullable=True) # beginner, intermediate, advanced
    current_diet = Column(String, nullable=True) # e.g. vegan, keto, omnivore, etc.

    workouts = relationship("Workout", back_populates="owner")
    nutrition_logs = relationship("NutritionLog", back_populates="owner")

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    duration = Column(Integer) # in minutes
    calories = Column(Float)
    analysis = Column(String, nullable=True) # New field for AI analysis
    date = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="workouts")

class NutritionLog(Base):
    __tablename__ = "nutrition_logs"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.utcnow)
    calories = Column(Float)
    protein = Column(Float)
    carbs = Column(Float)
    fat = Column(Float)
    meals_data = Column(String) # JSON string representation
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="nutrition_logs")
