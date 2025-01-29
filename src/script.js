window.onload = () => {
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    let game;

    startButton.onclick = () => {
        game = new Game();
        game.start();
    };
    
};