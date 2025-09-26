let currentPageUrl = 'https://rickandmortyapi.com/api/character'

window.onload = async () => {
    try {
        await loadCharacters(currentPageUrl);
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar cards');
    }

    const nextButton = document.getElementById('next-button');
    const backButton = document.getElementById('back-button');

    nextButton.addEventListener('click', loadNextPage);
    backButton.addEventListener('click', loadPreviousPage);
};

async function loadCharacters(url) {
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = ''; // Limpar os resultados anteriores.

    try {

        const response = await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach((character) => {
            const card = document.createElement("div");
            card.style.backgroundImage = `url(${character.image})`;
            card.className = "cards";

            const characterNameBG = document.createElement("div");
            characterNameBG.className = "character-name-bg";

            const characterName = document.createElement("span");
            characterName.className = "character-name";
            characterName.innerText = `${character.name}`;

            characterNameBG.appendChild(characterName);
            card.appendChild(characterNameBG);

            card.onclick = () => {
                const modal = document.getElementById("modal");
                modal.style.visibility = "visible";

                const modalContent = document.getElementById("modal-content");
                modalContent.innerHTML = "";

                const characterImage = document.createElement("div");
                characterImage.style.backgroundImage = 
                `url(${character.image})`;
                characterImage.className = "character-image";

                const characterName = document.createElement("span");
                characterName.className = "character-details";
                characterName.innerText = `Nome: ${character.name}`;

                const characterStatus = document.createElement("span");
                characterStatus.className = "character-details";
                characterStatus.innerText = `Status: ${convertStatus(character.status)}`;

                const characterSpecies = document.createElement("span");
                characterSpecies.className = "character-details";
                characterSpecies.innerText = `Especie: ${convertSpecies(character.species)}`;

                const characterGender= document.createElement("span");
                characterGender.className = "character-details";
                characterGender.innerText = `Genero: ${convertGender(character.gender)}`;

                const characterOrigin= document.createElement("span");
                characterOrigin.className = "character-details";
                characterOrigin.innerText = `origem ${character.origin.name === "unknown" ? "desconhecida" : character.origin.name}`;

                modalContent.appendChild(characterImage)
                modalContent.appendChild(characterName)
                modalContent.appendChild(characterStatus)
                modalContent.appendChild(characterSpecies)
                modalContent.appendChild(characterGender)
                modalContent.appendChild(characterOrigin)
            }

            mainContent.appendChild(card);
        });

        const nextButton = document.getElementById('next-button');
        const backButton = document.getElementById('back-button');

        nextButton.disabled = !responseJson.info.next;
        backButton.disabled = !responseJson.info.prev;

        backButton.style.visibility = responseJson.info.prev? "visible" : "hidden";

        currentPageUrl = url;

    } catch (error) {
        alert('Erro ao carregar os personagens');
        console.log(error);
    }
}

async function loadNextPage() {
    if (!currentPageUrl) return;

    try {
        const response =  await fetch(currentPageUrl);
        const responseJson = await response.json();

        await loadCharacters(responseJson.info.next);

    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a próxima página');
    }
}

async function loadPreviousPage() {
    if (!currentPageUrl) return;

    try {
        const response =  await fetch(currentPageUrl);
        const responseJson = await response.json();

        await loadCharacters(responseJson.info.prev);

    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a página anterior');
    }
}

function hideModal() {
    const modal = document.getElementById("modal");
    modal.style.visibility = "hidden"
}

function convertStatus(status) {
    const characterStatus = {
        alive: "vivo",
        dead: "morto",
        unknow: "desconhecido",
    };
    
    return characterStatus[status.toLowerCase()] || status;
}

function convertSpecies(species) {
    const convertSpecies = {
        human: "humano",
        alien: "alienigena",
        humanoid: "humanoid",
        animal: "animal",
        "mythological creature": "criatura mitologica",
        disease: "doença",
        robot: "robo",
        unknow: "desconhecido",
    };
    
    return convertSpecies[species.toLowerCase()] || species;
}

function convertGender(gender) {
    const convertGender = {
        male: "homem",
        female: "mulher",
        unknown: "desconhecido",
    };
    
    return convertGender[gender.toLowerCase()] || gender;
}