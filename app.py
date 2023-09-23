from flask import Flask, render_template, request, jsonify
from webauthn import PublicKeyCredentialCreationOptions, PublicKeyCredentialRequestOptions, WebAuthn
import os
from mydatabase import create_tables, add_user, is_user_registered

app = Flask(__name__)
app.secret_key = os.urandom(32)

# Initialize WebAuthn
webauthn = WebAuthn(app, attestation="direct")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register():
    username = request.form.get('username')
    user_id = request.form.get('user_id')

    if is_user_registered(user_id):
        return jsonify({'message': 'User already registered'}), 400

    options = webauthn.register_begin(
        {
            "user": {"id": user_id, "name": username, "displayName": username},
            "challenge": webauthn.generate_challenge(),
        }
    )

    return jsonify(options)

@app.route('/register/verify', methods=['POST'])
def register_verify():
    response = request.get_json()
    user_id = response['user_id']

    try:
        attestation_object = response['attestationObject']
        client_data = response['clientDataJSON']
        webauthn.register_complete(
            user_id,
            PublicKeyCredentialCreationOptions(
                response['publicKey'],
                attestation_object,
                client_data,
                response['type'],
            ),
        )
        if add_user(response['username'], user_id):
            return jsonify({'message': 'Registration successful'})
        else:
            return jsonify({'message': 'User already registered'}), 400
    except Exception as e:
        return jsonify({'message': f'Registration failed: {str(e)}'}), 400

@app.route('/login', methods=['POST'])
def login():
    user_id = request.form.get('user_id')

    if not is_user_registered(user_id):
        return jsonify({'message': 'User not registered'}), 400

    options = webauthn.authenticate_begin(
        {
            "user_id": user_id,
            "challenge": webauthn.generate_challenge(),
        }
    )

    return jsonify(options)

@app.route('/login/verify', methods=['POST'])
def login_verify():
    response = request.get_json()
    user_id = response['user_id']

    if not is_user_registered(user_id):
        return jsonify({'message': 'User not registered'}), 400

    try:
        webauthn.authenticate_complete(
            user_id,
            PublicKeyCredentialRequestOptions(
                response['publicKey'],
                response['authenticatorData'],
                response['clientDataJSON'],
                response['signature'],
            ),
        )
        return jsonify({'message': 'Login successful'})
    except Exception as e:
        return jsonify({'message': f'Login failed: {str(e)}'}), 400

if __name__ == '__main__':
    create_tables()  # Create the database tables
    app.run(debug=True)
