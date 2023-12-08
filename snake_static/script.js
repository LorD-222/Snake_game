const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const restartButton = document.getElementById('restartButton');
const scoreSpan = document.getElementById('score');
const highScoreSpan = document.getElementById('highScore');
const controlSettingInputs = document.querySelectorAll('input[name="controlMode"]');
const swipeArea = document.getElementById('swipeArea');
const SWIPE_THRESHOLD = 30; // Минимальное расстояние для регистрации свайпа
const SNAKE_SIZE = 10;
const FOOD_SIZE = 10;

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let snake = [{ x: 150, y: 150 }];
let speed = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let foodColor;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let intervalId;
let isPaused = false;
let controlMode = 'arrows';
let GAME_SPEED = 100;


canvas.width = 500;
canvas.height = 500;

function updateGame() {
    if (isGameOver()) {
        gameOver();
        return;
    }

    clearCanvas();
    drawSnake();
    drawFood();
    moveSnake();
    checkFoodCollision();

    // Увеличение скорости
    if (score % 50 === 0 && score !== 0) {
        clearInterval(intervalId);
        intervalId = setInterval(updateGame, GAME_SPEED - Math.floor(score / 50) * 5);
    }
}

function initGame() {
    placeFood();
    score = 0;
    scoreSpan.innerText = score;
    highScoreSpan.innerText = highScore;
    speed = { x: 10, y: 0 };
    snake = [{ x: 150, y: 150 }];
    if (intervalId) {
        clearInterval(intervalId);
    }
    intervalId = setInterval(updateGame, GAME_SPEED);
}

startButton.addEventListener('click', () => {
    if (isPaused) {
        resumeGame();
    } else {
        initGame();
    }
});

pauseButton.addEventListener('click', pauseGame);
restartButton.addEventListener('click', initGame);

controlSettingInputs.forEach(input => {
    input.addEventListener('change', (e) => {
        controlMode = e.target.value;
    });
});

document.addEventListener('keydown', e => {
    if (controlMode === 'arrows') {
        switch (e.key) {
            case 'ArrowLeft':
                if (speed.x !== 10) speed = { x: -10, y: 0 };
                break;
            case 'ArrowUp':
                if (speed.y !== 10) speed = { x: 0, y: -10 };
                break;
            case 'ArrowRight':
                if (speed.x !== -10) speed = { x: 10, y: 0 };
                break;
            case 'ArrowDown':
                if (speed.y !== -10) speed = { x: 0, y: 10 };
                break;
        }
    } else if (controlMode === 'WASD') {
        switch (e.key) {
            case 'a':
            case 'A':
                if (speed.x !== 10) speed = { x: -10, y: 0 };
                break;
            case 'w':
            case 'W':
                if (speed.y !== 10) speed = { x: 0, y: -10 };
                break;
            case 'd':
            case 'D':
                if (speed.x !== -10) speed = { x: 10, y: 0 };
                break;
            case 's':
            case 'S':
                if (speed.y !== -10) speed = { x: 0, y: 10 };
                break;
        }
    }
});

function clearCanvas() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, SNAKE_SIZE, SNAKE_SIZE);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + speed.x, y: snake[0].y + speed.y };
    snake.unshift(head);
    if (!checkFoodCollision()) {
        snake.pop();
    }
}

function checkFoodCollision() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 10;
        scoreSpan.innerText = score;
        placeFood();
        return true;
    }
    return false;
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x, food.y, FOOD_SIZE, FOOD_SIZE);
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / FOOD_SIZE)) * FOOD_SIZE,
        y: Math.floor(Math.random() * (canvas.height / FOOD_SIZE)) * FOOD_SIZE
    };
    foodColor = getRandomColor();
}

function getRandomColor() {
    const colors = ['red', 'blue', 'green', 'purple', 'pink'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function isGameOver() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - SNAKE_SIZE;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height - SNAKE_SIZE;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function gameOver() {
    clearInterval(intervalId);
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Игра окончена', 50, canvas.height / 2);
    ctx.fillText(`Очки: ${score}`, 50, canvas.height / 2 + 30);
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreSpan.innerText = highScore;
    }
}

function pauseGame() {
    isPaused = true;
    clearInterval(intervalId);
}

function resumeGame() {
    isPaused = false;
    intervalId = setInterval(updateGame, GAME_SPEED);
}

swipeArea.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

swipeArea.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(dy) > SWIPE_THRESHOLD) {
        if (Math.abs(dx) > Math.abs(dy)) {
            // Горизонтальный свайп
            if (dx > 0) {
                speed = { x: 10, y: 0 }; // Свайп вправо
            } else {
                speed = { x: -10, y: 0 }; // Свайп влево
            }
        } else {
            // Вертикальный свайп
            if (dy > 0) {
                speed = { x: 0, y: 10 }; // Свайп вниз
            } else {
                speed = { x: 0, y: -10 }; // Свайп вверх
            }
        }
    }
}

// Отображение элементов управления для мобильных устройств
if ('ontouchstart' in window) {
    document.querySelector('.mobile-controls').style.display = 'block';
}