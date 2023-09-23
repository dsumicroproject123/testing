import sqlite3

# Function to establish a database connection
def get_db_connection():
    conn = sqlite3.connect('mydatabase.db')
    return conn

def create_user(username, email, credential_key):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (username, email, credential_key) VALUES (?, ?, ?)",
                       (username, email, credential_key))
        conn.commit()
        return True
    except Exception as e:
        print(f"Error creating user: {e}")
        return False

def get_user_by_username(username):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username=?", (username,))
        user = cursor.fetchone()
        return user
    except Exception as e:
        print(f"Error fetching user: {e}")
        return None
