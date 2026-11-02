
"use strict";

import { auth, db } from "./firebase-config.js";

import {
    ref,
    push
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js";

const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-status");
const submitButton = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    contactStatus.textContent = "Sending your message...";

    try {
        await auth.authStateReady();

        if (!auth.currentUser) {
            throw new Error("Please log in before sending a message.");
        }

        const submission = {
            name: document.querySelector("#name").value.trim(),
            email: document.querySelector("#email").value.trim(),
            topic: document.querySelector("#topic").value,
            message: document.querySelector("#message").value.trim(),
            createdAt: new Date().toISOString()
        };

        await push(ref(db, "contacts"), submission);

        contactStatus.textContent = "Your message was sent successfully!";
        contactForm.reset();

    } catch (error) {
        console.error("Contact submission failed:", error);
        contactStatus.textContent =
            "Unable to send your message. Please try again.";
    } finally {
        submitButton.disabled = false;
    }
});
