// Constants
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 30;
const PLATFORM_HEIGHT = 10;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_HEIGHT = 20;
const COIN_SIZE = 25;
const POWERUP_SIZE = 25;

// Physics constants
const GRAVITY = 0.35;
const TERMINAL_VELOCITY = 10;
const JUMP_FORCE = 12;
const HORIZONTAL_SPEED = 5;

// Game variables
let canvas, ctx, gameLoop;
let player, platforms, obstacles, coins, particles, powerups, enemies;
let score, level, health, cameraY;
let gameState = 'tutorial';
let gameSpeed = 2;

// Initialize game
function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    player = createPlayer();
    platforms = [createInitialPlatform()];
    obstacles = [];
    coins = [];
    particles = [];
    powerups = [];
    enemies = [];
    score = 0;
    level = 1;
    health = 3;
    cameraY = 0;

    generateInitialObjects();

    updateUI();
    startGameLoop();
}

function createPlayer() {
    return {
        x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
        y: GAME_HEIGHT - PLAYER_HEIGHT - PLATFORM_HEIGHT - 10,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        dx: 0,
        dy: 0,
        jumpForce: JUMP_FORCE,
        maxJumpForce: JUMP_FORCE * 1.5,
        grounded: false,
        jumping: false,
        doubleJump: false,
        invincible: false,
        powerup: null
    };
}

function createInitialPlatform() {
    return {
        x: 0,
        y: GAME_HEIGHT - PLATFORM_HEIGHT,
        width: GAME_WIDTH,
        height: PLATFORM_HEIGHT
    };
}

function generateInitialObjects() {
    for (let i = 1; i < 10; i++) {
        platforms.push(generatePlatform(GAME_HEIGHT - i * 100));
        if (Math.random() < 0.5) {
            obstacles.push(generateObstacle(GAME_HEIGHT - i * 100 - 30));
        }
        if (Math.random() < 0.7) {
            coins.push(generateCoin(GAME_HEIGHT - i * 100 - 50));
        }
        if (Math.random() < 0.1) {
            powerups.push(generatePowerup(GAME_HEIGHT - i * 100 - 50));
        }
        if (Math.random() < 0.3) {
            enemies.push(generateEnemy(GAME_HEIGHT - i * 100 - 30));
        }
    }
}

function generatePlatform(y) {
    const minWidth = Math.max(80, 120 - (level - 1) * 2);
    const maxWidth = Math.max(150, 200 - (level - 1) * 5);
    const width = Math.random() * (maxWidth - minWidth) + minWidth;
    const x = Math.random() * (GAME_WIDTH - width);
    return { x, y, width, height: PLATFORM_HEIGHT };
}

function generateObstacle(y) {
    const x = Math.random() * (GAME_WIDTH - OBSTACLE_WIDTH);
    return { x, y, width: OBSTACLE_WIDTH, height: OBSTACLE_HEIGHT };
}

function generateCoin(y) {
    const x = Math.random() * (GAME_WIDTH - COIN_SIZE);
    return { x, y, size: COIN_SIZE };
}

function generatePowerup(y) {
    const x = Math.random() * (GAME_WIDTH - POWERUP_SIZE);
    const types = ['invincibility', 'doubleJump', 'magnetism'];
    const type = types[Math.floor(Math.random() * types.length)];
    return { x, y, size: POWERUP_SIZE, type };
}

function generateEnemy(y) {
    const x = Math.random() * (GAME_WIDTH - PLAYER_WIDTH);
    return { x, y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT, dx: 2 };
}

function startGameLoop() {
    if (!gameLoop) {
        gameLoop = requestAnimationFrame(update);
    }
}

function stopGameLoop() {
    if (gameLoop) {
        cancelAnimationFrame(gameLoop);
        gameLoop = null;
    }
}

function update() {
    if (gameState === 'playing') {
        updatePlayer();
        updateGameObjects();
        checkCollisions();
        updateCamera();
        generateNewObjects();
        removeOffscreenObjects();
        checkGameOver();
        checkLevelProgression();
        draw();
    }
    gameLoop = requestAnimationFrame(update);
}

function updatePlayer() {
    // Apply gravity
    player.dy = Math.min(player.dy + GRAVITY, TERMINAL_VELOCITY);
    player.y += player.dy;

    // Horizontal movement with improved physics
    if (keys.ArrowLeft || keys.KeyA) {
        player.dx = -HORIZONTAL_SPEED;
    } else if (keys.ArrowRight || keys.KeyD) {
        player.dx = HORIZONTAL_SPEED;
    } else {
        player.dx *= 0.8; // Add friction
    }

    player.x += player.dx;

    // Screen wrap
    if (player.x + player.width < 0) {
        player.x = GAME_WIDTH;
    } else if (player.x > GAME_WIDTH) {
        player.x = -player.width;
    }

    // Reset grounded state
    player.grounded = false;
}

function updateGameObjects() {
    particles.forEach((particle, index) => {
        particle.life--;
        if (particle.life <= 0) {
            particles.splice(index, 1);
        } else {
            particle.x += particle.dx;
            particle.y += particle.dy;
            particle.dy += GRAVITY * 0.1; // Add gravity to particles
        }
    });

    enemies.forEach(enemy => {
        enemy.x += enemy.dx;
        if (enemy.x <= 0 || enemy.x + enemy.width >= GAME_WIDTH) {
            enemy.dx = -enemy.dx;
        }
    });

    // Apply magnetism powerup effect
    if (player.powerup === 'magnetism') {
        coins.forEach(coin => {
            const dx = player.x - coin.x;
            const dy = player.y - coin.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                coin.x += dx * 0.1;
                coin.y += dy * 0.1;
            }
        });
    }
}

function checkCollisions() {
    // Collision detection with platforms
    platforms.forEach(platform => {
        if (player.y + player.height > platform.y &&
            player.y < platform.y + platform.height &&
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x) {
            if (player.dy > 0) {
                player.jumping = false;
                player.doubleJump = false;
                player.y = platform.y - player.height;
                player.dy = 0;
                player.grounded = true;
            } else {
                player.dy = 0;
            }
        }
    });

    // Collision detection with obstacles and enemies
    if (!player.invincible) {
        obstacles.concat(enemies).forEach(obj => {
            if (player.y + player.height > obj.y &&
                player.y < obj.y + obj.height &&
                player.x < obj.x + obj.width &&
                player.x + player.width > obj.x) {
                takeDamage();
            }
        });
    }

    // Coin collection
    coins = coins.filter(coin => {
        if (player.y + player.height > coin.y &&
            player.y < coin.y + coin.size &&
            player.x < coin.x + coin.size &&
            player.x + player.width > coin.x) {
            score += 10;
            createParticles(coin.x, coin.y, 10, '#ffd700');
            updateUI();
            return false;
        }
        return true;
    });

    // Powerup collection
    powerups = powerups.filter(powerup => {
        if (player.y + player.height > powerup.y &&
            player.y < powerup.y + powerup.size &&
            player.x < powerup.x + powerup.size &&
            player.x + player.width > powerup.x) {
            applyPowerup(powerup.type);
            createParticles(powerup.x, powerup.y, 15, '#00ff00');
            return false;
        }
        return true;
    });
}

function updateCamera() {
    const targetY = player.y - GAME_HEIGHT / 2;
    cameraY += (targetY - cameraY) * 0.1; // Smooth camera movement
}

function generateNewObjects() {
    while (platforms[platforms.length - 1].y - cameraY > -GAME_HEIGHT) {
        const y = platforms[platforms.length - 1].y - Math.random() * 100 - 50;
        platforms.push(generatePlatform(y));
        if (Math.random() < 0.5 + level * 0.05) {
            obstacles.push(generateObstacle(y - 30));
        }
        if (Math.random() < 0.7) {
            coins.push(generateCoin(y - 50));
        }
        if (Math.random() < 0.1) {
            powerups.push(generatePowerup(y - 50));
        }
        if (Math.random() < 0.3 + level * 0.02) {
            enemies.push(generateEnemy(y - 30));
        }
    }
}

function removeOffscreenObjects() {
    const threshold = cameraY + GAME_HEIGHT * 1.5;
    platforms = platforms.filter(p => p.y < threshold);
    obstacles = obstacles.filter(o => o.y < threshold);
    coins = coins.filter(c => c.y < threshold);
    powerups = powerups.filter(p => p.y < threshold);
    enemies = enemies.filter(e => e.y < threshold);
}

function checkGameOver() {
    if (player.y - cameraY > GAME_HEIGHT) {
        gameOver();
    }
}

function draw() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    gradient.addColorStop(0, "#0f0c29");
    gradient.addColorStop(0.5, "#302b63");
    gradient.addColorStop(1, "#24243e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw game objects
    ctx.save();
    ctx.translate(0, -cameraY);

    drawPlatforms();
    drawObstacles();
    drawCoins();
    drawPowerups();
    drawEnemies();
    drawPlayer();
    drawParticles();

    ctx.restore();
}

function drawPlatforms() {
    platforms.forEach(platform => {
        // Draw platform with gradient for a polished look
        const gradient = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.height);
        gradient.addColorStop(0, '#4ecca3'); // Lighter top color
        gradient.addColorStop(1, '#398b7b'); // Darker bottom color

        ctx.fillStyle = gradient;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

        // Draw shadow for depth
        ctx.fillStyle = '#2b8a6f';
        ctx.fillRect(platform.x + 4, platform.y + 4, platform.width, platform.height);
    });
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        // Draw obstacle with gradient
        const gradient = ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x, obstacle.y + obstacle.height);
        gradient.addColorStop(0, '#e94560'); // Lighter top color
        gradient.addColorStop(1, '#b73844'); // Darker bottom color

        ctx.fillStyle = gradient;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Draw shadow for depth
        ctx.fillStyle = '#8c2a33';
        ctx.fillRect(obstacle.x + 4, obstacle.y + 4, obstacle.width, obstacle.height);
    });
}

function drawCoins() {
    coins.forEach(coin => {
        // Draw coin with metallic shine effect
        const gradient = ctx.createRadialGradient(coin.x + coin.size / 2, coin.y + coin.size / 2, coin.size / 4, coin.x + coin.size / 2, coin.y + coin.size / 2, coin.size / 2);
        gradient.addColorStop(0, '#ffdf00'); // Bright yellow center
        gradient.addColorStop(1, '#b8860b'); // Gold rim

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(coin.x + coin.size / 2, coin.y + coin.size / 2, coin.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw shadow for depth
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.arc(coin.x + coin.size / 2 + 2, coin.y + coin.size / 2 + 2, coin.size / 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawPowerups() {
    powerups.forEach(powerup => {
        let gradient;
        switch (powerup.type) {
            case 'invincibility':
                gradient = ctx.createLinearGradient(powerup.x, powerup.y, powerup.x + powerup.size, powerup.y + powerup.size);
                gradient.addColorStop(0, '#00ffff'); // Bright cyan
                gradient.addColorStop(1, '#009999'); // Darker cyan
                break;
            case 'doubleJump':
                gradient = ctx.createLinearGradient(powerup.x, powerup.y, powerup.x + powerup.size, powerup.y + powerup.size);
                gradient.addColorStop(0, '#ff00ff'); // Bright magenta
                gradient.addColorStop(1, '#990099'); // Darker magenta
                break;
            case 'magnetism':
                gradient = ctx.createLinearGradient(powerup.x, powerup.y, powerup.x + powerup.size, powerup.y + powerup.size);
                gradient.addColorStop(0, '#ffff00'); // Bright yellow
                gradient.addColorStop(1, '#b3b300'); // Darker yellow
                break;
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(powerup.x, powerup.y, powerup.size, powerup.size);

        // Draw shadow for depth
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(powerup.x + 4, powerup.y + 4, powerup.size, powerup.size);
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        // Draw enemy with gradient
        const gradient = ctx.createLinearGradient(enemy.x, enemy.y, enemy.x + enemy.width, enemy.y + enemy.height);
        gradient.addColorStop(0, '#ff4d4d'); // Bright red
        gradient.addColorStop(1, '#b73a3a'); // Darker red

        ctx.fillStyle = gradient;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Draw shadow for depth
        ctx.fillStyle = '#8c2a2a';
        ctx.fillRect(enemy.x + 4, enemy.y + 4, enemy.width, enemy.height);
    });
}

function drawPlayer() {
    // Draw player with gradient
    const gradient = ctx.createLinearGradient(player.x, player.y, player.x + player.width, player.y + player.height);
    gradient.addColorStop(0, player.invincible ? '#00ffff' : '#ffffff'); // Lighter color
    gradient.addColorStop(1, player.invincible ? '#009999' : '#cccccc'); // Darker color

    ctx.fillStyle = gradient;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw player eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(player.x + 5, player.y + 5, 5, 5);
    ctx.fillRect(player.x + player.width - 10, player.y + 5, 5, 5);

    // Draw shadow for depth
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(player.x + 4, player.y + 4, player.width, player.height);
}

function drawParticles() {
    particles.forEach(particle => {
        // Draw particle with slight transparency and solid color
        ctx.fillStyle = `rgba(${particle.color}, 0.8)`;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);

        // Optional: add slight shadow for more depth
        ctx.fillStyle = `rgba(0, 0, 0, 0.4)`;
        ctx.fillRect(particle.x + 2, particle.y + 2, particle.size, particle.size);
    });
}


function createParticles(x, y, count, color) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            size: Math.random() * 5 + 1,
            dx: (Math.random() - 0.5) * 4,
            dy: (Math.random() - 0.5) * 4,
            color: color,
            life: 20
        });
    }
}

function jump() {
    if (player.grounded) {
        player.jumping = true;
        player.dy = -player.jumpForce;
        createParticles(player.x + player.width / 2, player.y + player.height, 5, '255, 255, 255');
    } else if (!player.doubleJump && player.powerup === 'doubleJump') {
        player.doubleJump = true;
        player.dy = -player.jumpForce * 0.8;
        createParticles(player.x + player.width / 2, player.y + player.height, 5, '255, 0, 255');
    }
}

function takeDamage() {
    if (!player.invincible) {
        health--;

        // Create particles effect at the player's location
        createParticles(player.x + player.width / 2, player.y + player.height / 2, 10, '255, 0, 0');

        // Update the UI to reflect health change
        updateUI();

        // Trigger screen shake effect
        screenShake();

        // Flash the screen red for a brief moment
        flashScreen('rgba(255, 0, 0, 0.5)');

        // If health drops to 0, trigger game over
        if (health <= 0) {
            gameOver();
        } else {
            // Make the player invincible for a short time after taking damage
            player.invincible = true;
            setTimeout(() => {
                player.invincible = false;
            }, 2000);
        }
    }
}

function screenShake() {
    const intensity = 5;  // Adjust this value to control shake intensity
    const duration = 300;  // Duration in milliseconds
    const start = Date.now();

    function shake() {
        const elapsed = Date.now() - start;
        if (elapsed < duration) {
            const dx = (Math.random() - 0.5) * intensity;
            const dy = (Math.random() - 0.5) * intensity;
            ctx.save();  // Save the current state
            ctx.translate(dx, dy);
            requestAnimationFrame(shake);
            ctx.restore();  // Restore the previous state
        } else {
            ctx.setTransform(1, 0, 0, 1, 0, 0);  // Reset the transform matrix to the default state
        }
    }

    shake();
}

function flashScreen(color) {
    const flashDuration = 100;  // Duration in milliseconds
    ctx.save();  // Save the current canvas state
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the flash color
        ctx.restore();  // Restore the canvas to its original state
    }, flashDuration);
}

function applyPowerup(type) {
    player.powerup = type;
    updateUI();

    switch (type) {
        case 'invincibility':
            player.invincible = true;
            setTimeout(() => {
                player.invincible = false;
                player.powerup = null;
                updateUI();
            }, 5000);
            break;
        case 'doubleJump':
            setTimeout(() => {
                player.powerup = null;
                updateUI();
            }, 10000);
            break;
        case 'magnetism':
            setTimeout(() => {
                player.powerup = null;
                updateUI();
            }, 8000);
            break;
    }
}

function updateUI() {
    document.getElementById('scoreValue').textContent = score;
    document.getElementById('healthValue').textContent = health;
    document.getElementById('levelValue').textContent = level;
    document.getElementById('powerupValue').textContent = player.powerup || 'None';
}

function checkLevelProgression() {
    const newLevel = Math.floor(score / 200) + 1;
    if (newLevel > level) {
        level = newLevel;
        increaseGameDifficulty();
        updateUI();
        createParticles(player.x + player.width / 2, player.y + player.height / 2, 20, '255, 255, 0');
    }
}

function increaseGameDifficulty() {
    gameSpeed = Math.min(gameSpeed + 0.5, 5);
    player.jumpForce = Math.min(player.jumpForce + 0.2, player.maxJumpForce);
}

function gameOver() {
    gameState = 'gameOver';
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('highestLevel').textContent = level;
    stopGameLoop();
}

function restartGame() {
    gameState = 'playing';
    document.getElementById('gameOver').style.display = 'none';
    initGame();
}

function pauseGame() {
    if (gameState === 'playing') {
        gameState = 'paused';
        document.getElementById('pauseMenu').style.display = 'block';
        stopGameLoop();
    }
}

function resumeGame() {
    if (gameState === 'paused') {
        gameState = 'playing';
        document.getElementById('pauseMenu').style.display = 'none';
        startGameLoop();
    }
}

function quitGame() {
    gameState = 'gameOver';
    document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('highestLevel').textContent = level;
    stopGameLoop();
}

const keys = {};

function handleKeyDown(e) {
    keys[e.code] = true;

    if (gameState === 'playing') {
        if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') {
            jump();
        }
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
            keys.ArrowLeft = true;
        }
        if (e.code === 'ArrowRight' || e.code === 'KeyD') {
            keys.ArrowRight = true;
        }
        if (e.code === 'KeyP') {
            if (gameState === 'playing') {
                pauseGame();
            } else if (gameState === 'paused') {
                resumeGame();
            }
        }
    }
}

function handleKeyUp(e) {
    keys[e.code] = false;

    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keys.ArrowLeft = false;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keys.ArrowRight = false;
    }
}

function startGame() {
    gameState = 'playing';
    document.getElementById('tutorial').style.display = 'none';
    initGame();
}

// Event Listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
document.getElementById('restartButton').addEventListener('click', restartGame);
document.getElementById('resumeButton').addEventListener('click', resumeGame);
document.getElementById('quitButton').addEventListener('click', quitGame);
document.getElementById('startButton').addEventListener('click', startGame);

// Initialize the game
document.getElementById('tutorial').style.display = 'block';

// Add touch controls for mobile devices
let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    if (gameState !== 'playing') return;

    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 0) {
            keys.ArrowRight = true;
            keys.ArrowLeft = false;
        } else {
            keys.ArrowLeft = true;
            keys.ArrowRight = false;
        }
    } else {
        // Vertical swipe (jump)
        if (dy < 0) {
            jump();
        }
    }
}

function handleTouchEnd() {
    keys.ArrowLeft = false;
    keys.ArrowRight = false;
}

canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', handleTouchEnd);

// Add resize event listener to make the game responsive
window.addEventListener('resize', () => {
    const containerWidth = canvas.parentElement.clientWidth;
    const containerHeight = canvas.parentElement.clientHeight;
    const scale = Math.min(containerWidth / GAME_WIDTH, containerHeight / GAME_HEIGHT);
    
    canvas.style.width = `${GAME_WIDTH * scale}px`;
    canvas.style.height = `${GAME_HEIGHT * scale}px`;
});

// Call resize event once to set initial size
window.dispatchEvent(new Event('resize'));
