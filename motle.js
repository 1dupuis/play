const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
let correctWord = "";
let currentAttempt = [];
let attempts = 0;
let gameOver = false;
let mode = '';

const words = [
    "table", "pomme", "chien", "fleur", "livre",
    "porte", "blanc", "votre", "jeune", "poulet"
];

function initGame() {
    document.getElementById('daily-mode').addEventListener('click', () => startGame('daily'));
    document.getElementById('infinite-mode').addEventListener('click', () => startGame('infinite'));
    document.getElementById('play-again').addEventListener('click', resetGame);
}

function startGame(selectedMode) {
    mode = selectedMode;
    document.getElementById('intro').classList.remove('hidden');
    document.getElementById('intro').classList.add('visible');
    document.getElementById('game').classList.add('hidden');
    document.getElementById('result').classList.add('hidden');

    if (mode === 'daily') {
        fetchDailyWord();
    } else {
        correctWord = getRandomWord();
        beginGame();
    }
}

function showIntro() {
    const intro = document.getElementById('intro');
    intro.classList.remove('hidden');
    intro.classList.add('visible');
}

function fetchDailyWord() {
    const today = new Date().toISOString().slice(0, 10);
    const index = hashString(today) % words.length;
    correctWord = words[index];
    beginGame();
}

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)].toLowerCase();
}

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    return Math.abs(hash);
}

function beginGame() {
    document.querySelector('header').classList.add('hidden');
    document.getElementById('intro').classList.add('hidden');
    document.getElementById('intro').classList.remove('visible');
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('keyboard').classList.remove('hidden');
    attempts = 0;
    currentAttempt = [];
    gameOver = false;
    createBoard();
    createKeyboard();
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
    enterButton.textContent = 'Enter';
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

    for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = correctWord[i];
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }

    currentAttempt.forEach((letter, i) => {
        const tileIndex = attempts * WORD_LENGTH + i;
        const tile = tiles[tileIndex];
        const isCorrect = letter === correctWord[i];
        const isPresent = !isCorrect && correctWord.includes(letter);

        tile.classList.remove('correct', 'present', 'absent');
        if (isCorrect) {
            tile.classList.add('correct');
            correct++;
            letterCounts[letter]--;
        } else if (isPresent && letterCounts[letter] > 0) {
            tile.classList.add('present');
            letterCounts[letter]--;
        } else {
            tile.classList.add('absent');
        }
    });

    if (correct === WORD_LENGTH) {
        showResult('Congratulations! You guessed the word!');
    } else if (attempts >= MAX_ATTEMPTS - 1) {
        showResult(`Game Over! The correct word was "${correctWord}".`);
    } else {
        attempts++;
        currentAttempt = [];
        updateBoard();
    }
}

function showResult(message) {
    gameOver = true;
    document.getElementById('message').textContent = message;
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('result').classList.add('visible');
}

function resetGame() {
    document.getElementById('result').classList.add('hidden');
    document.querySelector('header').classList.remove('hidden');
    document.getElementById('game').classList.add('hidden');
    document.getElementById('intro').classList.remove('hidden');
    document.getElementById('intro').classList.add('visible');
}

document.addEventListener('DOMContentLoaded', initGame);
