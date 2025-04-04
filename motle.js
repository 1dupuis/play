const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 5;
let correctWord = "";
let currentAttempt = [];
let attempts = 0;
let gameOver = false;
let words = [];
const fallbackWords = [
  "table", "pomme", "chien", "fleur", "livre",
    "porte", "blanc", "votre", "jeune", "piano",
    "brise", "soupe", "plage", "grise", "tigre",
    "salle", "vache", "pluie", "frais", "champ",
    "garde", "motel", "ombre", "femme", "joies",
    "pente", "sucre", "poule", "bouse", "cable",
    "avion", "peche", "louve", "sueur"
];
function initGame() {
  words = fallbackWords;
  startGame();
}
function startGame() {
  correctWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
  attempts = 0;
  currentAttempt = [];
  gameOver = false;
  createBoard();
  createKeyboard();
}
function createBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  for (let i = 0; i < MAX_ATTEMPTS * WORD_LENGTH; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    board.appendChild(tile);
  }
}
function createKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";
  const keys = "qwertyuiopasdfghjklzxcvbnm".split("");
  keys.forEach(key => {
    const button = document.createElement("button");
    button.textContent = key;
    button.setAttribute("data-key", key);
    button.addEventListener("click", () => handleKeyPress(key));
    keyboard.appendChild(button);
  });
  const goButton = document.createElement("button");
  goButton.textContent = "GO";
  goButton.addEventListener("click", submitAttempt);
  keyboard.appendChild(goButton);
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "←";
  deleteButton.addEventListener("click", deleteLetter);
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
  const board = document.getElementById("board");
  const tiles = board.querySelectorAll(".tile");
  for (let i = 0; i < WORD_LENGTH; i++) {
    const tileIndex = attempts * WORD_LENGTH + i;
    tiles[tileIndex].textContent = currentAttempt[i] || "";
  }
}
function updateKeyStatus(letter, status) {
  const keyButton = document.querySelector(`#keyboard button[data-key="${letter}"]`);
  if (!keyButton) return;
  if (keyButton.classList.contains("correct")) return;
  if (status === "correct") {
    keyButton.classList.remove("present", "absent");
    keyButton.classList.add("correct");
  } else if (status === "present") {
    if (!keyButton.classList.contains("present") && !keyButton.classList.contains("correct"))
      keyButton.classList.add("present");
  } else if (status === "absent") {
    if (!keyButton.classList.contains("present") && !keyButton.classList.contains("correct"))
      keyButton.classList.add("absent");
  }
}
function submitAttempt() {
  if (gameOver || currentAttempt.length < WORD_LENGTH) return;
  const board = document.getElementById("board");
  const tiles = board.querySelectorAll(".tile");
  let correctCount = 0;
  const letterCounts = {};
  for (let i = 0; i < WORD_LENGTH; i++) {
    const letter = correctWord[i];
    letterCounts[letter] = (letterCounts[letter] || 0) + 1;
  }
  for (let i = 0; i < WORD_LENGTH; i++) {
    const tileIndex = attempts * WORD_LENGTH + i;
    const tile = tiles[tileIndex];
    const letter = currentAttempt[i];
    if (letter === correctWord[i]) {
      tile.classList.add("correct");
      letterCounts[letter]--;
      correctCount++;
      updateKeyStatus(letter, "correct");
    } else if (correctWord.includes(letter) && letterCounts[letter] > 0) {
      tile.classList.add("present");
      letterCounts[letter]--;
      updateKeyStatus(letter, "present");
    } else {
      tile.classList.add("absent");
      updateKeyStatus(letter, "absent");
    }
  }
  if (correctCount === WORD_LENGTH) {
    showResult(`🎉 Congratulations! The correct word is "${correctWord.toUpperCase()}".`);
  } else {
    attempts++;
    if (attempts >= MAX_ATTEMPTS) {
      showResult(`😢 Game Over! The correct word was "${correctWord.toUpperCase()}".`);
    } else {
      currentAttempt = [];
    }
  }
}
function showResult(message) {
  const result = document.getElementById("result");
  const messageEl = document.getElementById("message");
  messageEl.textContent = message;
  result.classList.remove("hidden");
  gameOver = true;
}
function resetGame() {
  document.getElementById("result").classList.add("hidden");
  initGame();
}
document.addEventListener("keydown", e => {
  if (gameOver) return;
  if (e.key === "Enter") {
    submitAttempt();
  } else if (e.key === "Backspace") {
    deleteLetter();
  } else if (/^[a-zA-Z]$/.test(e.key)) {
    handleKeyPress(e.key.toLowerCase());
  }
});
window.onload = initGame;
