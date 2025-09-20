import sqlite3
conn = sqlite3.connect("users.db")
for row in conn.execute("SELECT id, user_id FROM users"):
    print(row)
conn.close()

