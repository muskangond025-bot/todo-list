const boardElement = document.getElementById("board");
const statusText = document.getElementById("status");
const congratsText = document.getElementById("congrats");
const nextBtn = document.getElementById("next-level");
const restartBtn = document.getElementById("restart");
const levelDisplay = document.getElementById("level-display");
const pvcBtn = document.getElementById("pvc-mode");
const pvpBtn = document.getElementById("pvp-mode");

let size = 3;
let currentPlayer = "X",
  gameActive = true,
  gameState = [];
let gameMode = "PvP";

function initGame() {
  gameState = Array(size * size).fill("");

  // Board size setting (Responsive logic)
  boardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  // Board ki width automatically adjust hogi
  let boardWidth = size * 80;
  boardElement.style.width = `min(90vw, ${boardWidth}px)`;

  boardElement.innerHTML = "";
  congratsText.innerText = "";

  // Null check: Agar button HTML mein nahi hai toh error na aaye
  if (nextBtn) nextBtn.style.display = "none";

  gameActive = true;
  currentPlayer = "X";

  levelDisplay.innerText = `Level: ${size}x${size}`;
  statusText.innerText = `Player ${currentPlayer}'s Turn`;
  statusText.style.color = "#3498db";

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-index", i);
    cell.addEventListener("click", handleCellClick);
    boardElement.appendChild(cell);
  }
}

function handleCellClick(e) {
  const idx = e.target.getAttribute("data-index");
  if (gameState[idx] !== "" || !gameActive) return;
  if (gameMode === "PvC" && currentPlayer !== "X") return;

  executeMove(idx, currentPlayer);

  if (gameActive && gameMode === "PvC" && currentPlayer === "O") {
    statusText.innerText = "Computer is thinking...";
    statusText.style.color = "#e74c3c";
    setTimeout(computerMove, 600);
  }
}

function executeMove(idx, player) {
  gameState[idx] = player;
  const cell = document.querySelector(`[data-index='${idx}']`);
  if (!cell) return;

  cell.innerText = player;
  if (player === "O") cell.classList.add("cell-o");

  if (checkWin()) {
    let msg =
      gameMode === "PvC" && player === "O"
        ? "💀 Computer Wins!"
        : `🎉 Player ${player} Wins!`;
    congratsText.innerText = msg;
    statusText.innerText = "Game Over";
    gameActive = false;
    if (nextBtn && (gameMode === "PvP" || player === "X"))
      nextBtn.style.display = "inline-block";
  } else if (!gameState.includes("")) {
    statusText.innerText = "It's a Draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerText = `Player ${currentPlayer}'s Turn`;
    statusText.style.color = currentPlayer === "X" ? "#3498db" : "#e74c3c";
  }
}

function computerMove() {
  if (!gameActive) return;
  let emptyCells = gameState
    .map((v, i) => (v === "" ? i : null))
    .filter((v) => v !== null);
  if (emptyCells.length > 0) {
    const randomIndex =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    executeMove(randomIndex, "O");
  }
}

function checkWin() {
  const winConditions = [];
  for (let i = 0; i < size; i++) {
    let row = [],
      col = [];
    for (let j = 0; j < size; j++) {
      row.push(i * size + j);
      col.push(j * size + i);
    }
    winConditions.push(row, col);
  }
  let d1 = [],
    d2 = [];
  for (let i = 0; i < size; i++) {
    d1.push(i * size + i);
    d2.push(i * size + (size - 1 - i));
  }
  winConditions.push(d1, d2);
  return winConditions.some((cond) =>
    cond.every((idx) => gameState[idx] === currentPlayer),
  );
}

// Button Click Listeners (Safe check)
if (pvcBtn)
  pvcBtn.addEventListener("click", () => {
    gameMode = "PvC";
    size = 3;
    initGame();
  });
if (pvpBtn)
  pvpBtn.addEventListener("click", () => {
    gameMode = "PvP";
    size = 3;
    initGame();
  });
if (nextBtn)
  nextBtn.addEventListener("click", () => {
    size++;
    initGame();
  });
if (restartBtn)
  restartBtn.addEventListener("click", () => {
    size = 3;
    initGame();
  });

initGame();
