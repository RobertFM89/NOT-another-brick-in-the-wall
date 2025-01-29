const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const gameScreen = document.getElementById('game-screen');
const ctx = gameScreen.getContext('2d');

//create ball props
const ball = {
    x: gameScreen.width / 2,
    y: gameScreen.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4
};

//draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
}

drawBall();


rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));