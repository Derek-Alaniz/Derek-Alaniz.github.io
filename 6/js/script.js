
"use strict";

const DATA_URL = "data/instruments.json";

/**
 * Fetches instrument data from the external JSON file.
 * Returns an object containing the instrument families.
 */
async function loadInstrumentData() {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
        throw new Error("Unable to load instrument data.");
    }

    const instrumentData = await response.json();

    if (!Array.isArray(instrumentData.families)) {
        throw new Error("Invalid instrument data format.");
    }

    return instrumentData;
}

/**
 * Creates a button with a click event.
 * Returns the completed button element.
 */
function createButton(label, onClick) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "button";
    button.textContent = label;
    button.addEventListener("click", onClick);

    return button;
}

/**
 * Creates an instrument family card.
 * Returns the completed article element.
 */
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

/**
 * Creates an individual instrument card.
 * Returns the completed article element.
 */

/** Creates an instrument card with an image. */
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


/**
 * Creates an educational information section.
 * Returns the completed article element.
 */
function createInstrumentDetails(instrument) {
    const details = document.createElement("article");
    details.className = "instrument-card";

    // Display the instrument image when available.
    if (instrument.image) {
        const image = document.createElement("img");
        image.src = instrument.image;
        image.alt = `Illustration of a ${instrument.name}`;
        image.className = "instrument-image";

        details.appendChild(image);
    }

    // Create a table containing the instrument's facts.
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

    // Display the instrument's playing information.
    const playingHeading = document.createElement("h3");
    playingHeading.textContent = "How Is It Played?";

    const playingText = document.createElement("p");
    playingText.textContent = instrument.howToPlay;

    // Display the instrument's role in the orchestra.
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

/**
 * Initializes the explorer after the page loads.
 * Keeps the loaded data and navigation state local.
 */
async function initializeExplorer() {
    const content = document.getElementById("explorer-content");
    const title = document.getElementById("explorer-title");
    const description = document.getElementById("explorer-description");
    const backButton = document.getElementById("back-button");
    const errorMessage = document.getElementById("explorer-error");

    let families = [];
    let selectedFamily = null;

    /**
     * Updates the explorer heading and description.
     */
    function updateHeading(headingText, descriptionText) {
        title.textContent = headingText;
        description.textContent = descriptionText;
    }

    /**
     * Displays all four instrument families.
     */
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

    /**
     * Displays the instruments belonging to a selected family.
     */
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

    /**
     * Displays the selected instrument's educational information.
     */
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

    /**
     * Displays a loading error with an option to retry.
     */
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

    /**
     * Loads the JSON data and displays the family choices.
     */
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
