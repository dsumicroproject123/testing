from flask import Flask, render_template, request, jsonify
import sqlite3
import base64  # For handling byte strings

app = Flask(__name__)

# Function to establish a database connection
def get_db_connection():
    conn = sqlite3.connect('mydatabase.db')
    return conn

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register_user():
    try:
        # Parse data from the registration form
        username = request.form.get('username')
        email = request.form.get('email')
        credential_key = request.form.get('credential_key')

        # Base64-encode the credential_key (it should be a byte string)
        credential_key = base64.b64encode(credential_key.encode()).decode()

        # Insert data into the SQLite database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (username, email, credential_key) VALUES (?, ?, ?)",
                       (username, email, credential_key))
        conn.commit()
        conn.close()

        response = {'message': 'Registration successful'}
    except Exception as e:
        response = {'error': str(e)}

    return jsonify(response)

@app.route('/login', methods=['POST'])
def login_user():
    try:
        # Implement your login logic here using mydatabase.py
        # Retrieve the user's stored credential_key from the database

        # Compare the retrieved credential_key with the one sent from the WebAuthn login

        # If they match, return a success response
        response = {'message': 'Login successful'}
    except Exception as e:
        response = {'error': str(e)}

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
