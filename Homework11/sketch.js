// Game variables
let player;
let obstacles = [];
let exit;
let gameWon = false;

// Player variables
let playerSize = 30;
let playerSpeed = 5;

// Obstacle variables
let obstacleCount = 4; // Start with 4 obstacles
let obstacleColors = ['#FF5252', '#FFAB40', '#7C4DFF', '#18FFFF'];
let obstacleSizes = [20, 35, 25, 40];
let obstacleSpeeds = [2, 3, 1, 4];

function setup() {
  // Create canvas (requirement: create a canvas)
  createCanvas(600, 400);
  
  // Create player (requirement: create a player)
  player = {
    x: width / 2,
    y: height / 2,
    size: playerSize,
    color: '#4CAF50' // Green player
  };
  
  // Create obstacles (requirement: place multiple obstacles)
  for (let i = 0; i < obstacleCount; i++) {
    obstacles.push({
      x: random(width),
      y: random(height),
      size: obstacleSizes[i],
      color: obstacleColors[i],
      speedX: random(-obstacleSpeeds[i], obstacleSpeeds[i]),
      speedY: random(-obstacleSpeeds[i], obstacleSpeeds[i])
    });
  }
  
  // Create exit (requirement: create a visible exit)
  exit = {
    x: width - 50,
    y: height - 50,
    size: 40,
    color: '#FFC107' // Yellow exit
  };
}

function draw() {
  background(50); // Dark background
  
  // If the game is won, show the win message
  if (gameWon) {
    displayWinMessage();
    return; // Exit the draw function early
  }
  
  // Move player with keyboard (requirement: move player using keyboard)
  movePlayer();
  
  // Draw player
  fill(player.color);
  rect(player.x, player.y, player.size, player.size);
  
  // Process and draw obstacles
  for (let i = 0; i < obstacles.length; i++) {
    // Move obstacles randomly (requirement: move obstacles randomly)
    moveObstacle(obstacles[i]);
    
    // Draw obstacles
    fill(obstacles[i].color);
    ellipse(obstacles[i].x, obstacles[i].y, obstacles[i].size);
  }
  
  // Draw exit
  fill(exit.color);
  rect(exit.x, exit.y, exit.size, exit.size);
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("EXIT", exit.x + exit.size/2, exit.y + exit.size/2);
  
  // Check for win condition (requirement: if player reaches exit, display win message)
  checkWinCondition();
}

function movePlayer() {
  // Using if statements for player movement (requirement: use if/else statements)
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
  
  // Keep player within canvas bounds using logical operators (requirement: use logical operators)
  if (player.x < 0 || player.x > width - player.size) {
    player.x = constrain(player.x, 0, width - player.size);
  }
  
  if (player.y < 0 || player.y > height - player.size) {
    player.y = constrain(player.y, 0, height - player.size);
  }
}

function moveObstacle(obstacle) {
  // Move the obstacle
  obstacle.x += obstacle.speedX;
  obstacle.y += obstacle.speedY;
  
  // If obstacle leaves the screen, make it reappear on the opposite side
  // (requirement: if obstacles leave screen, reappear on opposite side)
  if (obstacle.x < -obstacle.size) {
    obstacle.x = width + obstacle.size;
  } else if (obstacle.x > width + obstacle.size) {
    obstacle.x = -obstacle.size;
  }
  
  if (obstacle.y < -obstacle.size) {
    obstacle.y = height + obstacle.size;
  } else if (obstacle.y > height + obstacle.size) {
    obstacle.y = -obstacle.size;
  }
}

function checkWinCondition() {
  // Using if/else if structure (requirement: use if/else if statements)
  // Check if player overlaps with exit
  if (player.x + player.size > exit.x && 
      player.x < exit.x + exit.size && 
      player.y + player.size > exit.y && 
      player.y < exit.y + exit.size) {
    gameWon = true;
  } 
  // No collisions with obstacles as per requirements: "Ignore all collisions for now"
}

function displayWinMessage() {
  // Display win message (requirement: display "You Win" message)
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

function mousePressed() {
  // Add a new non-moving obstacle when mouse is clicked
  // (requirement: clicking mouse adds new, non-moving obstacle)
  if (!gameWon) { // Only add obstacles if game is not won
    obstacles.push({
      x: mouseX,
      y: mouseY,
      size: random(15, 45),
      color: color(random(255), random(255), random(255)),
      speedX: 0, // Non-moving
      speedY: 0  // Non-moving
    });
  }
}