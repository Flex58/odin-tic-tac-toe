//TODO: 
//      - LET PLAYERS CHANGE NAME BY FORM
//      - STYLE


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
    let gameStart = false;
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

            if (Number(row) + Number(column) == (n - 1)) {
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
        
        if (!gameStart) return;
        if (gameOver) return;
        console.log(`Placing token at ${row} ${column}`)
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
    
    const startGame = () => {
        
        gameStart = true;
        printNewRound();
        
    }

    const restartGame = () => {
        const playBoard = board.getBoard();
        playBoard.forEach(row => {
            row.forEach(column => {
                column.addToken("")
            })
        })
        activePlayer = players[0]
        printNewRound();
        gameOver = false;
        gameTurn = 0;
    }

    return {
        playRound,
        getActivePlayer,
        checkWin,
        setPlayerName,
        startGame,
        restartGame
    }
})("Player1", "Player2");


const displayController = (() => {

    const game = gameController;
    const boardDiv = document.querySelector(".board");
    const turnDiv = document.querySelector(".turn");
    const startBtn = document.querySelector(".start")
    const restartBtn = document.createElement("button")
    const containerDiv = document.querySelector(".container")
    const changeNameForm = document.querySelector("#change-name")
    restartBtn.classList.add("restart")
    let startGame;

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
        const row = e.target.dataset.row;
        const column = e.target.dataset.column;
        
        
        if (!row || !column) return;

        if (game.playRound(row, column)){
            updateScreen();
            let winStatus = game.checkWin(row, column, activePlayer.token)
            if (winStatus == "win") {
                startGame = false
                turnDiv.textContent = `${game.getActivePlayer().name} ${winStatus}s!`;
                containerDiv.appendChild(restartBtn)
            }
            
            else if (winStatus == "draw") {
                startGame = false
                turnDiv.textContent = `${winStatus}!`;
                containerDiv.appendChild(restartBtn)
            }
        }
    })  

    startBtn.addEventListener("click", () => {
        game.startGame();
        startGame = true;
        updateScreen();
        startBtn.remove();
    })

    restartBtn.addEventListener("click", () => {
        startGame = true;
        game.restartGame()
        updateScreen()
        restartBtn.remove()
    })
    
    changeNameForm.addEventListener("submit", (e) => {
        if (document.querySelector("#p1").value) {
            game.setPlayerName(document.querySelector("#p1").value, 0)
        }

        if (document.querySelector("#p2").value) {
            game.setPlayerName(document.querySelector("#p2").value, 1)
        }

        if (startGame) {
            updateScreen();
        }

        e.preventDefault();
    })

})();