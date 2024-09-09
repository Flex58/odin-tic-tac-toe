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
            return true;
        }
        else {
            console.log("Invalid position, try again")
            return false;
        }
    }

    return {
        printBoard,
        getBoard,
        placeToken
    };
}

function gameController(playerOneName = "Player1", 
                        playerTwoName = "Player2") {
    
    const players = [
        {
            name: playerOneName,
            token: "X"
        },
        {
            name: playerTwoName,
            token: "O"
        }
    ];

    let gameTurn = 0

    const board = gameBoard();

    let activePlayer = players[0]

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`It is ${activePlayer.name}'s turn.`)
    }

    const checkWin = (row, column, token) => {
        let n = 3; // n = board size
        const playBoard = board.getBoard();
        //check horizontals
        for (let i = 0; i < n; i++) {
            if (playBoard[row][i].getValue() != token) break;
            
            if (i == n - 1) {
                board.printBoard();
                console.log(`${getActivePlayer().name} wins!`)
                return true;
            }
        }
        //check verticals
        for (let i = 0; i < n; i++) {
            if (playBoard[i][column].getValue() != token) break;
            
            if (i == n - 1) {
                board.printBoard();
                console.log(`${getActivePlayer().name} wins!`)
                return true;
            }
        //check diagonals
            if (row === column) {
                for (let i = 0; i < n; i++) {
                    if (playBoard[i][i].getValue() != token) break;

                    if (i == n - 1) {
                        board.printBoard();
                        console.log(`${getActivePlayer().name} wins!`)
                        return true;
                    }
                }
            }

            if (row + column === n - 1) {
                for (let i = 0; i < n; i++) {
                    if (playBoard[i][n - 1 - i].getValue() != token) break;

                    if (i == n - 1) {
                        board.printBoard();
                        console.log(`${getActivePlayer().name} wins!`)
                        return true;
                    }
                }
            }
        }
    }

    const playRound = (row, column) => {
        
        console.log(`Placing token at ${row} ${column}`)
        let round = board.placeToken(row, column, getActivePlayer().token);


        

        if (round) {
            gameTurn++;
            if (checkWin(row, column, getActivePlayer().token)) return
            if (gameTurn == 9) {
                console.log("It's a draw")
                return
            }
            switchPlayer();
            printNewRound();
        }
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer
    }
}

const game = gameController();