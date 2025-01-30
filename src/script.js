class Ball {

    constructor (x, y, radius, speedX, speedY) {
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
    constructor (x, y, width, height, speed) {
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

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const ball = new Ball(200, 200, 10, 2, 2);
const paddle = new Paddle(200, canvas.height-20, 70, 10, 5);



function gameLoop() {
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ball.update();
    ball.draw(context);
    paddle.draw(context);
    requestAnimationFrame(gameLoop);
}

gameLoop();