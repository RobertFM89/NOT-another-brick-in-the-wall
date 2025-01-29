class Game {
    constructor () {
        this.introScreen = document.getElementById('game-intro');
        this.gameScreen = document.getElementById('game-screen');
        this.gameEndScreen = document.getElementById('game-end');
        this.player = null;
        this.height = 600;
        this.width = 900;
        this.drugs = [];
        this.score = 0;
        this.lives = 3;
        this.gameIsOver = false;
        this.gameIntervalId;
        this.gameLoopFrec = Math.round(1000 / 60);
    
    }

    start() {
        this.gameScreen.style.display = 'block';
        this.introScreen.style.display = 'none';
        this.gameScreen.style.height = this.height + 'px';
        this.gameScreen.style.width = this.width + 'px';
        this.gameIntervalId = setInterval(() => {
            this.gameLoop();
        }, this.gameLoopFrec);
    }

    gameLoop() {
        this.update();

        if (this.gameIsOver) {
            clearInterval(this.gameIntervalId);
           // this.endGame();
        }
    }


}