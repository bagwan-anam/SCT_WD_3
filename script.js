let boxes = document.querySelectorAll(".box");
let choise = document.querySelector(".choise");
let turnContainer = document.querySelector(".turn-container");
let mainGrid = document.querySelector(".main-grid");
let results = document.querySelector(".results");
let playAgain = document.querySelector(".play-again");
let scoreContainer = document.querySelector(".score-container");

let turn = "X"; // X always starts
let isGameOver = false;
let gameMode = "pp";  // Default to Player vs Player
let player1Score = 0;
let player2Score = 0;
let drawsCount = 0; // Initialize draw counter

// Get the elements for Player1, Player2, and Draw counts
const p1ScoreDisplay = document.querySelector(".p1 p");
const p2ScoreDisplay = document.querySelector(".p2 p");
const drawsCountDisplay = document.querySelector(".dr p");

// Handle clicks for both Player vs Player and Player vs Computer
boxes.forEach(e => {
    e.innerHTML = "";
    e.addEventListener("click", () => {
        if (!isGameOver && e.innerHTML === "") {
            // Player's move logic (X or O depending on whose turn it is)
            e.innerHTML = turn;
            checkWin();
            checkDraw();
            if (!isGameOver) {
                changeTurn();
                if (gameMode === "pc" && turn === "O" && !isGameOver) {
                    // Computer makes a move after player's move
                    setTimeout(() => {
                        computerMove();
                        // Ensure the win check only happens once after the computer move
                        if (!isGameOver) {
                            checkWin();
                            checkDraw();
                        }
                    }, 500);  // Delay to make the move feel natural
                }
            }
        }
    });
});

// Change turn between X and O
function changeTurn() {
    if (turn === "X") {
        turn = "O";
        document.querySelector(".bg").style.left = "85px"; // Update the turn indicator
    } else {
        turn = "X";
        document.querySelector(".bg").style.left = "0"; // Update the turn indicator
    }
}

// Check if there is a winner
function checkWin() {
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let i = 0; i < winConditions.length; i++) {
        let v0 = boxes[winConditions[i][0]].innerHTML;
        let v1 = boxes[winConditions[i][1]].innerHTML;
        let v2 = boxes[winConditions[i][2]].innerHTML;

        if (v0 !== "" && v0 === v1 && v0 === v2) {
            isGameOver = true;
            // Update the result message correctly with the winner
            if (v0 === "X") {
                document.querySelector(".results").innerHTML = "Player 1 (X) wins!";
                player1Score++;
                p1ScoreDisplay.textContent = player1Score; // Update Player 1 score
            } else if (v0 === "O") {
                document.querySelector(".results").innerHTML = "Player 2 (O) wins!";
                player2Score++;
                p2ScoreDisplay.textContent = player2Score; // Update Player 2 score
            }
            document.querySelector(".play-again").style.display = "inline";

            // Highlight the winning combination
            for (let j = 0; j < 3; j++) {
                boxes[winConditions[i][j]].style.backgroundColor = "#08D9D6";
                boxes[winConditions[i][j]].style.color = "#000";
            }
            return;
        }
    }
}

// Check if there is a draw
function checkDraw() {
    if (!isGameOver) {
        let isDraw = true;
        boxes.forEach(e => {
            if (e.innerHTML === "") isDraw = false;
        });

        if (isDraw) {
            isGameOver = true;
            document.querySelector(".results").innerHTML = "It's a Draw!";
            drawsCount++; // Increment the draw counter
            drawsCountDisplay.textContent = drawsCount; // Update the draw count in the HTML
            document.querySelector(".play-again").style.display = "inline";
        }
    }
}

// Computer's move (picks a random empty box)
function computerMove() {
    let emptyBoxes = [];
    boxes.forEach((box, index) => {
        if (box.innerHTML === "") {
            emptyBoxes.push(index);
        }
    });

    // Randomly pick an empty box for the computer
    let randomIndex = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
    boxes[randomIndex].innerHTML = "O";
    changeTurn(); // Change turn after the computer's move
}

// Reset the game
document.querySelector(".play-again").addEventListener("click", () => {
    isGameOver = false;
    turn = "X"; // X always starts
    document.querySelector(".bg").style.left = "0";
    document.querySelector(".results").innerHTML = "";
    document.querySelector(".play-again").style.display = "none";

    boxes.forEach(e => {
        e.innerHTML = "";
        e.style.removeProperty("background-color");
        e.style.color = "#fff";
    });
});

// Player vs Player mode
document.querySelector(".pp").addEventListener("click", () => {
    gameMode = "pp";  // Switch to Player vs Player mode
    choise.classList.add("hide");
    turnContainer.classList.remove("hide");
    mainGrid.classList.remove("hide");
    results.classList.remove("hide");
    playAgain.classList.remove("hide");
    scoreContainer.classList.remove("hide");
});

// Player vs Computer mode
document.querySelector(".pc").addEventListener("click", () => {
    gameMode = "pc";  // Switch to Player vs Computer mode
    choise.classList.add("hide");
    turnContainer.classList.remove("hide");
    mainGrid.classList.remove("hide");
    results.classList.remove("hide");
    playAgain.classList.remove("hide");
    scoreContainer.classList.remove("hide");

    // If it's the computer's turn (O), make the computer play automatically
    if (turn === "O") {
        setTimeout(() => {
            computerMove();
            // Avoid redundant win checks after computer move
            if (!isGameOver) {
                checkWin();
                checkDraw();
            }
        }, 500);  // Delay to make it feel like the computer is thinking
    }
});
