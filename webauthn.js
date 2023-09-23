
// webauthn.js
const registerButton = document.getElementById("registerButton");

registerButton.addEventListener("click", async () => {
    try {
        // Request a credential creation
        const publicKeyCredential = await navigator.credentials.create({
            publicKey: {
                // User and challenge information
                rp: { name: "DSUMicroProject123 Testing" },
                user: { id: new Uint8Array(16), name: "harshalkanaskar1998@gmail.com", displayName: "Harshal kanaskar" },
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
        alert("Credential registered:", publicKeyCredential);
    } catch (error) {
        alert("Registration failed:", error);
    }
});
// webauthn.js

const loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", async () => {
    try {
        // Request an authentication
        const publicKeyCredential = await navigator.credentials.get({
            publicKey: {
                challenge: new Uint8Array(32),
                rpId: "DSUMicroProject123 Testing",
                allowCredentials: [
                    // Retrieve the user's registered credentials from the server
                    // (They must have been stored during registration)
                ],
            },
        });

        // Send the publicKeyCredential to the server for validation
        alert("Authentication successful:", publicKeyCredential);
    } catch (error) {
        alert("Authentication failed:", error);
    }
});
