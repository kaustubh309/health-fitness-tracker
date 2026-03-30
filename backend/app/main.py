from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, users, workouts, nutrition_api
from app.core import database
from app.models import models

# Create tables if they don't exist. 
# NOTE: In production, use Alembic for migrations. 
# For dev, we will force create new columns by just running this. 
# Since SQLite doesn't support 'ALTER TABLE' easily via create_all for existing tables,
# Users might need to delete 'sql_app.db' to see schema changes if they don't have penting data.
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Health & Fitness Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(workouts.router, prefix="/api/v1/workouts", tags=["Workouts"])
app.include_router(nutrition_api.router, prefix="/api/v1/nutrition", tags=["Nutrition"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Health & Fitness Tracker API"}
