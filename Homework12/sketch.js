// Player & Obstacles Game with Functions
// Week 12 Homework

// Game variables
let player;
let obstacles = [];
let exit;
let gameWon = false;
let borderThickness = 10;

// Player variables
let playerSize = 30;
let playerSpeed = 5;

// Obstacle variables
let obstacleCount = 4;
let obstacleColors = ['#FF5252', '#FFAB40', '#7C4DFF', '#18FFFF'];
let obstacleSizes = [20, 35, 25, 40];
let obstacleSpeeds = [2, 3, 1, 4];

function setup() {
  // Create canvas
  createCanvas(600, 400);
  
  // Initialize game elements
  createPlayer();
  createObstacles();
  createExit();
}

function draw() {
  // This function should only contain function calls
  background(50);
  
  if (gameWon) {
    displayWinMessage();
    return;
  }
  
  drawBorders();
  movePlayer();
  drawPlayer();
  
  // Process all obstacles
  for (let i = 0; i < obstacles.length; i++) {
    moveObstacle(i);
    drawObstacle(i);
  }
  
  drawExit();
  checkWinCondition();
}

// PLAYER FUNCTIONS

// Function to create a player (requirement: function to create a player)
function createPlayer() {
  player = {
    x: width / 2,
    y: height / 2,
    size: playerSize,
    color: '#4CAF50' // Green player
  };
}

// Function to draw the player
function drawPlayer() {
  fill(player.color);
  rect(player.x, player.y, player.size, player.size);
}

// Function to move the player using keyboard (requirement: function to move player using keyboard)
function movePlayer() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // Left arrow or A
    player.x -= playerSpeed;
  } 
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // Right arrow or D
    player.x += playerSpeed;
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // Up arrow or W
    player.y -= playerSpeed;
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // Down arrow or S
    player.y += playerSpeed;
  }
  
  // Keep player within canvas bounds 
  if (player.x < borderThickness || player.x > width - player.size - borderThickness) {
    player.x = constrain(player.x, borderThickness, width - player.size - borderThickness);
  }
  
  if (player.y < borderThickness || player.y > height - player.size - borderThickness) {
    player.y = constrain(player.y, borderThickness, height - player.size - borderThickness);
  }
}

// OBSTACLE FUNCTIONS

// Function to create multiple obstacles (requirement: function to create multiple obstacles)
function createObstacles() {
  obstacles = []; // Clear any existing obstacles
  
  for (let i = 0; i < obstacleCount; i++) {
    obstacles.push({
      x: random(borderThickness + obstacleSizes[i]/2, 
                width - borderThickness - obstacleSizes[i]/2),
      y: random(borderThickness + obstacleSizes[i]/2, 
                height - borderThickness - obstacleSizes[i]/2),
      size: obstacleSizes[i],
      color: obstacleColors[i],
      speedX: random(-obstacleSpeeds[i], obstacleSpeeds[i]),
      speedY: random(-obstacleSpeeds[i], obstacleSpeeds[i])
    });
  }
}

// Function to draw an obstacle
function drawObstacle(index) {
  fill(obstacles[index].color);
  ellipse(obstacles[index].x, obstacles[index].y, obstacles[index].size);
}

// Function to move obstacle randomly (requirement: different functions to move each obstacle)
function moveObstacle(index) {
  // Move the obstacle
  obstacles[index].x += obstacles[index].speedX;
  obstacles[index].y += obstacles[index].speedY;
  
  // Make obstacles reappear on the other side if they leave the screen
  // (requirement: reappear on the other side)
  if (obstacles[index].x < -obstacles[index].size/2) {
    obstacles[index].x = width + obstacles[index].size/2;
  } else if (obstacles[index].x > width + obstacles[index].size/2) {
    obstacles[index].x = -obstacles[index].size/2;
  }
  
  if (obstacles[index].y < -obstacles[index].size/2) {
    obstacles[index].y = height + obstacles[index].size/2;
  } else if (obstacles[index].y > height + obstacles[index].size/2) {
    obstacles[index].y = -obstacles[index].size/2;
  }
}

// Function to create a new obstacle when mouse is pressed 
// (requirement: function to draw an object when pressing the mouse)
function createClickObstacle(x, y) {
  obstacles.push({
    x: x,
    y: y,
    size: random(15, 45),
    color: color(random(255), random(255), random(255)),
    speedX: 0, // Non-moving
    speedY: 0  // Non-moving
  });
}

// BORDER AND EXIT FUNCTIONS

// Function to create borders (requirement: function to create borders)
function drawBorders() {
  fill(100); // Gray borders
  // Top border
  rect(0, 0, width, borderThickness);
  // Bottom border
  rect(0, height - borderThickness, width, borderThickness);
  // Left border
  rect(0, 0, borderThickness, height);
  // Right border
  rect(width - borderThickness, 0, borderThickness, height);
}

// Function to create exit point (requirement: function to create an exit point)
function createExit() {
  exit = {
    x: width - borderThickness - 50,
    y: height - borderThickness - 50,
    size: 40,
    color: '#FFC107' // Yellow exit
  };
}

// Function to draw the exit
function drawExit() {
  fill(exit.color);
  rect(exit.x, exit.y, exit.size, exit.size);
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("EXIT", exit.x + exit.size/2, exit.y + exit.size/2);
}

// GAME LOGIC FUNCTIONS

// Function to check win condition
function checkWinCondition() {
  // Check if player overlaps with exit
  if (player.x + player.size > exit.x && 
      player.x < exit.x + exit.size && 
      player.y + player.size > exit.y && 
      player.y < exit.y + exit.size) {
    gameWon = true;
  } 
}

// Function to display "You Win" message (requirement: function to display "You Win" message)
function displayWinMessage() {
  background('#4CAF50'); // Green background for win screen
  fill(255);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("YOU WIN!", width/2, height/2);
  
  textSize(20);
  text("Click to play again", width/2, height/2 + 50);
  
  // If mouse is clicked, restart the game
  if (mouseIsPressed) {
    gameWon = false;
    setup();
  }
}

// Mouse interaction
function mousePressed() {
  if (!gameWon && 
      mouseX > borderThickness && mouseX < width - borderThickness &&
      mouseY > borderThickness && mouseY < height - borderThickness) {
    createClickObstacle(mouseX, mouseY);
  }
}