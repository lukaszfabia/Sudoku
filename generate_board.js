function generate_board(arr) {
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
                    if (check_board(arr, i, j, number)) {
                        arr[i][j] = number;
                        if (generate_board(arr)) {
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


function check_board(board, row, col, number) {
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

function create_board() {
    let board = Array.from({ length: 9 }, () => Array(9).fill(0));
    generate_board(board);

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
                boardHtml += `<td class="sudoku-cell">${cellValue}</td>`;
            }
        }

        boardHtml += '</tr>';
    }

    boardHtml += '</table>';

    return boardHtml;
}



function sudoku_board() {
    const selectElement = document.querySelector('.diff-lvl');
    const selectedDifficulty = selectElement.value;

    // Logika generowania planszy na podstawie wybranej trudności
    const board = create_board();

    // Wyświetlenie planszy wewnątrz kontenera
    const boardContainer = document.getElementById('board-container');

    boardContainer.innerHTML = renderBoard(board);
}