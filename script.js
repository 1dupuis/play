const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const questionContainer = document.getElementById('questionContainer');
const questionElem = document.getElementById('question');
const hintElem = document.getElementById('hint');
const answersElem = Array.from(document.querySelectorAll('.answer'));
const scoreElem = document.getElementById('score');
const highScoreElem = document.getElementById('highScore');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreElem = document.getElementById('finalScore');
const startButton = document.getElementById('startGame');
const restartButton = document.getElementById('restartGame');
const difficultySelect = document.getElementById('difficulty');
const pauseMessage = document.getElementById('pauseMessage');
const backgroundMusic = new Audio('background-music.mp3');

const gridSize = 20;
const tileCount = {
    x: canvas.width / gridSize,
    y: canvas.height / gridSize,
};

let snake;
let apple;
let dx;
let dy;
let score;
let highScore = 0;
let speed;
let gameInterval;
let currentQuestion;
let questionAnswered;
let isPaused;
let appleEaten;
let scoreMultiplier;
let powerUps;
let isGameOver;
let gameLevel;

const questions = [
    { question: 'What is "hello" in French?', answers: ['Bonjour', 'Merci', 'Au revoir'], correct: 0, hint: 'It means "hello"' },
    { question: 'What is "thank you" in French?', answers: ['Bonjour', 'Merci', 'Au revoir'], correct: 1, hint: 'It is a polite way to express gratitude' },
    { question: 'What is "goodbye" in French?', answers: ['Bonjour', 'Merci', 'Au revoir'], correct: 2, hint: 'It is used when leaving' }
];

const powerUpTypes = ['DoubleScore', 'ExtraLife'];

function initializeGame() {
    snake = [{ x: 5, y: 5 }];
    apple = { x: 10, y: 10 };
    dx = gridSize;
    dy = 0;
    score = 0;
    scoreMultiplier = 1;
    isGameOver = false;
    isPaused = false;
    questionAnswered = false;
    appleEaten = false;
    gameLevel = 1;
    powerUps = [];
    questionContainer.classList.add('hidden');
    pauseMessage.classList.add('hidden');
    speed = 100 - (difficultySelect.value - 1) * 30;
    document.removeEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleKeyPress);
    gameInterval = setInterval(gameLoop, speed);
    generateQuestion();
    playBackgroundMusic();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'green';
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });

    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);

    powerUps.forEach(pu => {
        ctx.fillStyle = 'blue';
        ctx.fillRect(pu.x * gridSize, pu.y * gridSize, gridSize, gridSize);
    });

    if (isPaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Paused: Answer Question', canvas.width / 2, canvas.height / 2);
    }
}

function moveSnake() {
    if (isPaused || questionAnswered) return;

    const head = { x: snake[0].x + dx / gridSize, y: snake[0].y + dy / gridSize };

    snake.unshift(head);

    if (head.x === apple.x && head.y === apple.y) {
        appleEaten = true;
        score += scoreMultiplier;
        generateQuestion();
        displayQuestion();
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= tileCount.x || head.y < 0 || head.y >= tileCount.y || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
    }
}

function handleKeyPress(e) {
    switch (e.key) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -gridSize; }
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = gridSize; }
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -gridSize; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = gridSize; dy = 0; }
            break;
    }
}

function generateQuestion() {
    currentQuestion = questions[Math.floor(Math.random() * questions.length)];
}

function displayQuestion() {
    if (appleEaten) {
        questionElem.textContent = currentQuestion.question;
        hintElem.textContent = currentQuestion.hint;
        answersElem.forEach((btn, index) => {
            btn.textContent = currentQuestion.answers[index];
            btn.onclick = () => {
                checkAnswer(index);
            };
        });
        questionContainer.style.display = 'flex';
        isPaused = true;
        pauseMessage.style.display = 'none';
    }
}

function checkAnswer(index) {
    if (index === currentQuestion.correct) {
        questionAnswered = true;
        questionContainer.style.display = 'none';
        pauseMessage.style.display = 'none';
        appleEaten = false;
        generateApple();
    } else {
        score -= 1;
        hintElem.textContent = 'Incorrect, try again! Hint: ' + currentQuestion.hint;
    }
}

function gameLoop() {
    if (!isPaused) {
        moveSnake();
        draw();
    }
}

function gameOver() {
    clearInterval(gameInterval);
    isGameOver = true;
    gameOverScreen.style.display = 'flex';
    finalScoreElem.textContent = `Game Over! Final Score: ${score}`;
    document.removeEventListener('keydown', handleKeyPress);
}

function restartGame() {
    initializeGame();
    gameOverScreen.style.display = 'none';
}

function playBackgroundMusic() {
    backgroundMusic.loop = true;
    backgroundMusic.play();
}

startButton.onclick = initializeGame;
restartButton.onclick = restartGame;
difficultySelect.addEventListener('change', () => {
    if (!isGameOver) {
        clearInterval(gameInterval);
        speed = 100 - (difficultySelect.value - 1) * 30;
        gameInterval = setInterval(gameLoop, speed);
    }
});
