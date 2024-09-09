function cell() {
    let value = "-";

    const addToken = (player) => {
        value = player;
    }

    const getValue = () => value;


    return {
        addToken,
        getValue
    };
}

function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {

        board[i] = []

        for (let j = 0; j < columns; j++) {
            board[i].push(cell());
        }
    }


    const getBoard = () => board;

    const printBoard = () => {
        const boardPrint = board.map((row) => row.map((column) => column.getValue()))
        console.log(boardPrint);
    }

    const placeToken = (row, column, player) => {
        do {
            if (board[row][column].getValue() === "-") {
                board[row][column].addToken(player);
            }
            else {
                console.log("Invalid position, try again")
                placeToken(prompt("row"), prompt("column: "), player)
            }
        }
        while (board[row][column] === "-")
    }

    return {
        printBoard,
        getBoard,
        placeToken
    };
}

test = gameBoard()
best = cell()


test.printBoard();
test.placeToken(prompt("row"), prompt("column: "), "X")
test.printBoard();
test.placeToken(prompt("row"), prompt("column: "), "O")
test.printBoard();