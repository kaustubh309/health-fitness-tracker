import sqlite3, os

dbs = [
    'backend/fitness_tracker.db',
    'backend/sql_app.db',
    'sql_app.db',
]

for path in dbs:
    if os.path.exists(path):
        try:
            con = sqlite3.connect(path)
            cur = con.cursor()
            cur.execute("SELECT COUNT(*) FROM users")
            count = cur.fetchone()[0]
            cur.execute("SELECT email FROM users LIMIT 5")
            emails = [r[0] for r in cur.fetchall()]
            print(f"{path}: {count} user(s) -> {emails}")
            con.close()
        except Exception as e:
            print(f"{path}: ERROR - {e}")
    else:
        print(f"{path}: NOT FOUND")
