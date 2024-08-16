const cities = [
    { name: "Paris", lat: 48.8566, lon: 2.3522, info: { fr: "Capitale de la France", en: "Capital of France" }, clues: { fr: ["Ville Lumière", "Tour Eiffel", "Louvre"], en: ["City of Light", "Eiffel Tower", "Louvre Museum"] } },
    { name: "Marseille", lat: 43.2965, lon: 5.3698, info: { fr: "Plus grand port de France", en: "Largest port in France" }, clues: { fr: ["Vieux-Port", "Calanques", "Basilique Notre-Dame de la Garde"], en: ["Old Port", "Calanques", "Notre-Dame de la Garde Basilica"] } },
    { name: "Lyon", lat: 45.7640, lon: 4.8357, info: { fr: "Capitale gastronomique", en: "Gastronomic capital" }, clues: { fr: ["Confluence", "Fourvière", "Fête des Lumières"], en: ["Confluence", "Fourvière", "Festival of Lights"] } },
    { name: "Toulouse", lat: 43.6047, lon: 1.4442, info: { fr: "Ville Rose", en: "Pink City" }, clues: { fr: ["Capitole", "Airbus", "Canal du Midi"], en: ["Capitol", "Airbus", "Canal du Midi"] } },
    { name: "Nice", lat: 43.7102, lon: 7.2620, info: { fr: "Capitale de la Côte d'Azur", en: "Capital of the French Riviera" }, clues: { fr: ["Promenade des Anglais", "Carnaval", "Vieux Nice"], en: ["Promenade des Anglais", "Carnival", "Old Nice"] } },
    { name: "Nantes", lat: 47.2184, lon: -1.5536, info: { fr: "Ville des Ducs de Bretagne", en: "City of the Dukes of Brittany" }, clues: { fr: ["Les Machines de l'île", "Château des ducs de Bretagne", "Passage Pommeraye"], en: ["The Machines of the Isle", "Castle of the Dukes of Brittany", "Passage Pommeraye"] } },
    { name: "Strasbourg", lat: 48.5734, lon: 7.7521, info: { fr: "Capitale européenne", en: "European Capital" }, clues: { fr: ["Parlement européen", "Cathédrale Notre-Dame", "Petite France"], en: ["European Parliament", "Notre-Dame Cathedral", "Petite France"] } },
    { name: "Montpellier", lat: 43.6110, lon: 3.8767, info: { fr: "Ville étudiante du sud", en: "Southern student city" }, clues: { fr: ["Place de la Comédie", "Faculté de Médecine", "Jardin des Plantes"], en: ["Place de la Comédie", "Faculty of Medicine", "Jardin des Plantes"] } },
    { name: "Bordeaux", lat: 44.8378, lon: -0.5792, info: { fr: "Capitale mondiale du vin", en: "World capital of wine" }, clues: { fr: ["Place de la Bourse", "Cité du Vin", "Pont de pierre"], en: ["Place de la Bourse", "Cité du Vin", "Stone Bridge"] } },
    { name: "Lille", lat: 50.6292, lon: 3.0573, info: { fr: "Capitale des Flandres", en: "Capital of Flanders" }, clues: { fr: ["Vieux-Lille", "Braderie de Lille", "Beffroi"], en: ["Old Lille", "Lille Flea Market", "Belfry"] } },
    { name: "Rennes", lat: 48.1173, lon: -1.6778, info: { fr: "Capitale de la Bretagne", en: "Capital of Brittany" }, clues: { fr: ["Parlement de Bretagne", "Les Champs Libres", "Parc du Thabor"], en: ["Parliament of Brittany", "Les Champs Libres", "Thabor Park"] } },
    { name: "Reims", lat: 49.2583, lon: 4.0317, info: { fr: "Cité des sacres", en: "City of coronations" }, clues: { fr: ["Cathédrale Notre-Dame", "Maisons de Champagne", "Palais du Tau"], en: ["Notre-Dame Cathedral", "Champagne Houses", "Palace of Tau"] } },
    { name: "Saint-Étienne", lat: 45.4397, lon: 4.3872, info: { fr: "Ville du design", en: "City of design" }, clues: { fr: ["Musée d'Art et d'Industrie", "Stade Geoffroy-Guichard", "Cité du design"], en: ["Museum of Art and Industry", "Geoffroy-Guichard Stadium", "Cité du design"] } },
    { name: "Le Havre", lat: 49.4944, lon: 0.1079, info: { fr: "Ville reconstruite par Auguste Perret", en: "City rebuilt by Auguste Perret" }, clues: { fr: ["Architecture Perret", "Plage", "MuMa"], en: ["Perret Architecture", "Beach", "MuMa"] } },
    { name: "Grenoble", lat: 45.1885, lon: 5.7245, info: { fr: "Capitale des Alpes", en: "Capital of the Alps" }, clues: { fr: ["Téléphérique de Grenoble Bastille", "Musée de Grenoble", "Parc Paul Mistral"], en: ["Grenoble Bastille Cable Car", "Grenoble Museum", "Paul Mistral Park"] } },
    { name: "Dijon", lat: 47.3220, lon: 5.0415, info: { fr: "Capitale de la Bourgogne", en: "Capital of Burgundy" }, clues: { fr: ["Palais des Ducs", "Moutarde", "Parcours de la Chouette"], en: ["Palace of the Dukes", "Mustard", "Owl's Trail"] } },
    { name: "Angers", lat: 47.4784, lon: -0.5632, info: { fr: "Capitale de l'Anjou", en: "Capital of Anjou" }, clues: { fr: ["Château d'Angers", "Tapisserie de l'Apocalypse", "Terra Botanica"], en: ["Angers Castle", "Apocalypse Tapestry", "Terra Botanica"] } },
    { name: "Nîmes", lat: 43.8367, lon: 4.3601, info: { fr: "Ville romaine", en: "Roman city" }, clues: { fr: ["Arènes de Nîmes", "Maison Carrée", "Jardins de la Fontaine"], en: ["Arena of Nîmes", "Maison Carrée", "Jardins de la Fontaine"] } },
    { name: "Aix-en-Provence", lat: 43.5297, lon: 5.4474, info: { fr: "Ville de Cézanne", en: "City of Cézanne" }, clues: { fr: ["Cours Mirabeau", "Atelier de Cézanne", "Fontaine de la Rotonde"], en: ["Cours Mirabeau", "Cézanne's Studio", "Rotunda Fountain"] } },
    { name: "Tours", lat: 47.3941, lon: 0.6848, info: { fr: "Capitale des châteaux de la Loire", en: "Capital of Loire Valley Castles" }, clues: { fr: ["Vieux Tours", "Cathédrale Saint-Gatien", "Place Plumereau"], en: ["Old Tours", "Saint-Gatien Cathedral", "Place Plumereau"] } }
];

let currentCity;
let score;
let timer;
let language = 'fr';
let map;
let markers = [];

const clueElement = document.getElementById("clue");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const newGameButton = document.getElementById("new-game");
const frBtn = document.getElementById("fr-btn");
const enBtn = document.getElementById("en-btn");
const instructionsBtn = document.getElementById("instructions-btn");
const instructionsModal = document.getElementById("instructions-modal");
const closeModal = document.querySelector(".close");
const cityNameElement = document.getElementById("city-name");
const cityInfoElement = document.getElementById("city-info");

function initializeMap() {
    map = L.map('map').setView([46.603354, 1.888334], 6); // Center of France
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

function addCityMarkers() {
    cities.forEach(city => {
        const marker = L.marker([city.lat, city.lon]).addTo(map);
        marker.on('mouseover', () => showCityInfo(city));
        marker.on('mouseout', hideCityInfo);
        marker.on('click', () => checkGuess(city));
        markers.push(marker);
    });
}

function showCityInfo(city) {
    cityNameElement.textContent = city.name;
    cityInfoElement.textContent = city.info[language];
}

function hideCityInfo() {
    cityNameElement.textContent = "";
    cityInfoElement.textContent = "";
}

function initializeGame() {
    currentCity = cities[Math.floor(Math.random() * cities.length)];
    score = 0;
    timer = 60;
    updateClue();
    updateScore();
    updateTimer();
    markers.forEach(marker => marker.setOpacity(1));
}

function updateClue() {
    const clueIndex = Math.floor(Math.random() * currentCity.clues[language].length);
    clueElement.textContent = currentCity.clues[language][clueIndex];
}

function updateScore() {
    scoreElement.textContent = score;
}

function updateTimer() {
    timerElement.textContent = timer;
    if (timer > 0) {
        timer--;
        setTimeout(updateTimer, 1000);
    } else {
        endGame();
    }
}

function checkGuess(guessedCity) {
    if (guessedCity.name === currentCity.name) {
        score += timer;
        updateScore();
        highlightCorrectCity();
        setTimeout(() => {
            alert(language === 'fr' ? "Bravo ! Vous avez deviné la bonne ville !" : "Congratulations! You guessed the correct city!");
            initializeGame();
        }, 1000);
    } else {
        alert(language === 'fr' ? "Désolé, ce n'est pas la bonne ville. Essayez encore !" : "Sorry, that's not the correct city. Try again!");
    }
}

function highlightCorrectCity() {
    markers.forEach(marker => {
        if (marker.getLatLng().lat === currentCity.lat && marker.getLatLng().lng === currentCity.lon) {
            marker.setOpacity(1);
        } else {
            marker.setOpacity(0.5);
        }
    });
}

function endGame() {
    alert(language === 'fr' ? `Temps écoulé ! Votre score final est ${score}.` : `Time's up! Your final score is ${score}.`);
    initializeGame();
}

function changeLanguage(lang) {
    language = lang;
    if (lang === 'fr') {
        frBtn.classList.add('active');
        enBtn.classList.remove('active');
    } else {
        enBtn.classList.add('active');
        frBtn.classList.remove('active');
    }
    updateUI();
}

function updateUI() {
    document.querySelector("#timer-container p").childNodes[0].textContent = language === 'fr' ? "Temps restant: " : "Time left: ";
    document.querySelector("#score-container p").childNodes[0].textContent = language === 'fr' ? "Score: " : "Score: ";
    newGameButton.textContent = language === 'fr' ? "Nouvelle Partie" : "New Game";
    
    // Update instructions modal
    const modalTitle = document.querySelector(".modal-content h2");
    const modalInstructions = document.querySelectorAll(".modal-content p");
    
    if (language === 'fr') {
        modalTitle.textContent = "Comment jouer";
        modalInstructions[0].textContent = "1. Lisez l'indice fourni sur une ville française.";
        modalInstructions[1].textContent = "2. Explorez la carte et survolez les marqueurs pour voir les informations sur les villes.";
        modalInstructions[2].textContent = "3. Cliquez sur le marqueur de la ville que vous pensez être la bonne réponse.";
        modalInstructions[3].textContent = "4. Gagnez des points en devinant correctement avant la fin du temps imparti.";
        modalInstructions[4].textContent = "5. Jouez autant de fois que vous voulez pour améliorer votre score !";
    } else {
        modalTitle.textContent = "How to Play";
        modalInstructions[0].textContent = "1. Read the provided clue about a French city.";
        modalInstructions[1].textContent = "2. Explore the map and hover over markers to see information about the cities.";
        modalInstructions[2].textContent = "3. Click on the marker of the city you think is the correct answer.";
        modalInstructions[3].textContent = "4. Earn points by guessing correctly before the time runs out.";
        modalInstructions[4].textContent = "5. Play as many times as you want to improve your score!";
    }

    updateClue();
    cities.forEach(city => {
        const marker = markers.find(m => m.getLatLng().lat === city.lat && m.getLatLng().lng === city.lon);
        if (marker) {
            marker.unbindTooltip();
            marker.bindTooltip(city.name, {permanent: false, direction: 'top'});
        }
    });
}

function showInstructions() {
    instructionsModal.style.display = "block";
}

function hideInstructions() {
    instructionsModal.style.display = "none";
}

newGameButton.addEventListener("click", initializeGame);
frBtn.addEventListener("click", () => changeLanguage('fr'));
enBtn.addEventListener("click", () => changeLanguage('en'));
instructionsBtn.addEventListener("click", showInstructions);
closeModal.addEventListener("click", hideInstructions);

window.addEventListener("click", (event) => {
    if (event.target == instructionsModal) {
        hideInstructions();
    }
});

// Initialize the game
initializeMap();
addCityMarkers();
initializeGame();
updateUI();
