import sys
import os

print(f"Python executable: {sys.executable}")
print(f"CWD: {os.getcwd()}")

try:
    import passlib
    from passlib.context import CryptContext
    print("passlib is installed.")
    try:
        ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
        hash = ctx.hash("test")
        print(f"Bcrypt hash successful: {hash[:10]}...")
    except Exception as e:
        print(f"ERROR: Bcrypt context failed. You might be missing bcrypt installation. Error: {e}")
except ImportError:
    print("ERROR: passlib is NOT installed.")

try:
    import sqlalchemy
    print(f"SQLAlchemy version: {sqlalchemy.__version__}")
except ImportError:
    print("ERROR: sqlalchemy is NOT installed.")

try:
    import fastapi
    print(f"FastAPI version: {fastapi.__version__}")
except ImportError:
    print("ERROR: fastapi is NOT installed.")

# Check DB connection
try:
    from sqlalchemy import create_engine
    engine = create_engine("sqlite:///./sql_app.db")
    connection = engine.connect()
    print("Database connection successfully established.")
    connection.close()
except Exception as e:
    print(f"ERROR: Database connection failed: {e}")
