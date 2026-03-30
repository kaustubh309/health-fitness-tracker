from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from app.api import deps
from app.models import models
from app.schemas import schemas

router = APIRouter()

def calculate_stats(activity: str, duration: int):
    activity = activity.lower()
    # Met values (approximate)
    if any(x in activity for x in ["run", "jog", "sprint"]):
        cals_per_min = 11.5
        advice = "Great cardio! Remember to maintain a steady breathing rhythm."
    elif any(x in activity for x in ["cycle", "bike", "cycling"]):
        cals_per_min = 7.5
        advice = "Cycling is excellent for low-impact endurance."
    elif any(x in activity for x in ["swim", "pool"]):
        cals_per_min = 8.3
        advice = "Swimming engages your entire body. Good for joints!"
    elif any(x in activity for x in ["walk", "hike"]):
        cals_per_min = 3.8
        advice = "Consistency is key with walking. Try to keep a brisk pace."
    elif any(x in activity for x in ["lift", "weight", "gym", "strength"]):
        cals_per_min = 5.0
        advice = "Focus on form over weight to prevent injury."
    elif any(x in activity for x in ["yoga", "stretch"]):
        cals_per_min = 3.0
        advice = "Great for flexibility and mental clarity."
    else:
        cals_per_min = 5.0
        advice = "Staying active is the most important step!"

    # Duration based modifiers
    if duration < 15:
        advice += " Consider extending your session for better endurance."
    elif duration > 60:
        advice += " Excellent stamina! Make sure to hydrate and recover."

    return round(duration * cals_per_min, 1), advice

@router.get("/", response_model=List[schemas.Workout])
def read_workouts(skip: int = 0, limit: int = 100, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    workouts = db.query(models.Workout).filter(models.Workout.owner_id == current_user.id).offset(skip).limit(limit).all()
    return workouts

@router.post("/", response_model=schemas.Workout)
def create_workout(workout: schemas.WorkoutCreate, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    calories, analysis = calculate_stats(workout.title, workout.duration)
    
    db_workout = models.Workout(
        **workout.dict(), 
        owner_id=current_user.id,
        calories=calories,
        analysis=analysis
    )
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout

@router.delete("/{workout_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workout(workout_id: int, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    workout = db.query(models.Workout).filter(models.Workout.id == workout_id, models.Workout.owner_id == current_user.id).first()
    if workout is None:
        raise HTTPException(status_code=404, detail="Workout not found")
    db.delete(workout)
    db.commit()
    return None
