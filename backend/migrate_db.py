import sqlite3

def add_columns():
    try:
        conn = sqlite3.connect('fitness_tracker.db')
        cursor = conn.cursor()
        
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN experience_level VARCHAR")
            print("Added experience_level column")
        except sqlite3.OperationalError as e:
            print(f"Skipping experience_level: {e}")
            
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN current_diet VARCHAR")
            print("Added current_diet column")
        except sqlite3.OperationalError as e:
            print(f"Skipping current_diet: {e}")
            
        conn.commit()
        conn.close()
        print("Migration complete")
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    add_columns()
