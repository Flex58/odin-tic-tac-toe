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
        if (board[row][column].getValue() === "-") {
            board[row][column].addToken(player);
        }
        else {
            console.log("Invalid position, try again")
        }
    }

    return {
        printBoard,
        getBoard,
        placeToken
    };
}