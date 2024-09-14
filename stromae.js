// Game state
const gameState = {
    currentPuzzle: null,
    score: 0,
    difficulty: 'easy',
    startTime: null,
    timerInterval: null,
    hintsUsed: 0,
    streak: 0,
    highScore: 0,
    totalPuzzlesSolved: 0
};

// DOM elements
const elements = {
    puzzleArea: document.getElementById('puzzle-area'),
    wordBank: document.getElementById('word-bank'),
    checkAnswerBtn: document.getElementById('check-answer'),
    newPuzzleBtn: document.getElementById('new-puzzle'),
    hintBtn: document.getElementById('hint'),
    scoreDisplay: document.getElementById('score'),
    timeDisplay: document.getElementById('time'),
    progressBar: document.getElementById('progress'),
    difficultyButtons: document.querySelectorAll('#difficulty-selector button'),
    modal: document.getElementById('modal'),
    modalTitle: document.getElementById('modal-title'),
    modalMessage: document.getElementById('modal-message'),
    modalClose: document.getElementById('modal-close'),
    achievementList: document.getElementById('achievement-list')
};

// Puzzles database
const puzzles = {
    easy: [
        { question: "Alors on ___", answer: "danse" }, // From "Alors On Danse"
        { question: "Papaoutai, où t’es, ___ t’es, où t’es?", answer: "papa" }, // From "Papaoutai"
        { question: "Tous les mêmes et y'en a ___ pour me dire que je suis un con", answer: "assez" }, // From "Tous Les Mêmes"
        { question: "Formidable, tu étais ___ j'étais fort minable", answer: "formidable" }, // From "Formidable"
        { question: "Je suis pas tout seul à être ___", answer: "seul" }, // From "Alors On Danse"
        { question: "C’est comme ça, c’est la ___", answer: "vie" }, // From "Formidable"
        { question: "Je sais pas si tu l’aimes encore, moi je sais que tu ___", answer: "mens" }, // From "Tous Les Mêmes"
        { question: "Alors on danse, et puis seulement ___", answer: "là" }, // From "Alors On Danse"
        { question: "Dites-moi d’où il ___ enfin je saurai où je vais", answer: "vient" }, // From "Papaoutai"
        { question: "Maman dit que lorsqu’on cherche bien, on finit toujours par ___", answer: "trouver" }, // From "Papaoutai"
        { question: "Quand je dis non, c’est ___", answer: "non" }, // From "Tous Les Mêmes"
        { question: "Tu étais ___ j’étais fort minable", answer: "formidable" }, // From "Formidable"
        { question: "On se prend des murs, des murs… des ___", answer: "murs" }, // From "Papaoutai"
        { question: "T’étais belle, je t’ai ___", answer: "cru" }, // From "Formidable"
        { question: "Là tu me fais peur, c’est ce que j'ai ___", answer: "pensé" } // From "Tous Les Mêmes"
    ],
    medium: [
        { question: "Quand c'est, que c'est, que c'est ___ ?", answer: "cancer" }, // From "Quand C’est"
        { question: "Et si je compte encore mes ___ ?", answer: "amis" }, // From "Carmen"
        { question: "On n'est pas bien là, à se dire que tout va bien... tout ___", answer: "va" }, // From "Sommeil"
        { question: "Les leçons de vie valent mieux que les ___", answer: "médicaments" }, // From "Ave Cesaria"
        { question: "L’amour est comme l’oiseau de ___", answer: "twitter" }, // From "Carmen"
        { question: "Je veux ton amour et je veux ___", answer: "mieux" }, // From "Carmen"
        { question: "Mais dis-moi qui est le ___ ?", answer: "héros" }, // From "Humain à l’eau"
        { question: "Quand c’est? Quand c’est ___ ?", answer: "assez" }, // From "Quand C’est"
        { question: "Toi tu voulais un enfant, mais moi je suis encore ___", answer: "jeune" }, // From "Sommeil"
        { question: "Si je t’aime trop, tu me ___", answer: "laisses" }, // From "Carmen"
        { question: "Tu sais qui je suis mais tu sais pas ce que je ___", answer: "veux" }, // From "Humain à l’eau"
        { question: "T'as pris mes copains, t’as pris mon ___", answer: "coeur" }, // From "Carmen"
        { question: "Tu voulais être ___ je voulais être heureux", answer: "fort" }, // From "Sommeil"
        { question: "Non, non, non, c’est pas si ___", answer: "simple" }, // From "Quand C’est"
        { question: "J’ai vu le monde, et tout ça pour ___", answer: "rien" } // From "Carmen"
    ],
    hard: [
        { question: "T’es tout seul dans ta tête, y’a ___ autour", answer: "personne" }, // From "Formidable"
        { question: "Non, non, non, on n’a pas d’enfants, mais on en ___", answer: "veut" }, // From "Tous Les Mêmes"
        { question: "Est-ce que tu sais ___ toi-même?", answer: "t’aimer" }, // From "Humain à l’eau"
        { question: "Car bien sûr qu’on est les champions des ___", answer: "ratés" }, // From "Ta Fête"
        { question: "Mais bien sûr qu’on est tous des ___", answer: "humains" }, // From "Humain à l’eau"
        { question: "Je n’ai rien de ___, je n’ai rien d’ordinaire", answer: "spécial" }, // From "Merci"
        { question: "Si je t’écoute encore une fois, je perds la ___", answer: "tête" }, // From "Te Quiero"
        { question: "Qui c'est qui s'en fout ? Qui c'est qui va ___ ?", answer: "pleurer" }, // From "Moules Frites"
        { question: "Je sais pas si je dois ___, ou bien si je dois fuir", answer: "lutter" }, // From "Humain à l’eau"
        { question: "C'est pas si grave, tout ce qu’on ___", answer: "perd" }, // From "Sommeil"
        { question: "Tu parles trop, mais moi je ___", answer: "t’écoute" }, // From "Humain à l’eau"
        { question: "T’es resté là, à attendre ton ___", answer: "tour" }, // From "Formidable"
        { question: "J’suis pas bien ici, pas bien dans ma ___", answer: "peau" }, // From "Te Quiero"
        { question: "Je t’aime mais ça me ___", answer: "détruit" }, // From "Te Quiero"
        { question: "Et si je t’écoute encore, c’est que je veux te ___", answer: "voir" } // From "Humain à l’eau"
    ]
};


// Achievements
const achievements = [
    { id: 'first_solve', name: 'First Solve', description: 'Solve your first puzzle', earned: false },
    { id: 'streak_5', name: 'On Fire', description: 'Solve 5 puzzles in a row', earned: false },
    { id: 'no_hints', name: 'No Help Needed', description: 'Solve a puzzle without using hints', earned: false },
    { id: 'speed_demon', name: 'Speed Demon', description: 'Solve a puzzle in under 10 seconds', earned: false },
    { id: 'master', name: 'Puzzle Master', description: 'Solve 50 puzzles in total', earned: false }
];

// Initialize game
function initGame() {
    elements.difficultyButtons.forEach(button => {
        button.addEventListener('click', () => setDifficulty(button.dataset.difficulty));
    });
    
    elements.checkAnswerBtn.addEventListener('click', checkAnswer);
    elements.newPuzzleBtn.addEventListener('click', newPuzzle);
    elements.hintBtn.addEventListener('click', getHint);
    elements.modalClose.addEventListener('click', closeModal);
    
    loadGameState();
    updateDisplay();
    newPuzzle();
    renderAchievements();
}

// Set difficulty
function setDifficulty(newDifficulty) {
    gameState.difficulty = newDifficulty;
    elements.difficultyButtons.forEach(button => {
        button.setAttribute('aria-pressed', button.dataset.difficulty === gameState.difficulty);
    });
    newPuzzle();
}

// Generate new puzzle
function newPuzzle() {
    gameState.currentPuzzle = getRandomPuzzle();
    gameState.hintsUsed = 0;
    renderPuzzle();
    renderWordBank();
    startTimer();
    updateProgressBar(0);
}

// Render puzzle
function renderPuzzle() {
    elements.puzzleArea.innerHTML = '';
    gameState.currentPuzzle.question.split(' ').forEach((word, index) => {
        const element = document.createElement(word === '___' ? 'div' : 'span');
        if (word === '___') {
            element.className = 'drop-zone';
            element.dataset.index = index;
            element.addEventListener('dragover', allowDrop);
            element.addEventListener('drop', drop);
            element.addEventListener('touchstart', touchStart, { passive: true });
            element.addEventListener('touchmove', touchMove, { passive: false });
            element.addEventListener('touchend', touchEnd);
        } else {
            element.textContent = word + ' ';
        }
        elements.puzzleArea.appendChild(element);
    });
}

// Render word bank
function renderWordBank() {
    elements.wordBank.innerHTML = '';
    const words = shuffleArray([gameState.currentPuzzle.answer, ...getRandomWords()]);
    words.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.className = 'word';
        wordElement.textContent = word;
        wordElement.draggable = true;
        wordElement.addEventListener('dragstart', drag);
        wordElement.addEventListener('touchstart', touchStart, { passive: true });
        wordElement.addEventListener('touchmove', touchMove, { passive: false });
        wordElement.addEventListener('touchend', touchEnd);
        elements.wordBank.appendChild(wordElement);
    });
}

// Check answer
function checkAnswer() {
    const userAnswer = Array.from(elements.puzzleArea.querySelectorAll('.drop-zone'))
        .map(zone => zone.textContent.trim())
        .join(' ');
    
    if (userAnswer === gameState.currentPuzzle.answer) {
        const timeTaken = Math.min((Date.now() - gameState.startTime) / 1000, getTimeLimit());
        const pointsEarned = calculatePoints(timeTaken);
        gameState.score += pointsEarned;
        gameState.streak++;
        gameState.totalPuzzlesSolved++;
        gameState.highScore = Math.max(gameState.highScore, gameState.score);
        showModal('Correct!', `You earned ${pointsEarned} points. Streak: ${gameState.streak}`);
        updateDisplay();
        saveGameState();
        checkAchievements(timeTaken);
        newPuzzle();
    } else {
        gameState.streak = 0;
        showModal('Not quite right', 'Try again!');
    }
}

// Calculate points
function calculatePoints(timeTaken) {
    const basePoints = { easy: 100, medium: 200, hard: 300 };
    const timeLimit = getTimeLimit();
    const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 };
    
    let points = basePoints[gameState.difficulty];
    points *= (1 - (timeTaken / timeLimit));
    points *= difficultyMultiplier[gameState.difficulty];
    points = Math.max(Math.floor(points) - (gameState.hintsUsed * 10), 10);
    
    return Math.round(points);
}

// Get time limit based on difficulty
function getTimeLimit() {
    return { easy: 30, medium: 45, hard: 60 }[gameState.difficulty];
}

// Start timer
function startTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    gameState.startTime = Date.now();
    gameState.timerInterval = setInterval(updateTimer, 1000);
}

// Update timer display
function updateTimer() {
    const timePassed = Math.min(Math.floor((Date.now() - gameState.startTime) / 1000), getTimeLimit());
    const minutes = Math.floor(timePassed / 60).toString().padStart(2, '0');
    const seconds = (timePassed % 60).toString().padStart(2, '0');
    elements.timeDisplay.textContent = `${minutes}:${seconds}`;
    updateProgressBar(timePassed);

    if (timePassed >= getTimeLimit()) {
        clearInterval(gameState.timerInterval);
        showModal('Time\'s up!', 'The puzzle time limit has been reached.');
        newPuzzle();
    }
}

// Update progress bar
function updateProgressBar(timePassed) {
    const timeLimit = getTimeLimit();
    const progress = Math.min((timePassed / timeLimit) * 100, 100);
    elements.progressBar.style.width = `${progress}%`;
    elements.progressBar.setAttribute('aria-valuenow', progress);
}

// Get hint
function getHint() {
    gameState.hintsUsed++;
    const emptyDropZones = Array.from(elements.puzzleArea.querySelectorAll('.drop-zone')).filter(zone => !zone.textContent);
    if (emptyDropZones.length > 0) {
        const randomZone = emptyDropZones[Math.floor(Math.random() * emptyDropZones.length)];
        const correctWord = gameState.currentPuzzle.answer.split(' ')[randomZone.dataset.index];
        randomZone.textContent = correctWord;
        removeWordFromBank(correctWord);
    }
}

// Remove word from bank
function removeWordFromBank(word) {
    const bankWords = elements.wordBank.querySelectorAll('.word');
    for (const bankWord of bankWords) {
        if (bankWord.textContent === word) {
            bankWord.remove();
            break;
        }
    }
}

// Show modal
function showModal(title, message) {
    elements.modalTitle.textContent = title;
    elements.modalMessage.textContent = message;
    elements.modal.style.display = 'block';
    elements.modal.setAttribute('aria-hidden', 'false');
}

// Close modal
function closeModal() {
    elements.modal.style.display = 'none';
    elements.modal.setAttribute('aria-hidden', 'true');
}

// Update display
function updateDisplay() {
    elements.scoreDisplay.textContent = gameState.score;
}

// Save game state
function saveGameState() {
    const state = {
        score: gameState.score,
        highScore: gameState.highScore,
        totalPuzzlesSolved: gameState.totalPuzzlesSolved,
        achievements: achievements
    };
    localStorage.setItem('wordPuzzleGameState', JSON.stringify(state));
}

// Load game state
function loadGameState() {
    const savedState = localStorage.getItem('wordPuzzleGameState');
    if (savedState) {
        const state = JSON.parse(savedState);
        gameState.score = state.score || 0;
        gameState.highScore = state.highScore || 0;
        gameState.totalPuzzlesSolved = state.totalPuzzlesSolved || 0;
        if (state.achievements) {
            achievements.forEach((achievement, index) => {
                achievement.earned = state.achievements[index].earned;
            });
        }
    }
}

// Drag and drop functions
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.textContent);
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    ev.target.textContent = data;
    removeWordFromBank(data);
}

// Touch events for mobile support
let draggedElement = null;

function touchStart(ev) {
    if (ev.target.className === 'word') {
        draggedElement = ev.target;
        ev.target.style.opacity = '0.5';
    }
}

function touchMove(ev) {
    if (draggedElement) {
        ev.preventDefault();
        const touch = ev.targetTouches[0];
        draggedElement.style.position = 'absolute';
        draggedElement.style.left = touch.pageX - 25 + 'px';
        draggedElement.style.top = touch.pageY - 25 + 'px';
    }
}

function touchEnd(ev) {
    if (draggedElement) {
        const dropZone = document.elementFromPoint(ev.changedTouches[0].pageX, ev.changedTouches[0].pageY);
        if (dropZone && dropZone.className === 'drop-zone') {
            dropZone.textContent = draggedElement.textContent;
            removeWordFromBank(draggedElement.textContent);
        }
        draggedElement.style.opacity = '1';
        draggedElement.style.position = 'static';
        draggedElement = null;
    }
}

// Helper functions
function getRandomPuzzle() {
    const puzzleSet = puzzles[gameState.difficulty];
    return puzzleSet[Math.floor(Math.random() * puzzleSet.length)];
}

function getRandomWords() {
    const allWords = puzzles[gameState.difficulty].flatMap(puzzle => puzzle.answer.split(' '));
    return shuffleArray(allWords.filter(word => word !== gameState.currentPuzzle.answer)).slice(0, 3);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Achievement system
function checkAchievements(timeTaken) {
    if (gameState.totalPuzzlesSolved === 1) {
        unlockAchievement('first_solve');
    }
    if (gameState.streak === 5) {
        unlockAchievement('streak_5');
    }
    if (gameState.hintsUsed === 0) {
        unlockAchievement('no_hints');
    }
    if (timeTaken < 10) {
        unlockAchievement('speed_demon');
    }
    if (gameState.totalPuzzlesSolved === 50) {
        unlockAchievement('master');
    }
}

function unlockAchievement(achievementId) {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.earned) {
        achievement.earned = true;
        showModal('Achievement Unlocked!', `${achievement.name}: ${achievement.description}`);
        renderAchievements();
        saveGameState();
    }
}

function renderAchievements() {
    elements.achievementList.innerHTML = '';
    achievements.forEach(achievement => {
        const li = document.createElement('li');
        li.textContent = achievement.name;
        li.title = achievement.description;
        li.className = achievement.earned ? 'earned' : 'locked';
        elements.achievementList.appendChild(li);
    });
}

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initGame);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initGame,
        setDifficulty,
        newPuzzle,
        checkAnswer,
        getHint,
        calculatePoints,
        getTimeLimit,
        updateTimer,
        updateProgressBar,
        showModal,
        closeModal,
        updateDisplay,
        saveGameState,
        loadGameState,
        checkAchievements,
        unlockAchievement,
        renderAchievements
    };
}
