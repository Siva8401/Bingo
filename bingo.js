const table = document.querySelector("#tblBingo");
const letter = document.querySelectorAll(".letters-bingo");

const winningPositions = [
    [0, 1, 2, 3, 4],    // Row 1
    [5, 6, 7, 8, 9],    // Row 2
    [10, 11, 12, 13, 14], // Row 3
    [15, 16, 17, 18, 19], // Row 4
    [20, 21, 22, 23, 24], // Row 5
    [0, 5, 10, 15, 20], // Column 1
    [1, 6, 11, 16, 21], // Column 2
    [2, 7, 12, 17, 22], // Column 3
    [3, 8, 13, 18, 23], // Column 4
    [4, 9, 14, 19, 24], // Column 5
    [0, 6, 12, 18, 24], // Diagonal from top-left to bottom-right
    [4, 8, 12, 16, 20]  // Diagonal from top-right to bottom-left
];

let arr = Array.apply(null, { length: 26 }).map(Number.call, Number);
arr.shift(); // Remove the first element (0) from the array

shuffle(arr);

function shuffle(arr) {
    let currentIndex = arr.length, randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }

    return arr;
}

let iterator = 0;

for (i = 0; i < 5; i++) {
    let tr = document.createElement("tr");
    table.appendChild(tr);

    for (j = 0; j < 5; j++) {
        let td = document.createElement("td");
        td.id = arr[iterator].toString();
        td.style.height = "20%";
        td.style.width = "20%";
        td.classList.add("main-table-cell");

        let div = document.createElement("div");
        div.classList.add("cell-format");
        div.textContent = arr[iterator].toString();
        td.appendChild(div);
        tr.appendChild(td);
        iterator++;
    }
}

const cell = document.querySelectorAll(".main-table-cell");
let winningIterator = 0;
let gameWon = false; // Flag to check if the game is won

cell.forEach(e => {
    e.addEventListener("click", () => {
        if (gameWon) return; // Prevent further clicks once the game is won

        e.classList.add("strickout");

        if (matchWin()) {
            letter[winningIterator].classList.add("show-bingo");

            winningIterator++;
            if (winningIterator === 5) {
                gameWon = true; // Set the flag to prevent further clicks
                displayWinningImage(); // Call the function to display the image
            }
        }
    });
});

function matchWin() {
    const cell = document.querySelectorAll(".main-table-cell");

    return winningPositions.some(combination => {
        let ite = 0;
        combination.forEach(index => {
            if (cell[index].classList.contains("strickout")) ite++;
        });

        if (ite === 5) {
            let indexWin = winningPositions.indexOf(combination);
            winningPositions.splice(indexWin, 1);

            // Apply strickout to all cells in the winning combination
            combination.forEach(index => {
                cell[index].classList.add("strickout");
            });

            return true;
        }

        return false;
    });
}
