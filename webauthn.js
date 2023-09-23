// Check for WebAuthn support
if (!window.PublicKeyCredential) {
    alert('WebAuthn is not supported in this browser.');
} else {
    // Select the registration and login buttons
    const registerButton = document.getElementById('registerButton');
    const loginButton = document.getElementById('loginButton');

    // Register button click event
    registerButton.addEventListener('click', () => {
        const username = 'Harshal Kanaskar';  // Replace with the actual username
        const user_id = generateRandomUserID();  // Generate a random user ID
        fetch('/register', { method: 'POST', body: JSON.stringify({ username, user_id }) })
            .then(response => response.json())
            .then(options => {
                return navigator.credentials.create({ publicKey: options });
            })
            .then((credential) => {
                // Send the credential to the server for storage
                return fetch('/register/verify', { method: 'POST', body: JSON.stringify({ username, user_id, ...credential.response }) });
            })
            .then(response => response.json())
            .then(result => {
                // Handle successful registration
                displayRegistrationResult(result.message);
            })
            .catch((error) => {
                // Handle registration error
                displayRegistrationResult('Registration failed: ' + error.message);
            });
    });

    // Login button click event
    loginButton.addEventListener('click', () => {
        const user_id = "MyGitHubWebAuthDemo";  // Replace with the actual user ID
        fetch('/login', { method: 'POST', body: JSON.stringify({ user_id }) })
            .then(response => response.json())
            .then(options => {
                return navigator.credentials.get({ publicKey: options });
            })
            .then((credential) => {
                // Send the credential to the server for verification
                return fetch('/login/verify', { method: 'POST', body: JSON.stringify({ user_id, ...credential.response }) });
            })
            .then(response => response.json())
            .then(result => {
                // Handle successful login
                displayLoginResult(result.message);
            })
            .catch((error) => {
                // Handle login error
                displayLoginResult('Login failed: ' + error.message);
            });
    });

    // Generate PublicKeyCredential creation or request options
    function generatePublicKeyOptions(isLogin = false) {
        const challenge = generateRandomBuffer(32);
        const username = 'MyGitHubWebAuthDemo';  // Replace with the actual username
        const user_id = isLogin ? 'YourUserID' : generateRandomUserID();  // Generate a random user ID for registration
        const rp = { id: 'https://dsumicroproject123.github.io', name: 'Harshal kanaskar' };
        const pubKeyCredParams = [{ type: 'public-key', alg: -7 }];
        const timeout = 60000;
        const excludeCredentials = isLogin ? [] : null;
        const authenticatorSelection = { authenticatorAttachment: 'platform', userVerification: 'required' };
        const attestation = isLogin ? 'none' : 'direct';

        return {
            challenge,
            user: { id: new TextEncoder().encode(user_id), name: username, displayName: username },
            rp,
            pubKeyCredParams,
            timeout,
            excludeCredentials,
            authenticatorSelection,
            attestation,
        };
    }

    // Display registration result
    function displayRegistrationResult(result) {
        const registrationResult = document.getElementById('registrationResult');
        registrationResult.textContent = result;
    }

    // Display login result
    function displayLoginResult(result) {
        const loginResult = document.getElementById('loginResult');
        loginResult.textContent = result;
    }

    // Generate a random ArrayBuffer
    function generateRandomBuffer(length) {
        const array = new Uint8Array(length);
        window.crypto.getRandomValues(array);
        return array.buffer;
    }

    // Generate a random user ID (for registration)
    function generateRandomUserID() {
        return 'MyGitHubWebAuthDemo';
    }
}
