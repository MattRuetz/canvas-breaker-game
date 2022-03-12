const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rulse');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const brickColCount = 9;
const brickRowCount = 4;

let score = 0;

//
let colors = {
    brick: '#0095dd',
    ball: '#0095dd',
    paddle: '#0095dd',
};

// Create ball props
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4,
};

// Create Paddle props
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0,
};

// CSS props for a brick
const brickProps = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true,
};

// Creates a 2d array to represent brick grid
const bricks = [];
for (let row = 0; row < brickColCount; row++) {
    bricks[row] = [];
    for (let col = 0; col < brickRowCount; col++) {
        const x =
            row * (brickProps.w + brickProps.padding) + brickProps.offsetX;
        const y =
            col * (brickProps.h + brickProps.padding) + brickProps.offsetY;

        bricks[row][col] = { x, y, ...brickProps };
    }
}

const startNewGame = () => {
    showAllBricks();
    score = 0;
};

// Draw paddle on canvas
const drawPaddle = () => {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = colors['paddle'];
    ctx.fill();
    ctx.closePath();
};

// Draw ball on canvas
const drawBall = () => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = colors['ball'];
    ctx.fill();
    ctx.closePath();
};

const drawScore = () => {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
};

const drawBricks = () => {
    bricks.forEach((col) => {
        col.forEach((brick) => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? colors['brick'] : 'transparent';
            ctx.fill();
            ctx.closePath();
        });
    });
};

const drawEverything = () => {
    // First clear canvas from prev frame...
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
};

// Handle user moving paddle
const movePaddle = () => {
    paddle.x += paddle.dx;

    // Wall detect
    paddle.x + paddle.w > canvas.width && (paddle.x = canvas.width - paddle.w);
    paddle.x < 0 && (paddle.x = 0);
};

const showAllBricks = () => {
    bricks.forEach((col) => {
        col.forEach((brick) => (brick.visible = true));
    });
};

const increaseScore = () => {
    score++;

    if (score === brickColCount * brickRowCount) {
        alert("YOU WON! I'll add a better vicory screen soon... I promise.");
        startNewGame();
    }
};

// Move ball on canvas
const moveBall = () => {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1; // hit vertical wall, invert X direction
    }
    if (ball.y - ball.size < 0) {
        ball.dy *= -1; // hit horizontal wall, invert X direction
    }

    // Paddle collision
    if (
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -ball.speed;
    }

    // Brick Collisions
    bricks.forEach((col) => {
        col.forEach((brick) => {
            if (brick.visible) {
                if (
                    ball.x - ball.size > brick.x && // check LEFT side of brick
                    ball.x + ball.size < brick.x + brick.w && // check RIGHT side
                    ball.y + ball.size > brick.y && // check TOP side
                    ball.y - ball.size < brick.y + brick.h // check BOTTOM side
                ) {
                    ball.dy *= -1;
                    brick.visible = false;
                    // hit a brick, iterate score
                    increaseScore();
                }
            }
        });
    });

    // Hit bottom (passed paddle) - LOSE
    if (ball.y + ball.size > canvas.height) {
        startNewGame();
    }
};

// update entire canvas and all elements for new frame
const update = () => {
    movePaddle();
    moveBall();

    // Draw Everything
    drawEverything();
    requestAnimationFrame(update);
};

const keyDown = (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
};

const keyUp = (e) => {
    if (
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'Left' ||
        e.key === 'ArrowLeft'
    ) {
        paddle.dx = 0;
    }
};

// On Load
update();

// Event Listeners
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));

// Keyboard
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
