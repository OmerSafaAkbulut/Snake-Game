const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const gameWidth = canvas.width;
const gameHeight = canvas.height;

// Game Settings
//
//  0 LEFT 1 RIGHT
//  2 UP   3 DOWN
//

const objectSize = 50;
const boardBackground = "gray";
let gameSpeed;
let score = 0;
let gameTick;
let gameRunning = false;

// Positions

let food = {
    x:0, y:0, color:"red"
}

let snake = {
    color:"green", border:"black", parts:[], direction:0, lastDirection:0
}

// Start

initializeGame();

// Functions

window.addEventListener("keydown", changeDirection);

function playGame(){
    moveSnake();
    if(checkGameOver()){
        return;
    }
    draw();

    gameTick = setTimeout(playGame, gameSpeed);
}
function checkGameOver(){
    const head = snake.parts[0]

    if(head.x < 0 || head.y < 0 || head.x > gameWidth-objectSize || head.y > gameHeight-objectSize ){
        gameOver();
        return true;
    }
    
    for (let i = 1; i < snake.parts.length; i++) {
        const element = snake.parts[i];
        if (head.x == element.x && head.y == element.y){
            gameOver();
            return true;
        }
    }

    return false;
}
function gameOver(){
    clearTimeout(gameTick);
    gameRunning = false;
    popGameOver();
}
function spawnFood(){
    let roll = true;
    do{
        randomNumberX = Math.floor(Math.random() * gameHeight / objectSize) * objectSize;
        randomNumberY = Math.floor(Math.random() * gameHeight / objectSize) * objectSize;

        roll = false;

        for (let i = 0; i < snake.parts.length; i++) {
            if (snake.parts[i].x == randomNumberX || snake.parts[i].y == randomNumberY) {
                roll = true;
                break;
            }
        }
    }while(roll)

    food.x = randomNumberX;
    food.y = randomNumberY;
}
function moveSnake(){
    let head = {x:snake.parts[0].x, y:snake.parts[0].y};

    snake.lastDirection = snake.direction;
    
    switch (snake.direction) {
        case 0:
            head.x -= objectSize;
            break;
        case 1:
            head.x += objectSize;
            break;
        case 2:
            head.y -= objectSize;
            break;
        case 3:
            head.y += objectSize;
            break;
    }

    snake.parts.unshift(head);

    if(head.x == food.x && head.y == food.y){
        score++;
        spawnFood();
        gameSpeed = 50 + 2000/(score*2 + 8);
        console.log(gameSpeed);
    }
    else snake.parts.pop();
}
function initializeGame(){
    gameSpeed = 250;
    gameRunning = true;
    score = 0;
    spawnFood();
    snake.parts = [{x: gameWidth/2, y: gameHeight/2}, {x:gameWidth/2+50, y: gameHeight/2}];
    playGame();
}
function changeDirection(event){
    const key = event.keyCode;

    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
    const SPACE = 32;
    switch (key) {
        case LEFT:
            if(snake.lastDirection != 1){
                snake.direction = 0;
            }
            break;
        case RIGHT:
            if(snake.lastDirection != 0){
                snake.direction = 1;
            }
            break;
        case UP:
            if(snake.lastDirection != 3){
                snake.direction = 2;
            }
            break;
        case DOWN:
            if(snake.lastDirection != 2){
                snake.direction = 3;
            }           
            break;
        case SPACE:
            if(!gameRunning){
                initializeGame();
            }
    }
}
function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0,0,gameWidth,gameHeight);
}
function draw(){
    clearBoard();
    // Draw Food
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, objectSize, objectSize)
    // Draw Snake
    ctx.fillStyle = snake.color;
    ctx.strokeStyle = snake.border;
    for (let i = 1; i < snake.parts.length; i++) {
        const element = snake.parts[i];
        ctx.fillRect(element.x, element.y, objectSize, objectSize);
        ctx.strokeRect(element.x, element.y, objectSize, objectSize);    
    }
    ctx.fillStyle = "lime";
    ctx.fillRect(snake.parts[0].x, snake.parts[0].y, objectSize, objectSize);
    ctx.strokeRect(snake.parts[0].x, snake.parts[0].y, objectSize, objectSize);

}
function popGameOver(){
    ctx.font = "80px monospace";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER !", gameWidth/2, gameHeight/2);
    ctx.font = "30px monospace";
    ctx.fillText("Press SPACE to Restart", gameWidth/2, gameHeight/2+objectSize);
}