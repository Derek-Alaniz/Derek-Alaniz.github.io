
import { auth } from "./firebase-config.js";

import { signOut } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

const logoutButton = document.querySelector("#logout-btn");

if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
        logoutButton.disabled = true;
        logoutButton.textContent = "Logging out...";

        try {
            await signOut(auth);
            window.location.replace("index.html");
        } catch (error) {
            logoutButton.disabled = false;
            logoutButton.textContent = "Log Out";

            const message = document.querySelector("#logout-message");
            if (message) {
                message.textContent = "Logout failed: " + error.message;
            }
        }
    });
}
