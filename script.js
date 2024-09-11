//TODO: 
//      - CHANGE GAMEOVER TO BE CONTROLLED BY GAMECONTROLLER
//      - LET PLAYERS CHANGE NAME BY FORM
//      - STYLE
//      - NEW GAME AND RESTART BUTTON


function cell() {
    let value = "";

    const addToken = (player) => {
        value = player;
    }

    const getValue = () => value;


    return {
        addToken,
        getValue
    };
}

const gameBoard = (() => {
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
        if (board[row][column].getValue() === "") {
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
})();

const gameController = ((playerOneName, playerTwoName) => {
    let gameTurn = 0
    let gameOver = false;

    const board = gameBoard;
    
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

    const setPlayerName = (name, i) => players[i].name = name

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
        //check horizontal
        for (let i = 0; i < n; i++) {
            if (playBoard[row][i].getValue() != token) break;
            
            if (i == n - 1) {
                return "win";
            }
        }
        //check vertical
        for (let i = 0; i < n; i++) {
            if (playBoard[i][column].getValue() != token) break;
            
            if (i == n - 1) {
                return "win";
            }
        }
        //check diagonals
            if (row === column) {
                for (let i = 0; i < n; i++) {
                    if (playBoard[i][i].getValue() != token) break;

                    if (i == n - 1) {
                        return "win";
                    }
                }
            }

            if (row + column === n - 1) {
                for (let i = 0; i < n; i++) {
                    if (playBoard[i][n - 1 - i].getValue() != token) break;

                    if (i == n - 1) {
                        return "win";
                    }
                }
            }

            if (gameTurn == 9) {
                return "draw";
            }
    }
    

    const playRound = (row, column) => {
        
        console.log(`Placing token at ${row} ${column}`)
        if (gameOver) return;
        
        let round = board.placeToken(row, column, getActivePlayer().token);
        
        if (round) {
            gameTurn++;
            let winStatus = checkWin(row, column, getActivePlayer().token);
            if (winStatus == "win") return board.printBoard(), console.log(`${getActivePlayer().name} ${winStatus}s!`), gameOver = true
            
            if (winStatus == "draw") return board.printBoard(), console.log(`${winStatus}!`), gameOver = true
    
            switchPlayer();
            printNewRound();
            return true;
        }
    }
    
    printNewRound();

    return {
        playRound,
        getActivePlayer,
        checkWin,
        setPlayerName
    }
})("Player1", "Player2");


const displayController = (() => {

    const game = gameController;
    const boardDiv = document.querySelector(".board");
    const turnDiv = document.querySelector(".turn");

    const updateScreen = () => {
        boardDiv.textContent = "";

        board = gameBoard.getBoard();

        activePlayer = game.getActivePlayer();

        turnDiv.textContent = `It's ${activePlayer.name}'s turn!`

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
               const btn = document.createElement("button");
               btn.classList.add("cell")
               btn.textContent = cell.getValue();
               btn.dataset.column = columnIndex;
               btn.dataset.row = rowIndex;

               boardDiv.appendChild(btn);
            }) 
        });
    }
    
    boardDiv.addEventListener("click", (e) => { 
        let row = e.target.dataset.row;
        let column = e.target.dataset.column;
        
        
        if (!row || !column) return;

        if (game.playRound(row, column)){
            updateScreen();
            let winStatus = game.checkWin(row, column, activePlayer.token)
            if (winStatus == "win") return turnDiv.textContent = `${game.getActivePlayer().name} ${winStatus}s!`;
            
            else if (winStatus == "draw") return turnDiv.textContent = `${winStatus}!`;
        }
    })  

    updateScreen();

})();