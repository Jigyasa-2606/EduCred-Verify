# backend/app/database.py
import sqlite3
import os

# Get the path to the database file
DATABASE_PATH = os.path.join(os.path.dirname(__file__), '..', 'your_database.db')

def get_db_connection():
    """Creates a connection to the SQLite database."""
    conn = sqlite3.connect(DATABASE_PATH)
    # This allows us to get rows as dictionaries, which is nicer
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Initializes the database tables and inserts initial institution data."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. SQL CODE: Create the 'institutions' table
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

    # 2. SQL CODE: Insert data for your institutions with corrected codes
    institutions_data = [
        ('JHAR', 'Jharkhand State University', 'assets/seals/jhar_seal.png', 'assets/signatures/jhar_signature.png'),
        ('RANC', 'Ranchi Tech Institute', 'assets/seals/ranc_seal.png', 'assets/signatures/ranc_signature.png'),
        ('JHAR_BS', 'Jharkhand Business School', 'assets/seals/jhar_bs_seal.png', 'assets/signatures/jhar_bs_signature.png'),
        # Add more institutions here as needed
    ]

    insert_sql = """
    INSERT OR IGNORE INTO institutions (code, name, seal_image_path, signature_image_path)
    VALUES (?, ?, ?, ?);
    """
    cursor.executemany(insert_sql, institutions_data)

    # Commit the changes and close the connection
    conn.commit()
    conn.close()
    print("Database initialized successfully!")

# Function to get institution assets by code
def get_institution_assets(institution_code):
    """Query the database to get the file paths for an institution's seal and signature"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT seal_image_path, signature_image_path FROM institutions WHERE code = ?", (institution_code,))
    result = cursor.fetchone()
    conn.close()
    if result:
        # Return the paths as a dictionary
        return {"seal_path": result['seal_image_path'], "signature_path": result['signature_image_path']}
    else:
        return None