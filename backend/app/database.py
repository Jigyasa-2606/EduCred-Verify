#database.py

import sqlite3
import os

DATABASE_PATH = os.path.join(os.path.dirname(__file__), '..', 'your_database.db')

def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    conn = get_db_connection()
    cursor = conn.cursor()

    create_table_sql = """
    CREATE TABLE IF NOT EXISTS institutions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        seal_image_path TEXT NOT NULL,
        signature_image_path TEXT NOT NULL
    );
    """
    cursor.execute(create_table_sql)

    institutions_data = [
        ('JHAR', 'Jharkhand State University', 'backend/assets/seals/jhar_seal.png', 'backend/assets/signatures/jhar_signature.png'),
        ('RANC', 'Ranchi Tech Institute', 'backend/assets/seals/ranc_seal.png', 'backend/assets/signatures/ranc_signature.png'),
        ('JHAR_BS', 'Jharkhand Business School', 'backend/assets/seals/jhar_bs_seal.png', 'backend/assets/signatures/jhar_bs_signature.png'),
    ]

    insert_sql = """
    INSERT OR IGNORE INTO institutions (code, name, seal_image_path, signature_image_path)
    VALUES (?, ?, ?, ?);
    """
    cursor.executemany(insert_sql, institutions_data)

    conn.commit()
    conn.close()
    print("Database initialized successfully!")

def get_institution_assets(institution_code):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT seal_image_path, signature_image_path FROM institutions WHERE code = ?", (institution_code,))

    result = cursor.fetchone()
    conn.close()
    if result:
        return {"seal_path": result['seal_image_path'], "signature_path": result['signature_image_path']}
    return None