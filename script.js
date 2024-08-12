const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const questionContainer = document.getElementById('questionContainer');
const pauseMessage = document.getElementById('pauseMessage');
const questionText = document.getElementById('questionText');
const hintElem = document.getElementById('hint');
const answersElem = Array.from(document.querySelectorAll('.answer'));
const scoreElem = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreElem = document.getElementById('gameOverText');
const restartButton = document.getElementById('restartButton');
const startButton = document.getElementById('startButton');
const difficultySelect = document.getElementById('difficulty');

let snake = [];
let apple = {};
let dx = gridSize;
let dy = 0;
let appleEaten = false;
let isPaused = false;
let questionAnswered = false;
let score = 0;
let currentQuestion = null;
let isGameOver = false;
let speed = 200;

const gridSize = 20;
const tileCount = { x: canvas.width / gridSize, y: canvas.height / gridSize };

function initializeGame() {
    snake = [{ x: Math.floor(tileCount.x / 2), y: Math.floor(tileCount.y / 2) }];
    dx = gridSize;
    dy = 0;
    appleEaten = false;
    isPaused = false;
    questionAnswered = false;
    score = 0;
    scoreElem.textContent = score;
    generateApple();
    document.addEventListener('keydown', handleKeyPress);
    gameInterval = setInterval(gameLoop, speed);
}

function moveSnake() {
    if (isPaused) return;
    
    const head = { ...snake[0] };
    head.x += dx / gridSize;
    head.y += dy / gridSize;
    snake.unshift(head);

    if (head.x === apple.x && head.y === apple.y) {
        appleEaten = true;
        score += 10;
        scoreElem.textContent = score;
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
        case 'w':
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -gridSize; }
            break;
        case 's':
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = gridSize; }
            break;
        case 'a':
        case 'ArrowLeft':
            if (dx === 0) { dx = -gridSize; dy = 0; }
            break;
        case 'd':
        case 'ArrowRight':
            if (dx === 0) { dx = gridSize; dy = 0; }
            break;
    }
}

function generateQuestion() {
    // Example questions - replace with your actual questions
    const questions = [
        { question: "What is 'apple' in French?", answers: ["Pomme", "Banane", "Orange"], correct: 0, hint: "It's a common fruit." },
        // Add more questions as needed
    ];
    currentQuestion = questions[Math.floor(Math.random() * questions.length)];
}

function displayQuestion() {
    if (appleEaten) {
        questionText.textContent = currentQuestion.question;
        hintElem.textContent = currentQuestion.hint;
        answersElem.forEach((btn, index) => {
            btn.textContent = currentQuestion.answers[index];
            btn.onclick = () => {
                checkAnswer(index);
            };
        });
        questionContainer.style.display = 'flex';
        pauseMessage.style.display = 'block';
        isPaused = true;
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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    ctx.fillStyle = '#0f0';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Draw the apple
    ctx.fillStyle = '#f00';
    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

function generateApple() {
    apple = {
        x: Math.floor(Math.random() * tileCount.x),
        y: Math.floor(Math.random() * tileCount.y)
    };
}

function gameOver() {
    clearInterval(gameInterval);
    gameOverScreen.style.display = 'flex';
    finalScoreElem.textContent = `Game Over! Final Score: ${score}`;
    isGameOver = true;
}

restartButton.addEventListener('click', () => {
    location.reload();
});

startButton.addEventListener('click', () => {
    if (isGameOver) {
        initializeGame();
        gameOverScreen.style.display = 'none';
    }
});
