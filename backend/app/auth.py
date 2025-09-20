# backend/app/auth.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
import bcrypt
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Auth API")

@app.get("/")
def read_root():
    return {"message": "Hello, this is the root endpoint!"}
    
# Allow requests from React dev server (change in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "users.db"   # will be created in backend/ when you run uvicorn here
conn = sqlite3.connect(DB_PATH, check_same_thread=False)
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
""")
conn.commit()

class User(BaseModel):
    user_id: str
    password: str

@app.post("/signup")
def signup(user: User):
    if not user.user_id or not user.password:
        raise HTTPException(status_code=400, detail="Missing fields")
    # hash password
    hashed = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    try:
        cursor.execute("INSERT INTO users (user_id, password) VALUES (?, ?)",
                       (user.user_id, hashed.decode('utf-8')))
        conn.commit()
        return {"message": "Signup successful"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="User already exists")

@app.post("/login")
def login(user: User):
    cursor.execute("SELECT password FROM users WHERE user_id = ?", (user.user_id,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=400, detail="User not found")
    stored_hash = row[0].encode('utf-8')
    if bcrypt.checkpw(user.password.encode('utf-8'), stored_hash):
        return {"message": "Login successful"}
    raise HTTPException(status_code=400, detail="Invalid password")

