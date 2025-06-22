const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let lives = 3;

const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 10,
    dx: 4,
    dy: -4
};

const paddle = {
    height: 15,
    width: 100,
    x: (canvas.width - 100) / 2,
};

let rightPressed = false;
let leftPressed = false;

const brick = {
    rowCount: 5,
    columnCount: 9,
    width: 75,
    height: 20,
    padding: 10,
    offsetTop: 40,
    offsetLeft: 30
};

let powerUps = [];

let bricks = [];
for (let c = 0; c < brick.columnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brick.rowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

function collisionDetection() {
    for (let c = 0; c < brick.columnCount; c++) {
        for (let r = 0; r < brick.rowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (ball.x > b.x && ball.x < b.x + brick.width && ball.y > b.y && ball.y < b.y + brick.height) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    score++;

                    if (Math.random() > 0.7) { 
                        powerUps.push({
                            x: b.x + brick.width / 2,
                            y: b.y,
                            width: 20,
                            height: 20,
                            type: 'widerPaddle'
                        });
                    }

                    if (score === brick.rowCount * brick.columnCount) {
                        alert("¡GANASTE, FELICIDADES!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#FF00FF";
    ctx.shadowColor = '#FF00FF';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    ctx.fillStyle = "#00FFFF";
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
}

function drawBricks() {
    const brickColors = ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff"];
    for (let c = 0; c < brick.columnCount; c++) {
        for (let r = 0; r < brick.rowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = (c * (brick.width + brick.padding)) + brick.offsetLeft;
                let brickY = (r * (brick.height + brick.padding)) + brick.offsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brick.width, brick.height);
                const color = brickColors[r % brickColors.length];
                ctx.fillStyle = color;
                ctx.shadowColor = color;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
    ctx.shadowBlur = 0;
}

function drawScore() {
    ctx.font = "16px 'Courier New'";
    ctx.fillStyle = "#eee";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px 'Courier New'";
    ctx.fillStyle = "#eee";
    ctx.fillText("Lives: " + lives, canvas.width - 80, 20);
}

function drawPowerUps() {
    for (let i = 0; i < powerUps.length; i++) {
        let pu = powerUps[i];
        pu.y += 2;

        ctx.beginPath();
        ctx.rect(pu.x, pu.y, pu.width, pu.height);
        ctx.fillStyle = "#FFFF00"; 
        ctx.shadowColor = "#FFFF00";
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.closePath();
    }
    ctx.shadowBlur = 0;
}

function updateGameLogic() {
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) ball.dx = -ball.dx;
    if (ball.y + ball.dy < ball.radius) ball.dy = -ball.dy;
    else if (ball.y + ball.dy > canvas.height - ball.radius) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) ball.dy = -ball.dy;
        else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                ball.x = canvas.width / 2; ball.y = canvas.height - 30; paddle.x = (canvas.width - paddle.width) / 2;
            }
        }
    }

    if (rightPressed && paddle.x < canvas.width - paddle.width) paddle.x += 7;
    else if (leftPressed && paddle.x > 0) paddle.x -= 7;

    ball.x += ball.dx;
    ball.y += ball.dy;

    for (let i = powerUps.length - 1; i >= 0; i--) {
        let pu = powerUps[i];
        if (pu.x > paddle.x && pu.x < paddle.x + paddle.width && pu.y > canvas.height - paddle.height && pu.y < canvas.height) {
            if (pu.type === 'widerPaddle') {
                paddle.width = 150;
                setTimeout(() => {
                    paddle.width = 100; 
                }, 10000);
            }
            powerUps.splice(i, 1); 
        }
        if (pu.y > canvas.height) {
            powerUps.splice(i, 1);
        }
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    drawScore();
    drawLives();
    drawPowerUps();
    drawBall();
    
    collisionDetection();
    updateGameLogic();

    requestAnimationFrame(drawGame);
}

drawGame();