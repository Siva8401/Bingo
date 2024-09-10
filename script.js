// Firebase configuration
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyLCome6_8H9fMzkNYTGdufgzbyEzrBAA",
  authDomain: "bingo-online-17316.firebaseapp.com",
  databaseURL: "https://bingo-online-17316-default-rtdb.firebaseio.com",
  projectId: "bingo-online-17316",
  storageBucket: "bingo-online-17316.appspot.com",
  messagingSenderId: "738583483065",
  appId: "1:738583483065:web:cf35066e049804ad008168",
  measurementId: "G-YRX215QT34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Select HTML elements
const bingoCard = document.getElementById('bingo-card');
const shuffleBtn = document.getElementById('shuffle-btn');
const manualGenerateBtn = document.getElementById('manual-generate-btn');
const manualNumberInput = document.getElementById('manual-number');
const calledNumberDisplay = document.getElementById('called-number');
const calledNumbersDiv = document.getElementById('called-numbers');
const winMessage = document.getElementById('win-message');

let playerID = `player${Math.floor(Math.random() * 1000)}`;
let numbersPool = Array.from({ length: 25 }, (_, i) => i + 1);
let calledNumbers = [];
let playerCard = [];

// Initialize game
function initializeGame() {
  const currentPlayersRef = ref(db, 'game/currentPlayers');
  get(currentPlayersRef).then(snapshot => {
    if (snapshot.exists()) {
      const players = snapshot.val();
      if (Object.keys(players).length >= 2) {
        alert('2 players are already playing.');
        return;
      }
    }

    set(ref(db, `game/currentPlayers/${playerID}`), true);

    generateBingoCard();
    setupListeners();
  });
}

// Shuffle Bingo numbers
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Generate a new Bingo card
function generateBingoCard() {
  bingoCard.innerHTML = '';
  playerCard = shuffle(numbersPool.slice());
  playerCard.forEach(number => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.textContent = number;
    cell.addEventListener('click', () => markCell(cell));
    bingoCard.appendChild(cell);
  });
}

// Mark cell when clicked
function markCell(cell) {
  cell.classList.toggle('marked');
  checkWinCondition();
}

// Check for a win
function checkWinCondition() {
  let rows = [0, 0, 0, 0, 0];
  let cols = [0, 0, 0, 0, 0];
  let diag1 = 0, diag2 = 0;

  document.querySelectorAll('.cell').forEach((cell, index) => {
    if (cell.classList.contains('marked')) {
      let row = Math.floor(index / 5);
      let col = index % 5;
      rows[row]++;
      cols[col]++;
      if (row === col) diag1++;
      if (row + col === 4) diag2++;
    }
  });

  if (rows.includes(5) || cols.includes(5) || diag1 === 5 || diag2 === 5) {
    winMessage.classList.remove('hidden');
  }
}

// Setup Firebase listeners for real-time updates
function setupListeners() {
  const currentNumberRef = ref(db, 'game/currentNumber');
  onValue(currentNumberRef, (snapshot) => {
    if (snapshot.exists()) {
      const number = snapshot.val();
      calledNumbers.push(number);
      calledNumberDisplay.textContent = `Number: ${number}`;
      updateCalledNumbers();
    }
  });
}

// Update list of called numbers
function updateCalledNumbers() {
  calledNumbersDiv.innerHTML = '';
  calledNumbers.forEach(number => {
    const numberElement = document.createElement('span');
    numberElement.textContent = number;
    calledNumbersDiv.appendChild(numberElement);
  });
}

// Shuffle Button event
shuffleBtn.addEventListener('click', () => {
  generateBingoCard();
});

// Manual Generate Button event
manualGenerateBtn.addEventListener('click', () => {
  const number = parseInt(manualNumberInput.value);
  if (!number || number < 1 || number > 25 || calledNumbers.includes(number)) {
    alert('Invalid number');
    return;
  }
  set(ref(db, 'game/currentNumber'), number);
});

// Start the game
initializeGame();
