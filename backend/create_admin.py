
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base
from app.models import models
from app.core.security import get_password_hash
import sys

# Setup DB connection
SQLALCHEMY_DATABASE_URL = "sqlite:///./fitness_tracker.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_admin_user():
    db = SessionLocal()
    try:
        email = "admin@fittrack.com"
        password = "admin"
        
        # Check if exists
        user = db.query(models.User).filter(models.User.email == email).first()
        if user:
            print(f"Admin user {email} already exists.")
            if not user.is_admin:
                print("Updating user to be admin...")
                user.is_admin = True
                db.commit()
            return

        print(f"Creating admin user: {email}")
        hashed_password = get_password_hash(password)
        db_user = models.User(
            email=email, 
            hashed_password=hashed_password,
            is_admin=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        print("Admin user created successfully.")
        
    except Exception as e:
        print(f"Error creating admin: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
