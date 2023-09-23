const registerButton = document.getElementById("registerButton");
const loginButton = document.getElementById("loginButton");
const registrationResult = document.getElementById("registrationResult");
const loginResult = document.getElementById("loginResult");

let publicKeyCredentialOptions = {};

registerButton.addEventListener("click", async () => {
    try {
        // Fetch options from the server for registration
        const response = await fetch("/webauthn/register-options", {
            method: "POST",
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        publicKeyCredentialOptions = await response.json();

        // Request a credential creation
        const publicKeyCredential = await navigator.credentials.create({
            publicKey: publicKeyCredentialOptions,
        });

        // Send the credential to the server for validation and storage
        const credentialResponse = await fetch("/webauthn/register", {
            method: "POST",
            body: JSON.stringify(publicKeyCredential),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!credentialResponse.ok) {
            throw new Error(`Server returned ${credentialResponse.status}`);
        }

        // Display registration result
        registrationResult.textContent = "Credential registered successfully.";
    } catch (error) {
        // Display registration error
        registrationResult.textContent = "Registration failed: " + error;
    }
});

loginButton.addEventListener("click", async () => {
    try {
        // Fetch options from the server for authentication
        const response = await fetch("/webauthn/login-options", {
            method: "POST",
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        publicKeyCredentialOptions = await response.json();

        // Request an authentication
        const publicKeyCredential = await navigator.credentials.get({
            publicKey: publicKeyCredentialOptions,
        });

        // Send the publicKeyCredential to the server for validation
        const authenticationResponse = await fetch("/webauthn/login", {
            method: "POST",
            body: JSON.stringify(publicKeyCredential),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!authenticationResponse.ok) {
            throw new Error(`Server returned ${authenticationResponse.status}`);
        }

        // Display authentication result
        loginResult.textContent = "Authentication successful.";
    } catch (error) {
        // Display authentication error
        loginResult.textContent = "Authentication failed: " + error;
    }
});
