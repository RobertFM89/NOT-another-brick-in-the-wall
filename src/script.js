let score = 0;
class Ball {
  constructor(x, y, radius, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = "purple";
    context.fill();
    context.closePath();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

class Paddle {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }

  draw(context) {
    context.fillStyle = "blue";
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  move(direction) {
    this.x += this.speed * direction;
  }
}

class Brick {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.status = 1;
  }

  draw(context) {
    if (this.status === 1) {
      context.fillStyle = "red";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const ball = new Ball(200, 200, 5, 2, -2);
const paddle = new Paddle(200, canvas.height - 15, 70, 10, 10);
const bricks = [];
function createBrickWall() {
  const brickRowCount = 4;
  const brickColumnCount = 8;
  const brickWidth = 50;
  const brickHeight = 20;
  const brickPadding = 10;

  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      const brick = new Brick(
        i * (brickWidth + brickPadding),
        j * (brickHeight + brickPadding),
        brickWidth,
        brickHeight
      );
      bricks.push(brick);
    }
  }
}

//draw bricks
function drawBricks() {
  bricks.forEach((brick) => {
    if (brick.status === 1) {
      brick.draw(context);
      //check collision with ball
      if (
        ball.x > brick.x &&
        ball.x < brick.x + brick.width &&
        ball.y > brick.y &&
        ball.y < brick.y + brick.height
      ) {
        ball.speedY = -ball.speedY;
        brick.status = 0;
        score++;
        document.getElementById("score").innerText = `Score: ${score}`;
            
      }
    }
  });
}


document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    paddle.move(-1);
  } else if (event.key === "ArrowRight") {
    paddle.move(1);
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    paddle.move(0);
  }
});

createBrickWall();

function resetGame() {
    ball.x = 200;
    ball.y = 200;
    ball.speedX = 2;
    ball.speedY = -2;
    paddle.x = 200;
    bricks.forEach((brick) => (brick.status = 1));
    score = 0;
    }

function gameLoop() {
  //clear canvas
  context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  //ball update and draw
  ball.update();
  ball.draw(context);

  //ball collision
  //sides
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.speedX = -ball.speedX;
  }
  //top
  if (ball.y - ball.radius < 0) {
    ball.speedY = -ball.speedY;
  }

  //paddle collision
  if (
    ball.y + ball.radius > paddle.y &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    ball.speedY = -ball.speedY;
  }

  if (ball.y + ball.radius > canvas.height) {
    alert("Game Over");
    resetGame();
  }

  if (bricks.every((brick) => brick.status === 0)) {
    alert("You Win!");
    resetGame();
}

  //paddle draw
  paddle.draw(context);

  //bricks draw
  drawBricks();

  //loop
  requestAnimationFrame(gameLoop);
}

gameLoop();
