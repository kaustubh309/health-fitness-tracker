from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.core import security
from app.api import deps
from app.models import models
from app.schemas import schemas
from datetime import timedelta
from jose import JWTError, jwt

router = APIRouter()

@router.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(deps.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(deps.get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/forgot-password", response_model=schemas.Msg)
def forgot_password(
    request: schemas.PasswordResetRequest,
    db: Session = Depends(deps.get_db)
):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        # Return success even if user not found to prevent user enumeration
        return {"message": "If this email exists, a password reset link has been sent."}
    
    # Generate reset token
    access_token_expires = timedelta(minutes=15)
    reset_token = security.create_access_token(
        data={"sub": user.email, "type": "password_reset"},
        expires_delta=access_token_expires
    )
    
    # In a production app, send email. 
    # For this dev/demo, we return the token in the message so the user can use it.
    return {"message": f"Dev Mode: Reset token is: {reset_token}"}

@router.post("/reset-password", response_model=schemas.Msg)
def reset_password(
    data: schemas.PasswordResetConfirm,
    db: Session = Depends(deps.get_db)
):
    try:
        payload = jwt.decode(data.token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        if email is None or token_type != "password_reset":
            raise HTTPException(status_code=400, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid token")
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    hashed_password = security.get_password_hash(data.new_password)
    user.hashed_password = hashed_password
    db.add(user)
    db.commit()
    
    return {"message": "Password updated successfully"}
