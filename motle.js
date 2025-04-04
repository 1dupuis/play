// Game constants
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

// Game state variables
let correctWord = "";
let currentAttempt = [];
let attempts = 0;
let gameOver = false;
let hardMode = false;
let timerInterval = null;
let timeLeft = 60;
let gameMode = "normal";

// Word list (French 5-letter words)
const frenchWords = [
  "amour", "avoir", "bague", "blanc", "cache", 
  "canne", "carte", "chien", "coeur", "danse", 
  "doigt", "ecole", "femme", "fleur", "forme", 
  "frais", "fruit", "glace", "grand", "heure", 
  "homme", "image", "jeune", "jouet", "laine", 
  "livre", "linge", "maman", "matin", "merci", 
  "monde", "neige", "nuage", "ocean", "ombre", 
  "oncle", "paris", "payer", "pluie", 
  "porte", "poste", "quand", "radio", "reine", 
  "rouge", "salon", "sante", "soeur", "solde", 
  "soupe", "suite", "table", "tante", "terre", 
  "tombe", "usine", "vague", "venir", 
  "verre", "vider", "vieux", "ville", "vivre",
  "voile", "voler", "plume", "jaune", "garer",
  "faute", "droit", "boire", "balle"
];

// Initialize the game
function initGame() {
  // Random word selection
  correctWord = frenchWords[Math.floor(Math.random() * frenchWords.length)].toLowerCase();
  console.log("Secret word (for testing):", correctWord);
  
  // Reset game state
  attempts = 0;
  currentAttempt = [];
  gameOver = false;
  timeLeft = 60;
  
  // Clear timer if it exists
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  // Create board and keyboard
  createBoard();
  createKeyboard();
  
  // Add play again event listener
  document.getElementById('play-again').addEventListener('click', resetGame);
  
  // Add keyboard event listener
  document.addEventListener('keydown', handleKeyDown);

  // Setup game mode
  setupGameMode();
}

// Setup game mode
function setupGameMode() {
  const gamemodeSelect = document.getElementById('gamemode');
  if (gamemodeSelect) {
    gamemodeSelect.addEventListener('change', function() {
      gameMode = this.value;
      resetGame();
    });
    
    // Get initial value
    gameMode = gamemodeSelect.value;
  }
  
  // Set up timer if needed
  const timerElement = document.getElementById('timer');
  
  if (gameMode === "timed") {
    hardMode = false;
    timerElement.classList.remove('hidden');
    startTimer();
  } else if (gameMode === "hard") {
    hardMode = true;
    timerElement.classList.add('hidden');
  } else {
    // Normal mode
    hardMode = false;
    timerElement.classList.add('hidden');
  }
}

// Start timer for timed mode
function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  timeLeft = 60;
  updateTimerDisplay();
  
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft <= 10) {
      document.getElementById('timer').classList.add('warning');
    }
    
    if (timeLeft <= 5) {
      document.getElementById('timer').classList.add('danger');
    }
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showResult(`Time's up! The word was "${correctWord.toUpperCase()}".`);
    }
  }, 1000);
}

// Update timer display
function updateTimerDisplay() {
  document.getElementById('time-left').textContent = timeLeft;
}

// Create the game board
function createBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    for (let j = 0; j < WORD_LENGTH; j++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.dataset.row = i;
      tile.dataset.col = j;
      board.appendChild(tile);
    }
  }
}

// Create the keyboard (QWERTY layout)
function createKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";
  
  // Define QWERTY keyboard layout
  const layout = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['ENTER', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'DEL']
  ];
  
  // Create keyboard rows and keys
  layout.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");
    
    row.forEach(key => {
      const keyButton = document.createElement("button");
      keyButton.classList.add("key");
      
      // Special styling for wide keys
      if (key === 'ENTER' || key === 'DEL') {
        keyButton.classList.add("wide");
        keyButton.textContent = key;
      } else {
        keyButton.textContent = key;
      }
      
      // Add event listeners
      keyButton.addEventListener('click', () => {
        if (key === 'ENTER') {
          submitAttempt();
        } else if (key === 'DEL') {
          deleteLetter();
        } else {
          handleKeyPress(key);
        }
      });
      
      rowDiv.appendChild(keyButton);
    });
    
    keyboard.appendChild(rowDiv);
  });
}

// Handle physical keyboard input
function handleKeyDown(e) {
  if (gameOver) return;
  
  if (e.key === "Enter") {
    submitAttempt();
  } else if (e.key === "Backspace") {
    deleteLetter();
  } else if (/^[a-zA-Z]$/.test(e.key)) {
    handleKeyPress(e.key.toLowerCase());
  }
}

// Handle letter key press
function handleKeyPress(key) {
  if (gameOver || currentAttempt.length >= WORD_LENGTH) return;
  
  currentAttempt.push(key);
  updateBoard();
}

// Delete last letter
function deleteLetter() {
  if (gameOver || currentAttempt.length === 0) return;
  
  currentAttempt.pop();
  updateBoard();
}

// Update the game board
function updateBoard() {
  const tiles = document.querySelectorAll(".tile");
  
  // Clear current row
  for (let i = 0; i < WORD_LENGTH; i++) {
    const tileIndex = attempts * WORD_LENGTH + i;
    tiles[tileIndex].textContent = "";
    tiles[tileIndex].classList.remove("filled");
  }
  
  // Update with current attempt
  for (let i = 0; i < currentAttempt.length; i++) {
    const tileIndex = attempts * WORD_LENGTH + i;
    tiles[tileIndex].textContent = currentAttempt[i].toUpperCase();
    tiles[tileIndex].classList.add("filled");
  }
}

// Update key status on keyboard
function updateKeyStatus(letter, status) {
  // Find the key button
  const keys = document.querySelectorAll('.key');
  let keyButton = null;
  
  for (const key of keys) {
    if (key.textContent.toLowerCase() === letter.toLowerCase()) {
      keyButton = key;
      break;
    }
  }
  
  if (!keyButton) return;
  
  // Don't downgrade from correct
  if (keyButton.classList.contains("correct")) return;
  
  // Apply proper status
  if (status === "correct") {
    keyButton.classList.remove("present", "absent");
    keyButton.classList.add("correct");
  } else if (status === "present") {
    if (!keyButton.classList.contains("correct")) {
      keyButton.classList.remove("absent");
      keyButton.classList.add("present");
    }
  } else if (status === "absent") {
    if (!keyButton.classList.contains("correct") && !keyButton.classList.contains("present")) {
      keyButton.classList.add("absent");
    }
  }
}

// Submit current attempt
function submitAttempt() {
  if (gameOver || currentAttempt.length < WORD_LENGTH) {
    // Shake the board if word is incomplete
    if (currentAttempt.length < WORD_LENGTH) {
      const currentRow = document.querySelectorAll(`.tile[data-row="${attempts}"]`);
      currentRow.forEach(tile => {
        tile.classList.add('shake');
        setTimeout(() => {
          tile.classList.remove('shake');
        }, 500);
      });
      showToast("Entrez 5 lettres");
    }
    return;
  }
  
  // Get the guessed word
  const guessedWord = currentAttempt.join('').toLowerCase();
  
  // Check for hard mode requirements
  if (hardMode && attempts > 0) {
    const previousRow = document.querySelectorAll(`.tile[data-row="${attempts - 1}"]`);
    let hardModeViolation = false;
    
    for (let i = 0; i < WORD_LENGTH; i++) {
      const tile = previousRow[i];
      const prevLetter = tile.textContent.toLowerCase();
      
      if (tile.classList.contains("correct") && currentAttempt[i] !== prevLetter) {
        showToast(`La lettre ${prevLetter.toUpperCase()} doit être utilisée en position ${i + 1}`);
        hardModeViolation = true;
        break;
      }
    }
    
    if (hardModeViolation) {
      const currentRow = document.querySelectorAll(`.tile[data-row="${attempts}"]`);
      currentRow.forEach(tile => {
        tile.classList.add('shake');
        setTimeout(() => {
          tile.classList.remove('shake');
        }, 500);
      });
      return;
    }
  }
  
  const tiles = document.querySelectorAll(".tile");
  let correctCount = 0;
  
  // Count letters in correct word
  const letterCounts = {};
  for (let i = 0; i < WORD_LENGTH; i++) {
    const letter = correctWord[i];
    letterCounts[letter] = (letterCounts[letter] || 0) + 1;
  }
  
  // First pass: mark correct positions
  for (let i = 0; i < WORD_LENGTH; i++) {
    const tileIndex = attempts * WORD_LENGTH + i;
    const tile = tiles[tileIndex];
    const letter = currentAttempt[i];
    
    // Apply delayed animation
    setTimeout(() => {
      if (letter === correctWord[i]) {
        tile.classList.add("correct");
        letterCounts[letter]--;
        correctCount++;
        updateKeyStatus(letter, "correct");
      }
    }, i * 300);
  }
  
  // Second pass: mark present or absent
  for (let i = 0; i < WORD_LENGTH; i++) {
    const tileIndex = attempts * WORD_LENGTH + i;
    const tile = tiles[tileIndex];
    const letter = currentAttempt[i];
    
    // Skip correct ones (already handled)
    if (letter === correctWord[i]) continue;
    
    setTimeout(() => {
      if (correctWord.includes(letter) && letterCounts[letter] > 0) {
        tile.classList.add("present");
        letterCounts[letter]--;
        updateKeyStatus(letter, "present");
      } else {
        tile.classList.add("absent");
        updateKeyStatus(letter, "absent");
      }
    }, i * 300);
  }
  
  // Check game end conditions after animations
  setTimeout(() => {
    if (guessedWord === correctWord) {
      const messages = [
        "Magnifique! 🎉",
        "Brillant! 🌟",
        "Superbe! 👏",
        "Excellent! 🏆",
        "Fantastique! 💯"
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      showResult(`${randomMessage} Vous avez trouvé "${correctWord.toUpperCase()}" en ${attempts + 1} essais.`);
      
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    } else {
      attempts++;
      if (attempts >= MAX_ATTEMPTS) {
        showResult(`Game Over! Le mot était "${correctWord.toUpperCase()}".`);
        if (timerInterval) {
          clearInterval(timerInterval);
        }
      } else {
        currentAttempt = [];
      }
    }
  }, WORD_LENGTH * 300 + 100);
}

// Show result message
function showResult(message) {
  setTimeout(() => {
    const result = document.getElementById("result");
    const messageEl = document.getElementById("message");
    messageEl.textContent = message;
    result.classList.remove("hidden");
    gameOver = true;
  }, 1500);
}

// Show toast notification
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2000);
}

// Reset the game
function resetGame() {
  document.getElementById("result").classList.add("hidden");
  
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  initGame();
}

// Start the game when the page loads
window.onload = () => {
  initGame();
};
