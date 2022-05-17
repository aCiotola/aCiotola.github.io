var ballX = 50; // Horizontal position of the ball.
var ballY = 50; // Vertical position of the ball.
var ballSpeedX = 10; // Horizontal speed of the ball.
var ballSpeedY = 4; // Vertical speed of the ball.
var ballSpaceFromWall = 35; // Amount of pixels the ball should be from the walls.

const PADDLE_THICKNESS = 10; // Thickness of the paddles.
const PADDLE_HEIGHT = 100; // Height of the paddles.
var leftPaddleY = 250; // Vertical position of the left paddle.
var rightPaddleY = 250; // Vertical position of the left paddle.
var fixPaddleGlitch = 35; // Stops the jerky movement of the right paddle.

var showWinScreen = false; // Show win screen if a player wins.
const WIN_SCORE = 3; // How many points a player needs to win.
var leftScore = 0; // Score of the first player.
var rightScore = 0; // Score of the second player.

var gameCanvas; // The game canvas object.
var gameCanvasContext; // The game canvas context.
var fps = 30; // Set game frames per second.

// When the page loads, start the game on page load.
window.onload = gameStart();

// Function responsible getting the canvas and starting the game.
function gameStart() {   
    gameCanvas = document.getElementById("gameCanvas");
    gameCanvasContext = gameCanvas.getContext("2d");     

    // Activate the game.
    setInterval(drawMove, 1000/fps);

    // Add events for mouse.
    gameCanvas.addEventListener("mousedown", mouseClickEvent); // Event for when mouse is clicked.
    gameCanvas.addEventListener("mousemove", mouseMoveEvent); // Event for when mouse is moved.
}

/***********************************************
 *                                             *
 * Functions for Drawing the game objects.     *
 *                                             *
 ***********************************************/

// Function responsible for drawing the game objects.
function drawGame() {
    // The background.
    colorRectangles(0,0,gameCanvas.clientWidth,gameCanvas.height,"black");

    // If someone won, show message to play the game again.
    if (showWinScreen) {
        gameCanvasContext.fillStyle = "white";
        if (leftScore >= WIN_SCORE)
            gameCanvasContext.fillText("Player 1 Wins",350, 200);
        else
            gameCanvasContext.fillText("Player 2 Wins",350, 200);
        
        gameCanvasContext.fillText("Click to continue",350, 500);
        return;
    }

    // The net.
    drawNet();

    // The left paddle.
    colorRectangles(0,leftPaddleY,PADDLE_THICKNESS,PADDLE_HEIGHT,"white"); 
    
    // The right paddle.
    colorRectangles(gameCanvas.width-PADDLE_THICKNESS,rightPaddleY,PADDLE_THICKNESS,PADDLE_HEIGHT,"white");

    // The ball.
    colorCircles(ballX,ballY,10,"red");

    // The Scoreboard.
    gameCanvasContext.fillStyle = "white";
    gameCanvasContext.fillText(leftScore, 100, 100);
    gameCanvasContext.fillText(rightScore, gameCanvas.width-100, 100);
} 

// Function responsible for moving the game objects.
function moveGame() {
    // Show win screen and stop if someone won.
    if (showWinScreen)
        return;

    // Move the computer
    computerMovement();

    // Move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Check if ball passes the left paddle.
    if (ballX < 0) {
        if (ballY > leftPaddleY && ballY < leftPaddleY + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            controlBallHitMovement(leftPaddleY);
        }
        else {
            rightScore++;
            resetBall();
        }
    }

    // Check if ball passes the right paddle.
    if (ballX > gameCanvas.width) {
        if (ballY > rightPaddleY && ballY < rightPaddleY + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            controlBallHitMovement(rightPaddleY);
        }
        else {
            leftScore++;
            resetBall();
        }
    }
         
    // Bounce off ceiling or floor.
    if (ballY > gameCanvas.height || ballY < 0)
        ballSpeedY = -ballSpeedY;  
}

// Function responsible for drawing the rectangles on the screen.
function colorRectangles(leftX, topY, width, height, color) {
    gameCanvasContext.fillStyle = color;
    gameCanvasContext.fillRect(leftX,topY,width,height);
} 

// Function responsible for drawing the circles on the screen.
function colorCircles(centerX, centerY, radius, color) {
    gameCanvasContext.fillStyle = color;
    gameCanvasContext.beginPath();
    gameCanvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true);
    gameCanvasContext.fill();
} 

// Function responsible for drawing the net in the middle with lines.
function drawNet() {
    for (var i = 5; i < gameCanvas.height; i += 40) {
        colorRectangles(gameCanvas.width/2-1,i,2,20,"white");
    }
}

/* Function responsible for both moving and drawing the game.
   Used for separation of concerns.
*/
function drawMove() {
    moveGame();
    drawGame();
}

/***********************************************
 *                                             *
 * Functions for controlling mouse movement.   *
 *                                             *
 ***********************************************/

// Find the position of the mouse.
function calculateMousePosition(evt) {
    var rect = gameCanvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;

    return { x:mouseX, y:mouseY };
}

// Event triggerred on mouse movement.
function mouseMoveEvent(evt) {
    var mousePosition = calculateMousePosition(evt);
    leftPaddleY = mousePosition.y - (PADDLE_HEIGHT/2);
}

// Event triggerred on mouse click.
function mouseClickEvent(evt) {
    if (showWinScreen) {
        showWinScreen = false; // Start game on mouse click.
        leftScore = 0;
        rightScore = 0;
    }
}

/***********************************************
 *                                             *
 * Functions for controlling game settings.    *
 *                                             *
 ***********************************************/

// Function responsible for resetting the ball to the center.
function resetBall() {
    // Check if a player won.
    if (leftScore >= WIN_SCORE || rightScore >= WIN_SCORE)
        showWinScreen = true;

    ballSpeedX = -ballSpeedX; // Go towards opposite side of loser.
    ballX = gameCanvas.width/2;
    ballY = gameCanvas.height/2;
}

// Function responsible for moving the second player.
function computerMovement() {
    // Keep center of the paddle along with the ball.
    var rightPaddleCenter = rightPaddleY + (PADDLE_HEIGHT/2);
    if (rightPaddleCenter < ballY - fixPaddleGlitch)
        rightPaddleY += 6;
    else if (rightPaddleCenter > ballY + fixPaddleGlitch)
        rightPaddleY -= 6;
}

// Function responsible for moving the ball depending on where it hits the paddle.
function controlBallHitMovement(paddle) {
    var deltaY = ballY - (paddle + PADDLE_HEIGHT/2);
    ballSpeedY = deltaY * 0.35;
}