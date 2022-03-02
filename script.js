const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rulse');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const brickRowCount = 9;
const brickColumnCount = 5;

let score = 0;

let colors = {
    brick: '#0095dd',
    ball: 'black',
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
for (let row = 0; row < brickRowCount; row++) {
    bricks[row] = [];
    for (let col = 0; col < brickColumnCount; col++) {
        const x =
            row * (brickProps.w + brickProps.padding) + brickProps.offsetX;
        const y =
            col * (brickProps.h + brickProps.padding) + brickProps.offsetY;

        bricks[row][col] = { x, y, ...brickProps };
    }
}

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
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
};

drawEverything();

// Event Listeners
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));
