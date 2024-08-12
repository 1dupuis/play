const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');

let gridSize, tileCount, snake, food, dx, dy, score, highScore, gameLoop, lastRenderTime, snakeSpeed, gameState, difficulty;

const colors = {
    background: '#1E1E1E',
    snake: '#4CAF50',
    snakeOutline: '#45a049',
    food: '#FF4081',
    foodOutline: '#C2185B',
    grid: 'rgba(255, 255, 255, 0.05)'
};

function initGame() {
    setCanvasSize();
    snake = [{ x: 5, y: 5 }];
    generateFood();
    score = 0;
    dx = 1;
    dy = 0;
    gameState = 'playing';
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    setDifficulty(difficulty);
    updateScore();
}

function setCanvasSize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gridSize = Math.floor(canvas.width / 40);
    tileCount = {
        x: Math.floor(canvas.width / gridSize),
        y: Math.floor(canvas.height / gridSize)
    };
}

function setDifficulty(level) {
    difficulty = level;
    snakeSpeed = level === 'easy' ? 6 : level === 'medium' ? 10 : 15;
}

function gameLoop(currentTime) {
    window.requestAnimationFrame(gameLoop);
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / snakeSpeed) return;

    lastRenderTime = currentTime;

    if (gameState === 'playing') {
        update();
        draw();
    }
}

function update() {
    moveSnake();
    checkCollision();
    checkFoodCollision();
}

function draw() {
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    drawSnake();
    drawFood();
}

function drawGrid() {
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= tileCount.x; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= tileCount.y; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        const segmentX = segment.x * gridSize;
        const segmentY = segment.y * gridSize;
        
        ctx.fillStyle = colors.snake;
        ctx.strokeStyle = colors.snakeOutline;
        ctx.lineWidth = 2;
        
        if (index === 0) {
            drawSnakeHead(segmentX, segmentY);
        } else {
            drawSnakeBody(segmentX, segmentY);
        }
    });
}

function drawSnakeHead(x, y) {
    ctx.beginPath();
    ctx.arc(x + gridSize / 2, y + gridSize / 2, gridSize / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    // Draw eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x + gridSize / 2 + dx * 5, y + gridSize / 2 + dy * 5, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + gridSize / 2 + dx * 5 - dy * 5, y + gridSize / 2 + dy * 5 + dx * 5, 3, 0, 2 * Math.PI);
    ctx.fill();
}

function drawSnakeBody(x, y) {
    ctx.beginPath();
    ctx.arc(x + gridSize / 2, y + gridSize / 2, gridSize / 2 - 1, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function drawFood() {
    const x = food.x * gridSize;
    const y = food.y * gridSize;

    ctx.fillStyle = colors.food;
    ctx.strokeStyle = colors.foodOutline;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + gridSize / 2, y + gridSize / 2, gridSize / 2 - 1, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Draw food sparkle
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x + gridSize / 4, y + gridSize / 4, 2, 0, 2 * Math.PI);
    ctx.fill();
}

function moveSnake() {
    const newHead = { 
        x: (snake[0].x + dx + tileCount.x) % tileCount.x,
        y: (snake[0].y + dy + tileCount.y) % tileCount.y
    };
    snake.unshift(newHead);
    if (newHead.x !== food.x || newHead.y !== food.y) {
        snake.pop();
    } else {
        score++;
        updateScore();
        generateFood();
    }
}

function checkCollision() {
    if (snake.slice(1).some(segment => segment.x === snake[0].x && segment.y === snake[0].y)) {
        gameOver();
    }
}

function checkFoodCollision() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        updateScore();
        generateFood();
    }
}

function generateFood() {
    do {
        food = {
            x: Math.floor(Math.random() * tileCount.x),
            y: Math.floor(Math.random() * tileCount.y)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function updateScore() {
    scoreElement.textContent = score;
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = `Best: ${highScore}`;
    }
}

function gameOver() {
    gameState = 'over';
    gameOverScreen.classList.remove('hidden');
    document.getElementById('final-score').textContent = `Score: ${score}`;
}

function handleKeydown(e) {
    if (gameState !== 'playing') return;
    
    switch (e.key) {
        case 'ArrowUp': if (dy === 0) { dx = 0; dy = -1; } break;
        case 'ArrowDown': if (dy === 0) { dx = 0; dy = 1; } break;
        case 'ArrowLeft': if (dx === 0) { dx = -1; dy = 0; } break;
        case 'ArrowRight': if (dx === 0) { dx = 1; dy = 0; } break;
    }
}

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    if (gameState !== 'playing') return;
    e.preventDefault();
    
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && dx === 0) { dx = 1; dy = 0; }
        else if (deltaX < 0 && dx === 0) { dx = -1; dy = 0; }
    } else {
        if (deltaY > 0 && dy === 0) { dx = 0; dy = 1; }
        else if (deltaY < 0 && dy === 0) { dx = 0; dy = -1; }
    }
}

startButton.addEventListener('click', initGame);
restartButton.addEventListener('click', initGame);

difficultyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        difficultyButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        setDifficulty(e.target.dataset.difficulty);
    });
});

document.addEventListener('keydown', handleKeydown);

let touchStartX, touchStartY;
canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);

window.addEventListener('resize', setCanvasSize);

// Initialize the game
setCanvasSize();
setDifficulty('medium');
highScore = 0;
updateScore();

main();
