
// webauthn.js
const registerButton = document.getElementById("registerButton");

registerButton.addEventListener("click", async () => {
    try {
        // Request a credential creation
        const publicKeyCredential = await navigator.credentials.create({
            publicKey: {
                // User and challenge information
                rp: { name: "http://127.0.0.1:5500/register.html" },
                user: { id: new Uint8Array(16), name: "harshalkanaskar2005@gmail.com", displayName: "Harshal kanaskar" },
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
        console.log("Credential registered:", publicKeyCredential);
    } catch (error) {
        console.error("Registration failed:", error);
    }
});
