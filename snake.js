const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const quizOverlay = document.getElementById('quizOverlay');
const quizQuestion = document.getElementById('quizQuestion');
const quizOptions = document.getElementById('quizOptions');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const frenchWordElement = document.getElementById('frenchWord');

let gridSize, tileCount, snake, food, dx, dy, score, highScore, gameLoop, lastRenderTime, snakeSpeed, gameState, difficulty;
let applesEaten = 0;
let quizPoints = 0;

const colors = {
    background: '#2C3E50',
    snake: '#3498DB',
    snakeOutline: '#2980B9',
    food: '#E74C3C',
    foodOutline: '#C0392B',
    grid: 'rgba(255, 255, 255, 0.1)'
};

const frenchWords = {
    easy: [
        {french: 'Bonjour', english: 'Hello'},
        {french: 'Merci', english: 'Thank you'},
        {french: 'Au revoir', english: 'Goodbye'},
        {french: 'S\'il vous plaît', english: 'Please'},
        {french: 'Oui', english: 'Yes'},
        {french: 'Non', english: 'No'},
        {french: 'Chat', english: 'Cat'},
        {french: 'Chien', english: 'Dog'},
        {french: 'Maison', english: 'House'},
        {french: 'Voiture', english: 'Car'}
    ],
    medium: [
        {french: 'Aujourd\'hui', english: 'Today'},
        {french: 'Demain', english: 'Tomorrow'},
        {french: 'Hier', english: 'Yesterday'},
        {french: 'Maintenant', english: 'Now'},
        {french: 'Toujours', english: 'Always'},
        {french: 'Jamais', english: 'Never'},
        {french: 'Souvent', english: 'Often'},
        {french: 'Parfois', english: 'Sometimes'},
        {french: 'Beaucoup', english: 'A lot'},
        {french: 'Peu', english: 'Little'}
    ],
    hard: [
        {french: 'Néanmoins', english: 'Nevertheless'},
        {french: 'Dorénavant', english: 'From now on'},
        {french: 'Auparavant', english: 'Previously'},
        {french: 'Désormais', english: 'Henceforth'},
        {french: 'Simultanément', english: 'Simultaneously'},
        {french: 'Éventuellement', english: 'Possibly'},
        {french: 'Apparemment', english: 'Apparently'},
        {french: 'Vraisemblablement', english: 'Presumably'},
        {french: 'Progressivement', english: 'Gradually'},
        {french: 'Paradoxalement', english: 'Paradoxically'}
    ]
};

let currentWord;

function initGame() {
    setCanvasSize();
    snake = [{ x: 5, y: 5 }];
    generateFood();
    score = 0;
    quizPoints = 0;
    applesEaten = 0;
    dx = 1;
    dy = 0;
    gameState = 'playing';
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    quizOverlay.classList.add('hidden');
    setDifficulty(difficulty);
    updateScore();
    selectNewWord();
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
    switch (level) {
        case 'easy':
            snakeSpeed = 6;
            break;
        case 'medium':
            snakeSpeed = 10;
            break;
        case 'hard':
            snakeSpeed = 15;
            break;
    }
}

function main(currentTime) {
    gameLoop = window.requestAnimationFrame(main);
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
            drawSnakeBody(segmentX, segmentY, index);
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

function drawSnakeBody(x, y, index) {
    ctx.beginPath();
    ctx.arc(x + gridSize / 2, y + gridSize / 2, gridSize / 2 - 1, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Add gradient effect
    const gradient = ctx.createRadialGradient(
        x + gridSize / 2, y + gridSize / 2, 0,
        x + gridSize / 2, y + gridSize / 2, gridSize / 2
    );
    gradient.addColorStop(0, colors.snake);
    gradient.addColorStop(1, colors.snakeOutline);
    ctx.fillStyle = gradient;
    ctx.fill();
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
    const sparkleSize = 3;
    const sparkleOffset = gridSize / 4;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x + sparkleOffset, y + sparkleOffset, sparkleSize, 0, 2 * Math.PI);
    ctx.fill();

    // Draw French word on food
    ctx.fillStyle = '#fff';
    ctx.font = `${gridSize / 3}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentWord.english.substring(0, 1), x + gridSize / 2, y + gridSize / 2);
}

function moveSnake() {
    const newHead = { 
        x: (snake[0].x + dx + tileCount.x) % tileCount.x,
        y: (snake[0].y + dy + tileCount.y) % tileCount.y
    };
    snake.unshift(newHead);
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        applesEaten++;
        updateScore();
        generateFood();
        selectNewWord();
        if (applesEaten % 3 === 0) {
            showQuiz();
        }
    } else {
        snake.pop();
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
        applesEaten++;
        updateScore();
        generateFood();
        selectNewWord();
        if (applesEaten % 3 === 0) {
            showQuiz();
        }
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
    score += quizPoints;
    scoreElement.textContent = `Score: ${score}`;
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = `High Score: ${highScore}`;
        localStorage.setItem('snakeHighScore', highScore);
    }
}

function selectNewWord() {
    currentWord = frenchWords[difficulty][Math.floor(Math.random() * frenchWords[difficulty].length)];
    frenchWordElement.textContent = `${currentWord.french}`;
}

function showQuiz() {
    gameState = 'quiz';
    quizOverlay.classList.remove('hidden');
    
    const correctAnswer = currentWord;
    const wrongAnswers = getWrongAnswers(correctAnswer);
    const answers = shuffleArray([correctAnswer, ...wrongAnswers]);

    quizQuestion.textContent = `What is the English translation of "${correctAnswer.french}"?`;
    quizOptions.innerHTML = '';
    answers.forEach(answer => {
        const button = document.createElement('button');
        button.classList.add('quizOption');
        button.textContent = answer.english;
        button.addEventListener('click', () => checkAnswer(answer, correctAnswer));
        quizOptions.appendChild(button);
    });
}

function getWrongAnswers(correctAnswer) {
    return frenchWords[difficulty]
        .filter(word => word !== correctAnswer)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function checkAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        quizPoints += 5;
    } else {
        quizPoints -= 2;
    }
    updateScore();
    quizOverlay.classList.add('hidden');
    gameState = 'playing';
    addQuizPointsToSnake();
}

function addQuizPointsToSnake() {
    if (quizPoints > 0) {
        for (let i = 0; i < quizPoints; i++) {
            const tail = snake[snake.length - 1];
            snake.push({ ...tail });
        }
    } else if (quizPoints < 0 && snake.length > 1) {
        // Remove segments, but don't let the snake disappear completely
        snake.splice(snake.length + quizPoints, Math.abs(quizPoints));
    }
    quizPoints = 0;
}

function gameOver() {
    gameState = 'over';
    gameOverScreen.classList.remove('hidden');
    document.getElementById('finalScore').textContent = `Final Score: ${score}`;
}

function handleKeydown(e) {
    if (gameState !== 'playing') return;

    switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case 'arrowdown':
        case 's':
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case 'arrowleft':
        case 'a':
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case 'arrowright':
        case 'd':
            if (dx === 0) { dx = 1; dy = 0; }
            break;
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
    if (deltaX > 0 && dx === 0) {
      dx = 1;
      dy = 0;
    } else if (deltaX < 0 && dx === 0) {
      dx = -1;
      dy = 0;
    }
  } else {
    if (deltaY > 0 && dy === 0) {
      dx = 0;
      dy = 1;
    } else if (deltaY < 0 && dy === 0) {
      dx = 0;
      dy = -1;
    }
  }
}

startButton.addEventListener('click', initGame);
restartButton.addEventListener('click', initGame);

difficultyButtons.forEach(button = >{
  button.addEventListener('click', (e) = >{
    difficultyButtons.forEach(btn = >btn.classList.remove('active'));
    e.target.classList.add('active');
    setDifficulty(e.target.dataset.difficulty);
  });
});

document.addEventListener('keydown', handleKeydown);

let touchStartX,
touchStartY;
canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);

window.addEventListener('resize', () = >{
  setCanvasSize();
  if (gameState === 'playing') {
    // Adjust snake and food positions
    snake = snake.map(segment = >({
      x: Math.floor(segment.x * canvas.width / prevWidth),
      y: Math.floor(segment.y * canvas.height / prevHeight)
    }));
    food = {
      x: Math.floor(food.x * canvas.width / prevWidth),
      y: Math.floor(food.y * canvas.height / prevHeight)
    };
    prevWidth = canvas.width;
    prevHeight = canvas.height;
  }
});

// Initialize the game
let prevWidth = canvas.width;
let prevHeight = canvas.height;
setCanvasSize();
setDifficulty('medium');
highScore = localStorage.getItem('snakeHighScore') || 0;
updateScore();

lastRenderTime = 0;
main();
