class Game {
  constructor() {
    this.startScreen = document.getElementById("game-intro");
    this.canvas = document.getElementById("canvas");
    this.gameOverScreen = document.getElementById("game-over");
    this.finalScoreElement = document.getElementById("final-score");
    this.ctx = this.canvas.getContext("2d");
    this.score = 0;
    this.lives = 3;
    this.level= 1;

    this.paddle = new Paddle(this.canvas);
    this.ball = new Ball(this.canvas);
    this.brickManager = new BrickManager(this.canvas);

    this.rulesBtn = document.getElementById("rules-btn");
    this.closeBtn = document.getElementById("close-btn");
    this.rules = document.getElementById("rules");

    this.initEvents();
    this.update();
  }

  start() {
    this.canvas.style.height = 600;
    this.canvas.style.width = 800;
    this.startScreen.style.display = "none";
    this.canvas.style.display = "block";
  }

  initEvents() {
    document.addEventListener("keydown", (e) => this.paddle.keyDown(e));
    document.addEventListener("keyup", (e) => this.paddle.keyUp(e));

    this.rulesBtn.addEventListener("click", () =>
      this.rules.classList.add("show")
    );
    this.closeBtn.addEventListener("click", () =>
      this.rules.classList.remove("show")
    );
  }

  increaseScore() {
    this.score++;
    if (this.allBricksBroken()) {
      this.levelUp();
    }
  }

  drawScore() {
    this.ctx.font = "20px Arial";
    this.ctx.fillText(`Score: ${this.score}`, this.canvas.width - 90, 15);
  }

  drawLives() {
    this.ctx.font = "15px Arial";
    this.ctx.fillText(`Lives: ${this.lives}`, this.canvas.width - 90, 30);
  }

  drawLevel() {
    this.ctx.font = "15px Arial";
    this.ctx.fillText(`Level: ${this.level}`, this.canvas.width - 90, 45);
  }

  update() {
    this.paddle.move();
    this.ball.move(
      this.canvas,
      this.paddle,
      this.brickManager,
      () => this.increaseScore(),
      () => this.loseLife()
    );

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.paddle.draw(this.ctx);
    this.ball.draw(this.ctx);
    this.brickManager.draw(this.ctx);
    this.drawScore();
    this.drawLives();
    this.drawLevel();

    requestAnimationFrame(() => this.update());
  }

  loseLife() {
    this.lives--;
    if (this.lives === 0) {
      this.gameOver();
    } else {
      this.ball.reset();
      this.paddle.reset();
    }
  }

  gameOver() {
    //alert('Game Over');
   
    this.canvas.style.display = "none";
    this.gameOverScreen.style.display = "block";
    this.finalScoreElement.textContent = `Your Score: ${this.score}`;
  }

  allBricksBroken() {
    return this.brickManager.bricks.every((column) =>
      column.every((brick) => !brick.visible)
    );
  }

  levelUp() {
    if (this.level < 5) {
        this.level++;
        this.brickManager.columnCount++;
        this.ball.speed += 1;
        this.ball.dx = this.ball.dx > 0 ? this.ball.speed : -this.ball.speed;
        this.ball.dy = this.ball.dy > 0 ? this.ball.speed : -this.ball.speed;
        this.brickManager.createBricks();
        this.ball.reset();
        this.paddle.reset();
      } else {
        alert('You Win!');
        document.location.reload();
      }
  }
}

class Paddle {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = canvas.width / 2 - 40;
    this.y = canvas.height - 20;
    this.w = 80;
    this.h = 10;
    this.speed = 8;
    this.dx = 0;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.closePath();
  }

  move() {
    this.x += this.dx;
    if (this.x < 0) this.x = 0;
    if (this.x + this.w > this.canvas.width) this.x = this.canvas.width - this.w;
  }

  keyDown(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      this.dx = this.speed;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      this.dx = -this.speed;
    }
  }

  keyUp(e) {
    if (["Right", "ArrowRight", "Left", "ArrowLeft"].includes(e.key)) {
      this.dx = 0;
    }
  }

  reset() {
    this.x = this.canvas.width / 2 - this.w / 2;
  }
}

class Ball {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = canvas.width / 2;
    this.y = canvas.height - 25;
    this.size = 10;
    this.speed = 3;
    this.dx = 4;
    this.dy = -4;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.closePath();
  }

  move(canvas, paddle, brickManager, increaseScore, loseLife) {
    this.x += this.dx;
    this.y += this.dy;

    // Wall collision
    if (this.x + this.size > canvas.width || this.x - this.size < 0) {
      this.dx *= -1;
    }
    if (this.y - this.size < 0) {
      this.dy *= -1;
    }

    // Paddle collision
    if (
      this.x - this.size > paddle.x &&
      this.x + this.size < paddle.x + paddle.w &&
      this.y + this.size > paddle.y
    ) {
      this.dy = -this.speed;
    }

    // Brick collision
    brickManager.checkCollision(this, increaseScore);

    // Bottom wall collision (reset game)
    if (this.y + this.size > canvas.height) {
      loseLife();
    }
  }

  reset() {
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;
    this.dx = 4;
    this.dy = -4;
  }
}

class BrickManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.rowCount = 9;
    this.columnCount = 5;
    this.brickInfo = {
      w: 70,
      h: 20,
      padding: 10,
      offsetX: 45,
      offsetY: 60,
      visible: true,
    };

    this.bricks = [];
    this.createBricks();
  }

  createBricks() {
    this.bricks = [];
    for (let i = 0; i < this.rowCount; i++) {
      this.bricks[i] = [];
      for (let j = 0; j < this.columnCount; j++) {
        const x = i * (this.brickInfo.w + this.brickInfo.padding) + this.brickInfo.offsetX;
        const y = j * (this.brickInfo.h + this.brickInfo.padding) + this.brickInfo.offsetY;
        this.bricks[i][j] = { x, y, ...this.brickInfo };
      }
    }
  }

  draw(ctx) {
    this.bricks.forEach((column) =>
      column.forEach((brick) => {
        if (brick.visible) {
          ctx.beginPath();
          ctx.rect(brick.x, brick.y, brick.w, brick.h);
          ctx.fillStyle = "#0095dd";
          ctx.fill();
          ctx.closePath();
        }
      })
    );
  }

  checkCollision(ball, increaseScore) {
    this.bricks.forEach((column) =>
      column.forEach((brick) => {
        if (brick.visible) {
          if (
            ball.x - ball.size > brick.x &&
            ball.x + ball.size < brick.x + brick.w &&
            ball.y + ball.size > brick.y &&
            ball.y - ball.size < brick.y + brick.h
          ) {
            ball.dy *= -1;
            brick.visible = false;
            increaseScore();
          }
        }
      })
    );
  }

  showAllBricks() {
    this.bricks.forEach((column) =>
      column.forEach((brick) => (brick.visible = true))
    );
  }
}

// Initialize the game
new Game();
