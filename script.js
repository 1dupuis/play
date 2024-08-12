const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
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
const questionContainer = document.getElementById('questionContainer');
const pauseMessage = document.getElementById('pauseMessage');

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
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
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
        questionAnswered = false;
        isPaused = true;
        questionContainer.classList.remove('hidden');
        hintElem.classList.add('hidden');
        draw();
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= tileCount.x || head.y < 0 || head.y >= tileCount.y || snake.slice(1).some(part => part.x === head.x && part.y === head.y)) {
        endGame();
    }

    powerUps.forEach((pu, index) => {
        if (head.x === pu.x && head.y === pu.y) {
            handlePowerUp(pu.type);
            powerUps.splice(index, 1);
        }
    });
}

function placeApple() {
    apple.x = Math.floor(Math.random() * tileCount.x);
    apple.y = Math.floor(Math.random() * tileCount.y);
}

function generateQuestion() {
    currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    questionElem.textContent = currentQuestion.question;

    const shuffledAnswers = [...currentQuestion.answers].sort(() => Math.random() - 0.5);
    answersElem.forEach((btn, index) => {
        btn.textContent = shuffledAnswers[index];
        btn.onclick = () => handleAnswer(index);
    });

    hintElem.textContent = currentQuestion.hint;
    hintElem.classList.add('hidden');
}

function handleAnswer(index) {
    if (index === currentQuestion.correct) {
        score += 10 * scoreMultiplier;
        scoreElem.textContent = score;
        questionContainer.classList.add('hidden');
        isPaused = false;
        questionAnswered = true;
        appleEaten = false;
        placeApple();
        spawnPowerUp();
        if (score >= gameLevel * 100) {
            levelUp();
        }
        setTimeout(() => {
            if (appleEaten) {
                isPaused = true;
                questionContainer.classList.remove('hidden');
                generateQuestion();
            }
        }, 1000); // Wait 1 second after eating apple before pausing for next question
    } else {
        if (snake.length > 1) {
            snake.pop(); // Reduce snake size on incorrect answer
        }
        hintElem.classList.remove('hidden');
    }
}

function handlePowerUp(type) {
    if (type === 'DoubleScore') {
        scoreMultiplier = 2;
        setTimeout(() => scoreMultiplier = 1, 10000); // Reset multiplier after 10 seconds
    } else if (type === 'ExtraLife') {
        if (snake.length < 5) { // Max length of the snake
            snake.push({ ...snake[snake.length - 1] }); // Add an extra segment
        }
    }
}

function spawnPowerUp() {
    if (Math.random() < 0.1) { // 10% chance to spawn a power-up
        const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        let pu;
        do {
            pu = { x: Math.floor(Math.random() * tileCount.x), y: Math.floor(Math.random() * tileCount.y), type };
        } while (snake.some(part => part.x === pu.x && part.y === pu.y) || (pu.x === apple.x && pu.y === apple.y));
        powerUps.push(pu);
    }
}

function levelUp() {
    gameLevel++;
    speed = Math.max(30, speed - 10); // Increase speed but not below 30
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}

function endGame() {
    clearInterval(gameInterval);
    isGameOver = true;
    if (score > highScore) {
        highScore = score;
        highScoreElem.textContent = highScore;
    }
    finalScoreElem.textContent = score;
    gameOverScreen.classList.remove('hidden');
    stopBackgroundMusic();
    setTimeout(() => location.reload(), 3000); // Refresh page after 3 seconds
}

function restartGame() {
    gameOverScreen.classList.add('hidden');
    initializeGame();
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
    if (isGameOver || isPaused) return;
    moveSnake();
    draw();
}

function playBackgroundMusic() {
    const music = new Audio('background-music.mp3');
    music.loop = true;
    music.play();
    document.getElementById('playMusic').onclick = () => music.play();
    document.getElementById('pauseMusic').onclick = () => music.pause();
}

function stopBackgroundMusic() {
    const music = new Audio('background-music.mp3');
    music.pause();
}

initializeGame();
startButton.onclick = initializeGame;
restartButton.onclick = restartGame;
difficultySelect.addEventListener('change', () => {
    if (!isGameOver) {
        clearInterval(gameInterval);
        speed = 100 - (difficultySelect.value - 1) * 30;
        gameInterval = setInterval(gameLoop, speed);
    }
});
