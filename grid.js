//Color Sweep

var colors = ["red", "yellow", "green", "cyan", "purple", "orange", "blue", "lime"];
var cellSize = 20;
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var boardWidth, boardHeight;
var grid = [];
var oldColor, newColor, boardSize;
var sweeps = 0;
var win = false;
var maxClicks = 0;

function makeCanvas() {
    var numColors = parseInt(document.getElementById("color-options").value);
    var color_set = colors.slice(0, numColors);

    boardSize = parseInt(document.getElementById("board-size").value);
    boardWidth = cellSize * boardSize;
    boardHeight = cellSize * boardSize;

    canvas.width = boardWidth;
    canvas.height = boardHeight;
    
    //Generate the random color pixels
    //Initialize the grid
    for(let i = 0; i < boardSize; i++){
        grid[i] = [];
        for(let j = 0; j < boardSize; j++){
            let color = randomColor(color_set);
            context.fillStyle = color
            context.fillRect(j*cellSize, i*cellSize, cellSize, cellSize); // fills canvas going row by row from top to bottom
            grid[i][j] = color;
        }
    }
    sweeps = 0;
    maxClicks = Math.floor(25*((boardSize*2) * numColors)/((28) * 6));//this line of code from: https://unixpapa.com/floodit/?sz=26&nc=8
    updateScore();
}

function randomColor(color_set){
    var randomIndex = Math.floor(Math.random() * color_set.length);
    return color_set[randomIndex];
}

function handleMouseClick(event){
    var rect = canvas.getBoundingClientRect(); // (top, right, bottom, left)
    var left = rect.left + 7.5; // The left corner of the actual box grid
    var top = rect.top + 7.5; // The left corner of the actual box grid

    var mouseX = event.clientX - left;
    var mouseY = event.clientY - top;

    var cellX = Math.floor(mouseX / cellSize);
    var cellY = Math.floor(mouseY / cellSize);

    if(cellX < 0 || cellY < 0 || cellX > boardSize || cellY > boardSize){
        return;
    }
    
    oldColor = grid[0][0];
    newColor = grid[cellY][cellX]; //row, col
    if(oldColor != newColor){
        sweeps++;
        updateBoard(0, 0);
    }
}

function updateBoard(i, j){
    helper(i, j);
    function helper(i, j){
        if (i < 0 || i >= boardSize || j < 0 || j >= boardSize) {
            return;
        }
        if(grid[i][j] !== oldColor){
            return;
        }
        grid[i][j] = newColor;
        updateCanvas(i, j); 

        helper(i - 1, j);
        helper(i + 1, j);
        helper(i, j - 1);
        helper(i, j + 1);
    }
    updateScore();
}

function updateCanvas(i, j){
    setTimeout(function(){
        context.fillStyle = grid[i][j];
        context.fillRect(j*cellSize, i*cellSize, cellSize, cellSize); // fills canvas going row by row from top to bottom
    }, 150)
}

function updateScore(){
    win = (sweeps <= maxClicks);
    for(let i = 0; i < boardSize; i++){
        for(let j = 0; j < boardSize; j++){
            if(grid[i][j] != newColor){
                win = false;
                break;
            }
        }
    }
    //win condition code from: https://unixpapa.com/floodit/?sz=26&nc=8
    var scoreDisplay = sweeps + '/' + maxClicks;
    if(win){
        scoreDisplay += '<p>You Win!</p>';
    }else if (sweeps >= maxClicks){
        scoreDisplay += '<p>You Lose</p>';
    }else if (sweeps == 0){
        scoreDisplay += '<br><span style="font-size: 50%">Click cells. Fill the board with one color.</span>';
    }
    document.getElementById("score").innerHTML = scoreDisplay;
    
}

window.onload = makeCanvas();
canvas.addEventListener("click", handleMouseClick);
