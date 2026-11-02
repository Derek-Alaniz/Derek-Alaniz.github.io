
import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    updatePassword
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");
const accountPrompt = document.querySelector("#account-prompt");
const loginTitle = document.querySelector(".login-box h2");
const submitButton = loginForm.querySelector('button[type="submit"]');

let signupMode = false;

accountPrompt.addEventListener("click", (event) => {
    if (event.target.id !== "signup-link") {
        return;
    }

    event.preventDefault();

    signupMode = !signupMode;

    loginTitle.textContent = signupMode
        ? "Create an Account"
        : "Welcome Back";

    submitButton.textContent = signupMode
        ? "Sign Up"
        : "Log In";

    loginMessage.textContent = "";

    accountPrompt.innerHTML = signupMode
        ? 'Already have an account? <a href="#" id="signup-link">Log In</a>'
        : 'Don\'t have an account? <a href="#" id="signup-link">Sign Up</a>';
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;

    loginMessage.textContent = signupMode
        ? "Creating your account..."
        : "Logging in...";

    submitButton.disabled = true;

    try {
        if (signupMode) {
            await createUserWithEmailAndPassword(auth, email, password);
        } else {
            await signInWithEmailAndPassword(auth, email, password);
        }

        loginMessage.textContent = signupMode
            ? "Account created successfully! Redirecting..."
            : "Login successful! Redirecting...";

        window.location.href = "explore.html";

    } catch (error) {
        loginMessage.textContent =
            "Authentication failed: " + error.message;

    } finally {
        submitButton.disabled = false;
    }
});

const passwordSection = document.querySelector("#password-change-section");
const passwordForm = document.querySelector("#password-change-form");
const passwordMessage = document.querySelector("#password-change-message");

onAuthStateChanged(auth, (user) => {
    passwordSection.hidden = !user;
});

passwordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = auth.currentUser;
    const newPassword = document.querySelector("#new-password").value;
    const changeButton = passwordForm.querySelector('button[type="submit"]');

    if (!user) {
        passwordMessage.textContent = "You must be logged in.";
        return;
    }

    changeButton.disabled = true;
    passwordMessage.textContent = "Updating password...";

    try {
        await updatePassword(user, newPassword);

        passwordMessage.textContent =
            "Password updated successfully!";

        passwordForm.reset();

    } catch (error) {
        if (error.code === "auth/requires-recent-login") {
            passwordMessage.textContent =
                "Please log out and log in again before changing your password.";
        } else {
            passwordMessage.textContent =
                "Password change failed: " + error.message;
        }
    } finally {
        changeButton.disabled = false;
    }
});
