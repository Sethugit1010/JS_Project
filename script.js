const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOver");

let playerY = 200;
let score = 0;
let gameRunning = true;

let arrowSpeed = 6;
const playerSpeed = 12;

const keys = {};


/* KEYBOARD CONTROLS */

window.addEventListener("keydown", function(event) {

    keys[event.key] = true;

    if (!gameRunning && (event.key === "r" || event.key === "R")) {
        location.reload();
    }

});


window.addEventListener("keyup", function(event) {

    keys[event.key] = false;

});


/* PLAYER MOVEMENT */

function movePlayer() {

    if (!gameRunning) {
        return;
    }

    // Move Up
    if (keys["ArrowUp"]) {
        playerY -= playerSpeed;
    }

    // Move Down
    if (keys["ArrowDown"]) {
        playerY += playerSpeed;
    }

    // Stop player from leaving the top
    if (playerY < 0) {
        playerY = 0;
    }

    // Stop player from leaving the bottom
    if (playerY > game.clientHeight - player.offsetHeight) {
        playerY = game.clientHeight - player.offsetHeight;
    }

    player.style.top = playerY + "px";

    requestAnimationFrame(movePlayer);
}

movePlayer();


/* CREATE ARROW */

function createArrow() {

    if (!gameRunning) {
        return;
    }

    const arrow = document.createElement("div");

    arrow.classList.add("arrow");

    // Random vertical position
    const randomY =
        Math.floor(Math.random() * (game.clientHeight - 30));

    let arrowX = game.clientWidth;

    arrow.style.left = arrowX + "px";
    arrow.style.top = randomY + "px";

    game.appendChild(arrow);


    /* MOVE ARROW */

    const arrowMovement = setInterval(function() {

        if (!gameRunning) {

            clearInterval(arrowMovement);

            arrow.remove();

            return;
        }

        // Move arrow from right to left
        arrowX -= arrowSpeed;

        arrow.style.left = arrowX + "px";


        /* COLLISION DETECTION */

        const playerPosition =
            player.getBoundingClientRect();

        const arrowPosition =
            arrow.getBoundingClientRect();


        if (
            playerPosition.left < arrowPosition.right &&
            playerPosition.right > arrowPosition.left &&
            playerPosition.top < arrowPosition.bottom &&
            playerPosition.bottom > arrowPosition.top
        ) {

            gameRunning = false;

            gameOverScreen.style.display = "flex";

            clearInterval(arrowMovement);

            return;
        }


        /* ARROW PASSED */

        if (arrowX < -80) {

            score++;

            scoreText.textContent =
                "Score: " + score;

            clearInterval(arrowMovement);

            arrow.remove();


            // Increase arrow speed every 5 points
            if (score % 5 === 0) {
                arrowSpeed++;
            }
        }

    }, 20);
}


/* RANDOM ARROW GENERATION */

function spawnArrow() {

    if (!gameRunning) {
        return;
    }

    createArrow();

    const nextArrowTime =
        Math.random() * 900 + 400;

    setTimeout(spawnArrow, nextArrowTime);
}

spawnArrow();