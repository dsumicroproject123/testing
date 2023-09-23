const registerButton = document.getElementById("registerButton");
const loginButton = document.getElementById("loginButton");
const registrationResult = document.getElementById("registrationResult");
const loginResult = document.getElementById("loginResult");

registerButton.addEventListener("click", async () => {
    try {
        // Request a credential creation
        const publicKeyCredential = await navigator.credentials.create({
            publicKey: {
                // User and challenge information
                rp: { name: "DSUMicroProject123 Testing",id: "github.com" },
                user: { id: new Uint8Array(16), name: "harshalkanaskar1998@gmail.com", displayName: "Harshal Kanaskar" },
                challenge: new Uint8Array(32),

                // Specify the desired authenticator
                authenticatorSelection: {
                    userVerification: "required",
                    requireResidentKey: false,
                },

                // Specify the allowed credential types (e.g., public-key or password)
                pubKeyCredParams: [
                    { type: "public-key", alg: -7 },
                ],
            },
        });

        // Send the credential to the server for validation and storage
        // Store publicKeyCredential on the server

        // Display registration result
        registrationResult.textContent = "Credential registered successfully.";
    } catch (error) {
        // Display registration error
        registrationResult.textContent = "Registration failed: " + error;
    }
});

loginButton.addEventListener("click", async () => {
    try {
        // Request an authentication
        const publicKeyCredential = await navigator.credentials.get({
            publicKey: {
                challenge: new Uint8Array(32),
                rpId: "github.com",

                allowCredentials: [
                    // Retrieve the user's registered credentials from the server
                    // (They must have been stored during registration)
                ],
            },
        });

        // Send the publicKeyCredential to the server for validation

        // Display authentication result
        loginResult.textContent = "Authentication successful.";
    } catch (error) {
        // Display authentication error
        loginResult.textContent = "Authentication failed: " + error;
    }
});
