from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas import schemas
from app.models import models

router = APIRouter()

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(deps.get_current_user)):
    return current_user

from app.core import advisor, security
import traceback

@router.put("/me", response_model=schemas.User)
def update_user_me(
    user_in: schemas.UserUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    """
    Update own user.
    """
    user_data = user_in.dict(exclude_unset=True)
    
    # Handle email update specifically to check for duplicates
    if "email" in user_data:
        new_email = user_data["email"]
        if new_email != current_user.email:
            existing_user = db.query(models.User).filter(models.User.email == new_email).first()
            if existing_user:
                raise HTTPException(status_code=400, detail="Email already registered")
            current_user.email = new_email
        del user_data["email"] # Remove from dict so we don't try to set it again in the loop if not needed
    
    for field, value in user_data.items():
        setattr(current_user, field, value)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/me/password", response_model=schemas.Msg)
def update_password_me(
    password_in: schemas.UserPasswordUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    """
    Update own password.
    """
    if not security.verify_password(password_in.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    hashed_password = security.get_password_hash(password_in.new_password)
    current_user.hashed_password = hashed_password
    db.add(current_user)
    db.commit()
    return {"message": "Password updated successfully"}

@router.get("/me/advice")
def get_user_advice(
    current_user: models.User = Depends(deps.get_current_user)
):
    """
    Get personalized advice based on user profile.
    """
    try:
        # Manually construct schema to avoid validation errors on unrelated fields (like workouts)
        # and to avoid lazy loading issues.
        user_schema = schemas.User(
            id=current_user.id,
            email=current_user.email,
            is_active=current_user.is_active,
            age=current_user.age,
            gender=current_user.gender,
            height=current_user.height,
            weight=current_user.weight,
            medical_conditions=current_user.medical_conditions,
            goal=current_user.goal,
            experience_level=current_user.experience_level,
            current_diet=current_user.current_diet,
            workouts=[]
        )
        return advisor.get_advice(user_schema)
    except Exception as e:
        print(f"Error generating advice: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.delete("/me", response_model=schemas.Msg)
def delete_user_me(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    # Delete user's workouts first manually since we don't have ON DELETE CASCADE set up in DB
    db.query(models.Workout).filter(models.Workout.owner_id == current_user.id).delete()
    
    # Delete user
    db.delete(current_user)
    db.commit()
    db.delete(current_user)
    db.commit()
    return {"message": "User deleted successfully"}

# --- Admin Routes ---

@router.get("/admin/users", response_model=List[schemas.User])
def read_all_users_admin(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(deps.get_db), 
    current_user: models.User = Depends(deps.get_current_user)
):
    """
    Get all users (Admin only).
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.get("/admin/stats")
def read_admin_stats(
    db: Session = Depends(deps.get_db), 
    current_user: models.User = Depends(deps.get_current_user)
):
    """
    Get admin dashboard stats (Admin only).
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    total_users = db.query(models.User).count()
    total_workouts = db.query(models.Workout).count()
    
    # Simple distribution of experience levels
    experience_dist = {}
    for level in ["beginner", "intermediate", "advanced"]:
        count = db.query(models.User).filter(models.User.experience_level == level).count()
        experience_dist[level] = count

    return {
        "total_users": total_users,
        "total_workouts": total_workouts,
        "experience_levels": experience_dist
    }
