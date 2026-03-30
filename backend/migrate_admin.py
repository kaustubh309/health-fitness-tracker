
import sqlite3

def add_is_admin_column():
    try:
        conn = sqlite3.connect('fitness_tracker.db')
        cursor = conn.cursor()
        
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0")
            print("Added is_admin column")
        except sqlite3.OperationalError as e:
            print(f"Column may already exist: {e}")
            
        conn.commit()
        print("Migration complete")
        
    except Exception as e:
        print(f"Error during migration: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    add_is_admin_column()
