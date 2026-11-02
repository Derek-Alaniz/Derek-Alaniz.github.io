
"use strict";

import { auth, db } from "./firebase-config.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js";


async function loadInstrumentData() {
    await auth.authStateReady();

    if (!auth.currentUser) {
        throw new Error("You must be logged in to view instruments.");
    }

    const snapshot = await get(ref(db, "families"));

    if (!snapshot.exists()) {
        throw new Error("No instrument data found in Firebase.");
    }

    const familyData = snapshot.val();

    const families = Array.isArray(familyData)
        ? familyData
        : Object.values(familyData);

    if (!families.length) {
        throw new Error("Invalid instrument data format.");
    }

    // Firebase may return instrument arrays as keyed objects
    families.forEach((family) => {
        if (family.instruments && !Array.isArray(family.instruments)) {
            family.instruments = Object.values(family.instruments);
        }
    });

    return { families };
}


function createButton(label, onClick) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "button";
    button.textContent = label;
    button.addEventListener("click", onClick);

    return button;
}

function createFamilyCard(family, onSelect) {
    const card = document.createElement("article");
    card.className = "instrument-card";

    const heading = document.createElement("h3");
    heading.textContent = family.name;

    const description = document.createElement("p");
    description.textContent = family.description;

    const button = createButton(
        `Explore ${family.name}`,
        () => onSelect(family)
    );

    card.append(heading, description, button);

    return card;
}

function createInstrumentCard(instrument, onSelect) {
    const card = document.createElement("article");
    card.className = "instrument-card";

    if (instrument.image) {
        const image = document.createElement("img");
        image.src = instrument.image;
        image.alt = `Illustration of a ${instrument.name}`;
        image.className = "instrument-card-image";
        card.appendChild(image);
    }

    const heading = document.createElement("h3");
    heading.textContent = instrument.name;

    const description = document.createElement("p");
    description.textContent = instrument.description;

    const button = createButton(
        `Learn About the ${instrument.name}`,
        () => onSelect(instrument)
    );

    card.append(heading, description, button);

    return card;
}

function createInstrumentDetails(instrument) {
    const details = document.createElement("article");
    details.className = "instrument-card";

    if (instrument.image) {
        const image = document.createElement("img");
        image.src = instrument.image;
        image.alt = `Illustration of a ${instrument.name}`;
        image.className = "instrument-image";

        details.appendChild(image);
    }

    if (instrument.facts) {
        const factsHeading = document.createElement("h3");
        factsHeading.textContent = "Instrument Information";

        const table = document.createElement("table");
        table.className = "data-table";

        const tableBody = document.createElement("tbody");

        Object.entries(instrument.facts).forEach(([label, value]) => {
            const row = document.createElement("tr");

            const heading = document.createElement("th");
            heading.scope = "row";
            heading.textContent = label;

            const cell = document.createElement("td");
            cell.textContent = value;

            row.append(heading, cell);
            tableBody.appendChild(row);
        });

        table.appendChild(tableBody);
        details.append(factsHeading, table);
    }

    const playingHeading = document.createElement("h3");
    playingHeading.textContent = "How Is It Played?";

    const playingText = document.createElement("p");
    playingText.textContent = instrument.howToPlay;

    const roleHeading = document.createElement("h3");
    roleHeading.textContent = "Role in the Orchestra";

    const roleText = document.createElement("p");
    roleText.textContent = instrument.orchestraRole;

    details.append(
        playingHeading,
        playingText,
        roleHeading,
        roleText
    );

    return details;
}

async function initializeExplorer() {
    const content = document.getElementById("explorer-content");
    const title = document.getElementById("explorer-title");
    const description = document.getElementById("explorer-description");
    const backButton = document.getElementById("back-button");
    const errorMessage = document.getElementById("explorer-error");

    let families = [];
    let selectedFamily = null;

    function updateHeading(headingText, descriptionText) {
        title.textContent = headingText;
        description.textContent = descriptionText;
    }

    function displayFamilies() {
        selectedFamily = null;

        updateHeading(
            "Choose an Instrument Family",
            "Select one of the four instrument families below to begin exploring."
        );

        content.replaceChildren();

        families.forEach((family) => {
            const card = createFamilyCard(family, displayInstruments);
            content.appendChild(card);
        });

        backButton.hidden = true;
        backButton.onclick = null;
    }

    function displayInstruments(family) {
        selectedFamily = family;

        updateHeading(
            `The ${family.name} Family`,
            family.description
        );

        content.replaceChildren();

        family.instruments.forEach((instrument) => {
            const card = createInstrumentCard(
                instrument,
                displayInstrumentDetails
            );

            content.appendChild(card);
        });

        backButton.hidden = false;
        backButton.onclick = displayFamilies;
    }

    function displayInstrumentDetails(instrument) {
        updateHeading(
            instrument.name,
            instrument.description
        );

        content.replaceChildren();

        const details = createInstrumentDetails(instrument);
        content.appendChild(details);

        backButton.hidden = false;
        backButton.onclick = () => {
            displayInstruments(selectedFamily);
        };
    }

    function displayError() {
        content.replaceChildren();

        updateHeading(
            "Unable to Load Instruments",
            "We couldn't retrieve the instrument information."
        );

        errorMessage.textContent =
            "Please check your connection or try again.";

        errorMessage.hidden = false;
        backButton.hidden = true;

        const retryButton = createButton(
            "Try Again",
            loadAndDisplayData
        );

        content.appendChild(retryButton);
    }

    async function loadAndDisplayData() {
        content.replaceChildren();

        const loadingMessage = document.createElement("p");
        loadingMessage.textContent = "Loading instruments...";
        content.appendChild(loadingMessage);

        errorMessage.hidden = true;
        backButton.hidden = true;

        try {
            const instrumentData = await loadInstrumentData();
            families = instrumentData.families;

            const params = new URLSearchParams(window.location.search);
            const requestedFamily = params.get("family");

            const matchingFamily = families.find(
                family => family.id === requestedFamily
            );

            if(matchingFamily){
                displayInstruments(matchingFamily);
            }else {
                displayFamilies();
            }

        } catch (error) {
            displayError();
        }
    }

    await loadAndDisplayData();
}

document.addEventListener("DOMContentLoaded", initializeExplorer);
