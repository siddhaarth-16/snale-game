
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const bestElement = document.getElementById("best");
const message = document.getElementById("message");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const box = 20;
const totalBoxes = canvas.width / box;

let snake;
let food;
let direction;
let nextDirection;
let score;
let gameInterval = null;
let running = false;

let bestScore = Number(localStorage.getItem("snakeBest")) || 0;
bestElement.textContent = bestScore;

function initializeGame() {
    snake = [{ x: 10, y: 10 }];
    direction = "RIGHT";
    nextDirection = "RIGHT";
    score = 0;

    scoreElement.textContent = score;
    generateFood();

    drawGame();
}

function generateFood() {
    do {
        food = {
            x: Math.floor(Math.random() * totalBoxes),
            y: Math.floor(Math.random() * totalBoxes)
        };
    } while (snake.some(part =>
        part.x === food.x && part.y === food.y
    ));
}

function drawGame() {
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#4ade80" : "#16a34a";

        ctx.fillRect(
            part.x * box,
            part.y * box,
            box - 2,
            box - 2
        );
    });

    // Draw food
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(
        food.x * box,
        food.y * box,
        box - 2,
        box - 2
    );
}

function moveSnake() {
    direction = nextDirection;

    const head = { ...snake[0] };

    if (direction === "UP") head.y--;
    if (direction === "DOWN") head.y++;
    if (direction === "LEFT") head.x--;
    if (direction === "RIGHT") head.x++;

    // Wall collision
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= totalBoxes ||
        head.y >= totalBoxes
    ) {
        gameOver();
        return;
    }

    const eating = head.x === food.x && head.y === food.y;

    // Self collision
    const body = eating ? snake : snake.slice(0, -1);

    if (body.some(part =>
        part.x === head.x && part.y === head.y
    )) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (eating) {
        score += 10;
        scoreElement.textContent = score;

        if (score > bestScore) {
            bestScore = score;
            bestElement.textContent = bestScore;
            localStorage.setItem("snakeBest", bestScore);
        }

        generateFood();
    } else {
        snake.pop();
    }

    drawGame();
}

function changeDirection(event) {
    const keys = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT"
    };

    const newDirection = keys[event.key];

    if (!newDirection) return;

    event.preventDefault();

    if (newDirection === "UP" && direction !== "DOWN") {
        nextDirection = "UP";
    } else if (newDirection === "DOWN" && direction !== "UP") {
        nextDirection = "DOWN";
    } else if (newDirection === "LEFT" && direction !== "RIGHT") {
        nextDirection = "LEFT";
    } else if (newDirection === "RIGHT" && direction !== "LEFT") {
        nextDirection = "RIGHT";
    }
}

function startGame() {
    if (running) return;

    if (!snake) initializeGame();

    running = true;
    message.textContent = "Game Started! 🐍";

    gameInterval = setInterval(moveSnake, 120);
}

function gameOver() {
    clearInterval(gameInterval);
    gameInterval = null;
    running = false;

    message.textContent = "Game Over! Final Score: " + score;
}

function restartGame() {
    clearInterval(gameInterval);
    gameInterval = null;
    running = false;

    initializeGame();
    message.textContent = "Ready? Press Start!";
}

document.addEventListener("keydown", changeDirection);

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

initializeGame();
