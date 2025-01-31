window.onload = function () {
    const startButton = document.getElementById("start-btn");
    const restartButton = document.getElementById("restart-btn");
    let game; 

    startButton.addEventListener("click", function () {
        startGame();
    });

    restartButton.addEventListener("click", function () {
        restartGame();
    });

    function startGame() {
        document.getElementById("game-intro").style.display = "none";
        document.getElementById("game-over").style.display = "none";
        document.getElementById("canvas").style.display = "block";

        game = new Game();
        game.start(); // Llamar al método start() de la clase Game
    }

    function restartGame() {
        document.getElementById("game-over").style.display = "none";
        document.getElementById("canvas").style.display = "block";

        game = new Game();
        game.start(); // Llamar al método start() de la clase Game
    }
};