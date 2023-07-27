const boardContainer = document.getElementById('board-container');
let board;
let timerInterval;
let minutes = 0;
let seconds = 0;
let helpBoard;
let isPaused = false; // Zmienna przechowująca informację o zatrzymaniu timera
let pausedMinutes = 0; // Zmienna przechowująca zatrzymane minuty
let pausedSeconds = 0; // Zmienna przechowująca zatrzymane sekundy
let isGenerated = []; // Zmienna przechowująca informację o wygenerowaniu planszy
let selectedCell = null;
let clickedCell = null;


/**
 * Funkcja do generowania planszy
 * @param arr
 * @returns {boolean}
 */
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


/**
 * Funkcja do tasowania planszy
 * @param array
 * @returns {*}
 */
function shuffleArray(array) {
    let newArray = array.slice(); // Tworzenie kopii tablicy
    for (let i = newArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Zamiana miejscami elementów
    }
    return newArray;
}

/**
 * Funkcja do sprawdzajaca poprawnosc wstawionych liczby w trakcie genrowania planszy
 * @param board
 * @param row
 * @param col
 * @param number
 * @returns {boolean}
 */
function checkBoard(board, row, col, number) {
    // Sprawdzenie wiersza
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === number) {
            return false;
        }
    }

    // Sprawdzenie kolumny
    for (let i = 0; i < 9; i++) {
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

/**
 * Funkcja do stworzenia planszy
 * @returns {any[][]}
 */
function createBoard() {
    let board = Array.from({length: 9}, () => Array(9).fill(0));
    generateBoard(board);
    prepareBoard();

    for (let i = 0; i < board.length; i++) {
        let row = '';
        for (let j = 0; j < board[i].length; j++) {
            row += board[i][j] + ' ';
        }
        row.trim();
    }

    return board;
}

/**
 * Funkcja do przygotowania planszy w formie HTML
 * @param board
 * @returns {string}
 */
function renderBoard(board) {
    let boardHtml = '<table class="sudoku-board">';

    for (let i = 0; i < 9; i++) {
        boardHtml += '<tr>';

        for (let j = 0; j < 9; j++) {
            const cellValue = board[i][j];

            if (cellValue === 0) {
                boardHtml += '<td class="sudoku-cell"></td>';

            } else {
                boardHtml += `<td class="sudoku-cell">${cellValue}</td>`;
            }
        }

        boardHtml += '</tr>';
    }

    boardHtml += '</table>';

    return boardHtml;
}

/**
 * Funkcja do startowania czasu
 * @type {void}
 */
function startTimer() {
    // Zerowanie minut i sekund, jeśli timer nie był zatrzymany
    if (!isPaused) {
        minutes = 0;
        seconds = 0;
    } else {
        minutes = pausedMinutes;
        seconds = pausedSeconds;
    }

    // Aktualizowanie timera co sekundę
    timerInterval = setInterval(updateTimer, 1000);
}

/**
 * Funkcja do wznowienia czasu
 * @type {void}
 */
function resumeTimer() {
    isPaused = false;
    minutes = pausedMinutes;
    seconds = pausedSeconds;
    timerInterval = setInterval(updateTimer, 1000);
}

/**
 * Funkcja do zatrzymania czasu
 * @type {void}
 */
function stopTimer() {
    // Zatrzymanie aktualizacji timera
    clearInterval(timerInterval);
}

/**
 * Funkcja do aktualizacji czasu
 * @type {void}
 */
function updateTimer() {
    if (isProper()) {
        stopTimer();
        alert('Win!' + '\n' + 'Your time: ' + formatTime(minutes, seconds));

        window.location.href = 'game.html';

        return; // Zatrzymuje wykonywanie reszty kodu po przekierowaniu
    }

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

/**
 * Funkcja do zapauzowania czasu
 */
function pauseTimer() {
    isPaused = true;
    pausedMinutes = minutes;
    pausedSeconds = seconds;
    stopTimer();
}

/**
 * Funkcja do formatowania czasu
 * @param minutes
 * @param seconds
 * @returns {string}
 */
function formatTime(minutes, seconds) {
    // Formatowanie czasu w formacie mm:ss
    let formattedMinutes = String(minutes).padStart(2, "0");
    let formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
}

/**
 * Funkcja tworzaca tablice booleanow do sprawdzania czy liczba zostala wygenerowana
 * @type {void}
 */
function prepareBoard() {
    for (let i = 0; i < 9; i++) {
        isGenerated[i] = new Array(9).fill(true);
    }

}

/**
 * Zwraca tablice o srednim poziomie trudnosci
 * @returns {*[][]}
 */
function createMediumBoard() {
    let board = createBoard();
    helpBoard = [];

    for (let i = 0; i < board.length; i++) {
        helpBoard[i] = board[i].slice(); // Głęboka kopia wiersza tablicy
    }

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (Math.random() < 0.6) {
                board[i][j] = 0;
                isGenerated[i][j] = false;
            }
        }
    }

    return board;
}

/**
 * Zwraca tablice o trudnym poziomie trudnosci
 * @returns {*[][]}
 */
function createHardBoard() {
    let board = createBoard();
    helpBoard = [];

    for (let i = 0; i < board.length; i++) {
        helpBoard[i] = board[i].slice(); // Głęboka kopia wiersza tablicy
    }
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (Math.random() < 0.7) {
                board[i][j] = 0;
                isGenerated[i][j] = false;
            }
        }
    }
    return board;
}

/**
 * Zwraca tablice o łatwym poziomie trudnosci
 * @returns {*[][]}
 */
function createEasyBoard() {
    let board = createBoard();
    helpBoard = [];

    for (let i = 0; i < board.length; i++) {
        helpBoard[i] = board[i].slice(); // Głęboka kopia wiersza tablicy
    }
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (Math.random() < 0.5) {
                board[i][j] = 0;
                isGenerated[i][j] = false;
            }
        }
    }
    return board;
}

/**
 * Zwraca pusta tablice
 * @returns {*[][]}
 */
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


/**
 * Funkcja pokazujaca pusta tablice po zaladowaniu strony
 * @type {void}
 */
document.addEventListener('DOMContentLoaded', function () {
    const boardContainer = document.getElementById('board-container');
    boardContainer.innerHTML = renderBoard(createEmptyBoard());
});

/**
 * Glowna funkcja do tworzenia planszy
 * @type {void}
 */
function sudokuBoard() {
    let selectedNumber = null;
    const selectElement = document.querySelector('.diff-lvl');
    const selectedDifficulty = selectElement.value;
    const pauseButton = document.querySelector('.pause-button');

    pauseButton.disabled = selectElement.value === 'none';


    // Logika generowania planszy na podstawie wybranej trudności

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

    selectElement.disabled = !!board;
    document.querySelector('.check-button-style').disabled = false;
    document.querySelector('.rubber').disabled = false;
    document.querySelector('.get-help').disabled = false;
    boardContainer.innerHTML = renderBoard(board);


    // Dodatkowa logika dla zaznaczania pola planszy
    boardContainer.addEventListener('click', (event) => {
        clickedCell = event.target;
        if (clickedCell.classList.contains('sudoku-cell')) {
            selectedCell = clickedCell;
            highlightNumbers(board, clickedCell);
        }
    });

    const numbers = document.querySelectorAll('.input button');
    numbers.forEach((number) => {
        number.addEventListener('click', () => {
            if (selectedCell) {
                const rowIndex = selectedCell.parentNode.rowIndex;
                const cellIndex = selectedCell.cellIndex;
                if (board[rowIndex][cellIndex] === 0) {
                    selectedCell.innerText = number.innerText;
                    board[rowIndex][cellIndex] = parseInt(number.innerText);
                    highlightNumbers(board, clickedCell);
                }
            }
        });
    });

    boardContainer.addEventListener('click', (event) => {
        if (selectedCell && selectedNumber) {
            const clickedCell = event.target;
            const rowIndex = clickedCell.parentNode.rowIndex;
            const cellIndex = clickedCell.cellIndex;

            if (board[rowIndex][cellIndex] === 0) {
                clickedCell.innerText = selectedNumber;
                board[rowIndex][cellIndex] = parseInt(selectedNumber);
            }

            selectedCell = null;
            selectedNumber = null;
        }
    });

}

/**
 * Funkcja do zaznaczania liczb w planszy
 * @param board
 * @param clickedCell
 */
function highlightNumbers(board, clickedCell) {
    const innerBoard = document.getElementById('board-container');
    const rowIndex = clickedCell.parentNode.rowIndex;
    const cellIndex = clickedCell.cellIndex;
    const number = parseInt(clickedCell.innerText);


    highlightInsertedNumbers();

    // Usuń klasę .selected ze wszystkich komórek planszy
    const cells = Array.from(innerBoard.querySelectorAll('.sudoku-cell'));
    cells.forEach((cell) => {
        cell.classList.remove('selected');
        cell.classList.remove('selected-number');
        cell.classList.remove('wrong-number');
    });

    // Podświetl liczby w tym samym wierszu
    const row = Array.from(clickedCell.parentNode.children);
    row.forEach((cell) => {
        if (cell.classList.contains('sudoku-cell')) {
            cell.classList.add('selected');
        }
    });

    // Podświetl liczby w tej samej kolumnie
    const column = Array.from(innerBoard.querySelectorAll(`.sudoku-board tr td:nth-child(${cellIndex + 1})`));
    column.forEach((cell) => {
        cell.classList.add('selected');
    });

    // Podświetl liczby w tym samym kwadracie 3x3
    const startRowIndex = Math.floor(rowIndex / 3) * 3;
    const startCellIndex = Math.floor(cellIndex / 3) * 3;
    for (let i = startRowIndex; i < startRowIndex + 3; i++) {
        for (let j = startCellIndex; j < startCellIndex + 3; j++) {
            const cell = innerBoard.querySelector(`.sudoku-board tr:nth-child(${i + 1}) td:nth-child(${j + 1})`);
            cell.classList.add('selected');
        }
    }

    // Podświetl wszystkie liczby z planszy o takiej samej wartości
    const cellsWithNumber = Array.from(innerBoard.querySelectorAll('.sudoku-cell'));
    cellsWithNumber.forEach((cell) => {
        if (parseInt(cell.innerText) === number) {
            cell.classList.add('selected-number');
        }
    });
}

function highlightInsertedNumbers() {
    const cells = Array.from(boardContainer.querySelectorAll('.sudoku-cell'));
    cells.forEach((cell, index) => {
        const rowIndex = Math.floor(index / 9);
        const columnIndex = index % 9;
        if (!isGenerated[rowIndex][columnIndex]) {
            cell.classList.add('not-generated');
        }
    });
}

/**
 * Funkcja sprawdzajaca czy plansza jest poprawnie wypelniona
 * @returns {boolean}
 */
function isProper() {
    let isProper = true;
    const cells = Array.from(boardContainer.querySelectorAll('.sudoku-cell'));

    cells.forEach((cell, index) => {
        const rowIndex = Math.floor(index / 9);
        const columnIndex = index % 9;
        const number = parseInt(cell.innerText);
        if (number !== helpBoard[rowIndex][columnIndex]) {
            isProper = false;
        }
    });

    return isProper;
}

/**
 * Funkcja sprawdzająca poprawność wprowadzonych liczb, dziala tylko wtedy gdy użytkownik wprowadził jakas liczbe, mozna uzyc jej raz
 * @type {void}
 */
function check() {

    // Usuń klasę .selected ze wszystkich komórek planszy
    const cells = Array.from(boardContainer.querySelectorAll('.sudoku-cell'));
    cells.forEach((cell) => {
        cell.classList.remove('selected');
        cell.classList.remove('selected-number');
    });

    cells.forEach((cell, index) => {
        const rowIndex = Math.floor(index / 9);
        const columnIndex = index % 9;
        const number = parseInt(cell.innerText);
        if (!isNaN(number) && number !== helpBoard[rowIndex][columnIndex]) {
            cell.classList.add('wrong-number');
        }

    });

    if (!checkInput()) {
        document.querySelector('.check-button-style').disabled = true;
    }

}


/**
 * Funkcja sprawdzająca czy użytkownik wprowadził jakieś liczby
 * @returns {boolean}
 */
function checkInput() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (isGenerated[i][j] === false && board[i][j] !== 0) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Funkcje odpowiadajca za pauze gry
 * @type {void}
 */

function togglePause() {
    const pauseButton = document.querySelector(".pause-button");
    const pauseLabel = document.querySelector(".pause-label");
    const sudokuBoard = document.querySelector(".sudoku-board");

    if (isPaused) {
        sudokuBoard.classList.remove("blurred");
        pauseButton.classList.remove("paused");
        pauseLabel.textContent = "pause";
        resumeTimer();
    } else {
        pauseButton.classList.add("paused");
        sudokuBoard.classList.add("blurred");
        pauseLabel.textContent = "resume";
        pauseTimer();
    }
}

/**
 * Funkcja odpowiadająca za usuniecie inputu gracza
 * @type {void}
 */
function remove() {
    if (!isGenerated[selectedCell.parentNode.rowIndex][selectedCell.cellIndex]) {
        selectedCell.innerText = '0';
        const rowIndex = selectedCell.parentNode.rowIndex;
        const cellIndex = selectedCell.cellIndex;
        board[rowIndex][cellIndex] = 0;
    }
    boardContainer.innerHTML = renderBoard(board);
    highlightNumbers(board, clickedCell);
}

/**
 * Funkcja odpowiadająca za podpowiedz wstawiajaca randomowa liczbe w puste pole
 */


function getHelp() {
    let clickedCell;
    let counter = 0;
    const cells = Array.from(boardContainer.querySelectorAll('.sudoku-cell'));
    cells.forEach((cell) => {
        const number = parseInt(cell.innerText);
        if (isNaN(number) && counter === 0) {
            clickedCell = cell;
            const [randomRow, randomColumn] = getRandom();
            cell.innerText = helpBoard[randomRow][randomColumn];
            board[randomRow][randomColumn] = helpBoard[randomRow][randomColumn];
            isGenerated[randomRow][randomColumn] = true;
            document.querySelector('.get-help').disabled = true;
            counter++;
        }
    });

    boardContainer.innerHTML = renderBoard(board);
    highlightNumbers(board, clickedCell);

}


function getRandom() {
    let row, column;
    do {
        row = Math.floor(Math.random() * 9);
        column = Math.floor(Math.random() * 9);
    } while (board[row][column] !== 0);

    return [row, column];
}
