async function loadBoardingData() {
    try {
        const response = await fetch("js/boardingData.json");

        if (!response.ok) {
            throw new Error("Could not load snowboarding data.");
        }

        const data = await response.json();

        document.title = data.title;
        document.getElementById("styleName").textContent = data.header;

        document.getElementById("heroTitle").textContent =
            data.hero.headline;
        document.getElementById("heroDesc").textContent =
            data.hero.description;

       
        document.getElementById("heroSection").style.setProperty(
            "--hero-img",
            'url("/5/img/alpineBoarding.jpg")');

        document.getElementById("sec1Title").textContent =
            data.sections.overview.title;
        document.getElementById("sec1Subtitle").textContent =
            data.sections.overview.subtitle;

        const overviewCards =
            document.querySelectorAll("#sec1Grid .card");

        data.sections.overview.cards.forEach((cardData, index) => {
            overviewCards[index].querySelector("h3").textContent =
                cardData.title;

            overviewCards[index].querySelector("p").textContent =
                cardData.description;
        });

        document.getElementById("sec2Title").textContent =
            data.sections.equipment.title;
        document.getElementById("sec2Subtitle").textContent =
            data.sections.equipment.subtitle;

        const equipmentCards =
            document.querySelectorAll("#sec2Grid .card");

        data.sections.equipment.cards.forEach((cardData, index) => {
            equipmentCards[index].querySelector("h3").textContent =
                cardData.title;

            equipmentCards[index].querySelector("p").textContent =
                cardData.description;
        });

    } catch (error) {
        console.error("Error loading snowboarding data:", error);
    }
}

 loadBoardingData();