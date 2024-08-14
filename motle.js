const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const RETRY_LIMIT = 3;
const RETRY_DELAY = 2000; // 2 seconds
let correctWord = "";
let currentAttempt = [];
let attempts = 0;
let gameOver = false;
let mode = '';

const words = [
    "table", "pomme", "chien", "fleur", "livre",
    "porte", "blanc", "votre", "jeune", "poulet"
];

function retryOperation(operation, retries = RETRY_LIMIT) {
    return new Promise((resolve, reject) => {
        function attempt() {
            try {
                operation();
                resolve();
            } catch (error) {
                console.error("Operation failed:", error);
                if (retries > 0) {
                    console.log(`Retrying... (${RETRY_LIMIT - retries + 1}/${RETRY_LIMIT})`);
                    setTimeout(() => attempt(), RETRY_DELAY);
                    retries--;
                } else {
                    reject(new Error("Operation failed after multiple attempts"));
                }
            }
        }
        attempt();
    });
}

async function initGame() {
    try {
        await retryOperation(() => {
            document.getElementById('daily-mode').addEventListener('click', () => startGame('daily'));
            document.getElementById('infinite-mode').addEventListener('click', () => startGame('infinite'));
            document.getElementById('play-again').addEventListener('click', resetGame);
        });
    } catch (error) {
        console.error("Initialization error:", error);
    }
}

async function startGame(selectedMode) {
    try {
        mode = selectedMode;
        await retryOperation(() => {
            document.getElementById('intro').classList.remove('hidden');
            document.getElementById('intro').classList.add('visible');
            document.getElementById('game').classList.add('hidden');
            document.getElementById('result').classList.add('hidden');
        });

        if (mode === 'daily') {
            await fetchDailyWord();
        } else {
            correctWord = getRandomWord();
            beginGame();
        }
    } catch (error) {
        console.error("Start game error:", error);
    }
}

async function fetchDailyWord() {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const index = hashString(today) % words.length;
        correctWord = words[index];
        beginGame();
    } catch (error) {
        console.error("Fetch daily word error:", error);
    }
}

function getRandomWord() {
    try {
        return words[Math.floor(Math.random() * words.length)].toLowerCase();
    } catch (error) {
        console.error("Get random word error:", error);
        return "";
    }
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

async function beginGame() {
    try {
        await retryOperation(() => {
            document.querySelector('header').classList.add('hidden');
            document.getElementById('intro').classList.add('hidden');
            document.getElementById('intro').classList.remove('visible');
            document.getElementById('game').classList.remove('hidden');
            document.getElementById('keyboard').classList.remove('hidden');
        });
        attempts = 0;
        currentAttempt = [];
        gameOver = false;
        createBoard();
        createKeyboard();
    } catch (error) {
        console.error("Begin game error:", error);
    }
}

async function createBoard() {
    try {
        await retryOperation(() => {
            const board = document.getElementById('board');
            board.innerHTML = '';
            for (let i = 0; i < MAX_ATTEMPTS * WORD_LENGTH; i++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                board.appendChild(tile);
            }
        });
    } catch (error) {
        console.error("Create board error:", error);
    }
}

async function createKeyboard() {
    try {
        await retryOperation(() => {
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
        });
    } catch (error) {
        console.error("Create keyboard error:", error);
    }
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

async function updateBoard() {
    try {
        const board = document.getElementById('board');
        const tiles = board.querySelectorAll('.tile');

        for (let i = 0; i < WORD_LENGTH; i++) {
            const tileIndex = attempts * WORD_LENGTH + i;
            tiles[tileIndex].textContent = currentAttempt[i] || '';
        }
    } catch (error) {
        console.error("Update board error:", error);
    }
}

async function submitAttempt() {
    if (gameOver || currentAttempt.length < WORD_LENGTH) return;

    try {
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
    } catch (error) {
        console.error("Submit attempt error:", error);
    }
}

async function showResult(message) {
    try {
        gameOver = true;
        document.getElementById('message').textContent = message;
        await retryOperation(() => {
            document.getElementById('result').classList.remove('hidden');
            document.getElementById('result').classList.add('visible');
        });
    } catch (error) {
        console.error("Show result error:", error);
    }
}

async function resetGame() {
    try {
        await retryOperation(() => {
            document.getElementById('result').classList.add('hidden');
            document.querySelector('header').classList.remove('hidden');
            document.getElementById('game').classList.add('hidden');
            document.getElementById('intro').classList.remove('hidden');
            document.getElementById('intro').classList.add('visible');
            document.getElementById('keyboard').innerHTML = '';
            attempts = 0;
            currentAttempt = [];
            gameOver = false;
        });
    } catch (error) {
        console.error("Reset game error:", error);
    }
}

document.addEventListener('DOMContentLoaded', initGame);
