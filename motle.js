const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 5;
let correctWord = "";
let currentAttempt = [];
let attempts = 0;
let gameOver = false;

const words = [
    "table", "pomme", "chien", "fleur", "livre",
    "porte", "blanc", "votre", "jeune", "piano",
    "brise", "soupe", "plage", "grise", "tigre",
    "salle", "vache", "pluie", "frais", "champ",
    "garde", "motel", "ombre", "femme", "joies",
    "pente", "sucre", "poule", "bouse", "cable",
    "avion", "peche", "louve", "sueur"
];

function initGame() {
    loadGame(() => {
        correctWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
        attempts = 0;
        currentAttempt = [];
        gameOver = false;
        createBoard();
        createKeyboard();
    });
}

function loadGame(callback) {
    // Simulate loading time to ensure everything is ready before starting
    setTimeout(() => {
        callback();
    }, 1000); // 1-second delay to simulate loading time
}

function createBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    for (let i = 0; i < MAX_ATTEMPTS * WORD_LENGTH; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        board.appendChild(tile);
    }
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    const keys = 'qwertyuiopasdfghjklzxcvbnm'.split('');

    keys.forEach(key => {
        const button = document.createElement('button');
        button.textContent = key;
        button.setAttribute('data-key', key);
        button.addEventListener('click', () => handleKeyPress(key));
        keyboard.appendChild(button);
    });

    const enterButton = document.createElement('button');
    enterButton.textContent = 'Yes';
    enterButton.addEventListener('click', submitAttempt);
    keyboard.appendChild(enterButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '←';
    deleteButton.addEventListener('click', deleteLetter);
    keyboard.appendChild(deleteButton);
}

function handleKeyPress(key) {
    if (gameOver || currentAttempt.length >= WORD_LENGTH) return;
    currentAttempt.push(key);
    updateBoard();
}

function deleteLetter() {
    if (gameOver || currentAttempt.length === 0) return;
    currentAttempt.pop();
    updateBoard();
}

function updateBoard() {
    const board = document.getElementById('board');
    const tiles = board.querySelectorAll('.tile');

    for (let i = 0; i < WORD_LENGTH; i++) {
        const tileIndex = attempts * WORD_LENGTH + i;
        tiles[tileIndex].textContent = currentAttempt[i] || '';
    }
}

function submitAttempt() {
    if (gameOver || currentAttempt.length < WORD_LENGTH) return;
    
    const board = document.getElementById('board');
    const tiles = board.querySelectorAll('.tile');

    let correct = 0;
    const letterCounts = {};

    // Count the occurrences of each letter in the correct word
    for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = correctWord[i];
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
        const tileIndex = attempts * WORD_LENGTH + i;
        const tile = tiles[tileIndex];
        const letter = currentAttempt[i];
        
        if (letter === correctWord[i]) {
            tile.classList.add('correct');
            letterCounts[letter]--;
            correct++;
        } else if (correctWord.includes(letter) && letterCounts[letter] > 0) {
            tile.classList.add('present');
            letterCounts[letter]--;
        } else {
            tile.classList.add('absent');
        }
    }

    if (correct === WORD_LENGTH) {
        showResult(`🎉 Congratulations! The correct word is "${correctWord.toUpperCase()}".`);
    } else {
        attempts++;
        if (attempts >= MAX_ATTEMPTS) {
            showResult(`😢 Game Over! The correct word was "${correctWord.toUpperCase()}".`);
        } else {
            currentAttempt = [];
        }
    }
}

function showResult(message) {
    const result = document.getElementById('result');
    const messageEl = document.getElementById('message');
    messageEl.textContent = message;
    result.classList.remove('hidden');
    gameOver = true;
}

function resetGame() {
    const result = document.getElementById('result');
    result.classList.add('hidden');
    initGame();
}

window.onload = initGame;
