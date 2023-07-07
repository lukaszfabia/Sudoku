function generateBoard(arr) {
    // tworznie tablicy z liczbami od 1 do 9
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] === 0) {
                //tasowanie liczb
                let shuffledNumbers = shuffleArray(numbers);

                for (let k = 0; k < shuffledNumbers.length; k++) {
                    //tasowanie liczb
                    let number = shuffledNumbers[k];
                    //sprawdzanie czy liczba pasuje do tablicy
                    if (checkBoard(arr, i, j, number)) {
                        arr[i][j] = number;
                        if (generateBoard(arr)) {
                            return true;
                        } else {
                            arr[i][j] = 0;
                        }
                    }
                }

                return false;
            }
        }
    }

    return true;
}


// Funkcja do tasowania (mieszania) elementów w tablicy
function shuffleArray(array) {
    let newArray = array.slice(); // Tworzenie kopii tablicy
    for (let i = newArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Zamiana miejscami elementów
    }
    return newArray;
}


function checkBoard(board, row, col, number) {
    // Sprawdzenie wiersza
    for (let i = 0; i < board.length; i++) {
        if (board[row][i] === number) {
            return false;
        }
    }

    // Sprawdzenie kolumny
    for (let i = 0; i < board.length; i++) {
        if (board[i][col] === number) {
            return false;
        }
    }

    // Sprawdzenie podmacierzy 3x3
    let subgridRow = Math.floor(row / 3) * 3; // Początkowy indeks wiersza podmacierzy
    let subgridCol = Math.floor(col / 3) * 3; // Początkowy indeks kolumny podmacierzy

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[subgridRow + i][subgridCol + j] === number) {
                return false;
            }
        }
    }

    return true;
}

function createBoard() {
    let board = Array.from({length: 9}, () => Array(9).fill(0));
    generateBoard(board);

    for (let i = 0; i < board.length; i++) {
        let row = '';
        for (let j = 0; j < board[i].length; j++) {
            row += board[i][j] + ' ';
        }
        console.log(row.trim());
    }

    return board;
}

function renderBoard(board) {
    let boardHtml = '<table class="sudoku-board">';

    for (let i = 0; i < 9; i++) {
        boardHtml += '<tr>';

        for (let j = 0; j < 9; j++) {
            const cellValue = board[i][j];

            if (cellValue === 0) {
                boardHtml += '<td class="sudoku-cell"></td>';
            } else {
                boardHtml += `<td class="sudoku-cell" data-number="${cellValue}">${cellValue}</td>`;
            }
        }

        boardHtml += '</tr>';
    }

    boardHtml += '</table>';

    return boardHtml;
}

let timerInterval;
let minutes = 0;
let seconds = 0;

function startTimer() {
    // Zerowanie minut i sekund
    minutes = 0;
    seconds = 0;

    // Aktualizowanie timera co sekundę
    timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
    // Zatrzymanie aktualizacji timera
    clearInterval(timerInterval);
}

function updateTimer() {
    // Inkrementacja sekund
    seconds++;

    // Inkrementacja minut, gdy osiągnięto 60 sekund
    if (seconds === 60) {
        seconds = 0;
        minutes++;
    }

    // Aktualizacja wyświetlanego czasu w elemencie z id "timer"
    document.getElementById("timer").innerHTML = formatTime(minutes, seconds);
}

function formatTime(minutes, seconds) {
    // Formatowanie czasu w formacie mm:ss
    let formattedMinutes = String(minutes).padStart(2, "0");
    let formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
}


function createMediumBoard() {
    let board = createBoard();
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (Math.random() < 0.6) {
                board[i][j] = 0;
            }
        }
    }
    return board;
}

function createHardBoard() {
    let board = createBoard();
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (Math.random() < 0.7) {
                board[i][j] = 0;
            }
        }
    }
    return board;
}

function createEasyBoard() {
    let board = createBoard();
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (Math.random() < 0.01) {
                board[i][j] = 0;
            }
        }
    }
    return board;
}

function createEmptyBoard() {
    let board = createBoard();
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (Math.random() < 1.0) {
                board[i][j] = 0;
            }
        }
    }
    return board;
}

document.addEventListener('DOMContentLoaded', function () {
    const boardContainer = document.getElementById('board-container');
    boardContainer.innerHTML = renderBoard(createEmptyBoard());
});

function isFull(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; i++) {
            if (board[i][j] === 0 && checkBoard(board, i, j, board[i][j])) {
                return false;
            }
        }
    }
    return true;
}

let selectedCell = null;
let selectedNumber = null;
const boardContainer = document.getElementById('board-container');

function sudokuBoard() {
    const selectElement = document.querySelector('.diff-lvl');
    const selectedDifficulty = selectElement.value;

    // Logika generowania planszy na podstawie wybranej trudności
    let board;
    if (selectedDifficulty === 'easy') {
        // Generowanie łatwej planszy
        board = createEasyBoard();
    } else if (selectedDifficulty === 'medium') {
        // Generowanie średniej planszy
        board = createMediumBoard();
    } else if (selectedDifficulty === 'hard') {
        // Generowanie trudnej planszy
        board = createHardBoard();
    }

    // Dodatkowa logika dla zaznaczania pola planszy
    boardContainer.addEventListener('click', (event) => {
        const clickedCell = event.target;
        if (clickedCell.classList.contains('sudoku-cell')) {
            if (selectedCell) {
                selectedCell.classList.remove('selected');
            }
            clickedCell.classList.add('selected');
            selectedCell = clickedCell;
            highlightNumbers(board, clickedCell);
        }
    });

    // Dodatkowa logika dla zaznaczania wybranej liczby z panelu
    const numbers = document.querySelectorAll('.input button');
    numbers.forEach((number) => {
        number.addEventListener('click', () => {
            if (selectedCell) {
                selectedNumber = number.innerText;
            }
        });
    });

    // Logika dla wstawiania wybranej liczby na kliknięcie
    boardContainer.addEventListener('click', () => {
        if (selectedCell && selectedNumber) {
            const rowIndex = selectedCell.parentNode.rowIndex;
            const cellIndex = selectedCell.cellIndex;
            if (board[rowIndex][cellIndex] === 0) {
                selectedCell.innerText = selectedNumber;
                board[rowIndex][cellIndex] = parseInt(selectedNumber);
            }
            selectedCell = null;
            selectedNumber = null;
        }
    });

    // Ustawienie planszy w kontenerze
    boardContainer.innerHTML = renderBoard(board);

    if (board) {
        // Plansza została wygenerowana
        startTimer();
        updateTimer();
        selectElement.disabled = true; // Zablokowanie comboboxa
    } else if(isFull(board)) {
        // Plansza została uzupełniona
        stopTimer();
        selectElement.disabled = false; // Odblokowanie comboboxa
        alert("Win! Your time: " + formatTime(minutes, seconds) + "!");
    }else {
        // Plansza nie została wygenerowana
        stopTimer();
        selectElement.disabled = false; // Odblokowanie comboboxa
    }
}

function highlightNumbers(board, clickedCell) {
    const rowIndex = clickedCell.parentNode.rowIndex;
    const cellIndex = clickedCell.cellIndex;
    const number = parseInt(clickedCell.innerText);

    // Usuń klasę .selected ze wszystkich komórek planszy
    const cells = Array.from(boardContainer.querySelectorAll('.sudoku-cell'));
    cells.forEach((cell) => {
        cell.classList.remove('selected');
        cell.classList.remove('selected-number');
    });

    // Podświetl liczby w tym samym wierszu
    const row = Array.from(clickedCell.parentNode.children);
    row.forEach((cell) => {
        if (cell.classList.contains('sudoku-cell')) {
            cell.classList.add('selected');
        }
    });

    // Podświetl liczby w tej samej kolumnie
    const column = Array.from(boardContainer.querySelectorAll(`.sudoku-board tr td:nth-child(${cellIndex + 1})`));
    column.forEach((cell) => {
        if (cell.classList.contains('sudoku-cell')) {
            cell.classList.add('selected');
        }
    });

    // Podświetl liczby w tym samym kwadracie 3x3
    const startRowIndex = Math.floor(rowIndex / 3) * 3;
    const startCellIndex = Math.floor(cellIndex / 3) * 3;
    for (let i = startRowIndex; i < startRowIndex + 3; i++) {
        for (let j = startCellIndex; j < startCellIndex + 3; j++) {
            const cell = boardContainer.querySelector(`.sudoku-board tr:nth-child(${i + 1}) td:nth-child(${j + 1})`);
            if (cell.classList.contains('sudoku-cell')) {
                cell.classList.add('selected');
            }
        }
    }

    // Podświetl wszystkie liczby z planszy z wybranego pola
    const cellsWithNumber = Array.from(boardContainer.querySelectorAll(`.sudoku-cell[data-number="${number}"]`));
    cellsWithNumber.forEach((cell) => {
        cell.classList.add('selected-number');
    });


}

