const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const questionElem = document.getElementById('question');
const answersElem = Array.from(document.querySelectorAll('.answer'));
const scoreElem = document.getElementById('score');
const highScoreElem = document.getElementById('highScore');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreElem = document.getElementById('finalScore');
const startButton = document.getElementById('startGame');
const restartButton = document.getElementById('restartGame');
const difficultySelect = document.getElementById('difficulty');

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
let isGameOver;
let speed;
let gameInterval;

const questions = [
    { question: 'What is "hello" in French?', answers: ['Bonjour', 'Merci', 'Au revoir'], correct: 0 },
    { question: 'What is "thank you" in French?', answers: ['Bonjour', 'Merci', 'Au revoir'], correct: 1 },
    { question: 'What is "goodbye" in French?', answers: ['Bonjour', 'Merci', 'Au revoir'], correct: 2 }
];

function initializeGame() {
    snake = [{ x: 5, y: 5 }];
    apple = { x: 10, y: 10 };
    dx = gridSize;
    dy = 0;
    score = 0;
    isGameOver = false;
    speed = 100 - (difficultySelect.value - 1) * 30; // Adjust speed based on difficulty
    document.removeEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleKeyPress);
    gameInterval = setInterval(gameLoop, speed);
    generateQuestion();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'green';
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });

    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

function moveSnake() {
    const head = { x: snake[0].x + dx / gridSize, y: snake[0].y + dy / gridSize };

    snake.unshift(head);

    if (head.x === apple.x && head.y === apple.y) {
        score += 10;
        scoreElem.textContent = score;
        placeApple();
        generateQuestion();
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= tileCount.x || head.y < 0 || head.y >= tileCount.y || snake.slice(1).some(part => part.x === head.x && part.y === head.y)) {
        endGame();
    }
}

function placeApple() {
    apple.x = Math.floor(Math.random() * tileCount.x);
    apple.y = Math.floor(Math.random() * tileCount.y);
}

function generateQuestion() {
    const question = questions[Math.floor(Math.random() * questions.length)];
    questionElem.textContent = question.question;

    answersElem.forEach((btn, index) => {
        btn.textContent = question.answers[index];
        btn.onclick = () => {
            if (index === question.correct) {
                moveSnake();
            } else {
                endGame();
            }
        };
    });
}

function endGame() {
    clearInterval(gameInterval);
    if (score > highScore) {
        highScore = score;
        highScoreElem.textContent = highScore;
    }
    finalScoreElem.textContent = score;
    gameOverScreen.classList.remove('hidden');
    isGameOver = true;
}

function handleKeyPress(e) {
    if (e.key === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -gridSize;
    } else if (e.key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = gridSize;
    } else if (e.key === 'ArrowLeft' && dx === 0) {
        dx = -gridSize;
        dy = 0;
    } else if (e.key === 'ArrowRight' && dx === 0) {
        dx = gridSize;
        dy = 0;
    }
}

function gameLoop() {
    if (!isGameOver) {
        draw();
        moveSnake();
    }
}

function startGame() {
    gameOverScreen.classList.add('hidden');
    initializeGame();
}

function restartGame() {
    startGame();
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
difficultySelect.addEventListener('change', () => {
    if (!isGameOver) {
        clearInterval(gameInterval);
        speed = 100 - (difficultySelect.value - 1) * 30;
        gameInterval = setInterval(gameLoop, speed);
    }
});
