from flask import Flask, render_template, request, jsonify
from webauthn import WebAuthn
import base64

app = Flask(__name__)

# Create an instance of WebAuthn
webauthn = WebAuthn(app)

# Mock database (replace with a real database)
users = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/webauthn/register-options', methods=['POST'])
def get_registration_options():
    username = request.form.get('username')
    user_id = base64.urlsafe_b64encode(username.encode()).decode()

    # Generate and store registration options
    options = webauthn.register_begin(user_id, username, display_name=username)
    users[user_id] = {'name': username, 'options': options}

    return jsonify(options)

@app.route('/webauthn/register', methods=['POST'])
def complete_registration():
    credential = request.json
    user_id = credential['user']

    # Verify and store the credential
    webauthn.register_complete(users[user_id]['options'], credential)

    return ('', 204)

@app.route('/webauthn/login-options', methods=['POST'])
def get_login_options():
    username = request.form.get('username')
    user_id = base64.urlsafe_b64encode(username.encode()).decode()

    # Generate and store authentication options
    options = webauthn.authenticate_begin(user_id)
    users[user_id]['authentication'] = options

    return jsonify(options)

@app.route('/webauthn/login', methods=['POST'])
def complete_login():
    credential = request.json
    user_id = credential['user']

    # Verify the authentication
    webauthn.authenticate_complete(users[user_id]['authentication'], credential)

    return ('', 204)

if __name__ == '__main__':
    app.run(debug=True)
