// Animated Self-Portrait in p5.js

// Variables for animation
// X-axis movement speeds
let leftEyeXSpeed;
let rightEyeXSpeed;
let hatXSpeed;
let noseXSpeed;

// Y-axis movement speeds
let mouthYSpeed;
let leftEyeYSpeed;
let rightEyeYSpeed;
let noseYSpeed;

// Diagonal movement (both X and Y)
let billXSpeed;
let billYSpeed;

// Variables to track positions
let leftEyeX, leftEyeY;
let rightEyeX, rightEyeY;
let noseX, noseY;
let hatOffset = 0;
let mouthY = 0;
let billOffset = {x: 0, y: 0};

// Variables for title animation
let titleSize = 20;
let titleGrowing = true;
let titleCount = 0;

// Variables for extra credit
let headSize = 150;
let headSizeDirection = 1;
let nameX = 350;
let nameY = 350;
let squareStep = 0;
let wallHit = false;
let eyeColor, shirtColor, jeansColor, hatColor;

function setup() {
  // Create a canvas 400x400 pixels
  createCanvas(400, 400);
  
  // Set initial positions
  leftEyeX = 170;
  leftEyeY = 180;
  rightEyeX = 230;
  rightEyeY = 180;
  noseX = 200;
  noseY = 200;
  
  // Set different random speeds for each shape
  // X-axis movements (at least 2 shapes)
  leftEyeXSpeed = random(0.3, 0.8);
  rightEyeXSpeed = random(0.4, 0.9); // Different from left eye
  hatXSpeed = random(0.2, 0.5);
  noseXSpeed = random(0.1, 0.4);
  
  // Y-axis movements (at least 2 shapes)
  mouthYSpeed = random(0.3, 0.7);
  leftEyeYSpeed = random(0.2, 0.6);
  rightEyeYSpeed = random(0.3, 0.7); // Different from left eye
  noseYSpeed = random(0.1, 0.5);
  
  // Diagonal movement (at least 1 shape)
  billXSpeed = random(0.2, 0.6);
  billYSpeed = random(0.2, 0.6);
  
  // Set initial colors
  eyeColor = color(30, 100, 200); // Blue eyes
  shirtColor = color(80, 80, 80); // Dark gray t-shirt
  jeansColor = color(70, 90, 140); // Blue jeans
  hatColor = color(0, 51, 160); // KC blue
}

function draw() {
  // Set the background color to light blue
  background(220, 230, 240);
  
  // Define colors
  let skinColor = color(245, 222, 179);
  let hairColor = color(180, 150, 100); // Darker dirty blonde color
  
  // Title animation: larger five times and then smaller five times
  if (titleGrowing) {
    titleSize += 0.2;
    if (titleSize >= 30) {
      titleCount++;
      if (titleCount >= 5) { // After growing 5 times
        titleGrowing = false;
        titleCount = 0;
      }
    }
  } else {
    titleSize -= 0.2;
    if (titleSize <= 20) {
      titleCount++;
      if (titleCount >= 5) { // After shrinking 5 times
        titleGrowing = true;
        titleCount = 0;
      }
    }
  }
  
  // Title your portrait at the top (with animation)
  fill(0);
  textSize(titleSize);
  textAlign(CENTER);
  text("My Self Portrait", width/2, 30);
  
  // Draw the neck
  fill(skinColor);
  rect(175, 250, 50, 40);
  
  // Draw the face (circle with animated size)
  fill(skinColor);
  
  // Extra credit: animate head size
  headSize += 0.1 * headSizeDirection;
  if (headSize > 160 || headSize < 140) {
    headSizeDirection *= -1;
  }
  
  circle(200, 200, headSize);
  
  // Draw the KC baseball hat - with x-axis movement
  fill(hatColor);
  
  // Update hat position (X-axis movement #1)
  hatOffset += hatXSpeed;
  if (hatOffset > 15 || hatOffset < -15) {
    hatXSpeed *= -1;
    // Extra credit: change hat color when hitting a wall
    if (wallHit) {
      hatColor = color(random(100), random(100), random(200));
    }
  }
  
  // Hat crown - more dimensional with proper curve (narrower) and moving
  beginShape();
  vertex(145 + hatOffset, 135); 
  bezierVertex(155 + hatOffset, 105, 245 + hatOffset, 105, 255 + hatOffset, 135);
  vertex(255 + hatOffset, 145); 
  vertex(145 + hatOffset, 145); 
  endShape(CLOSE);
  
  // Update bill position (diagonal movement)
  billOffset.x += billXSpeed;
  billOffset.y += billYSpeed;
  
  if (billOffset.x > 10 || billOffset.x < -10) {
    billXSpeed *= -1;
    wallHit = true;
  } else {
    wallHit = false;
  }
  
  if (billOffset.y > 10 || billOffset.y < -10) {
    billYSpeed *= -1;
    wallHit = true;
  } else {
    wallHit = false;
  }
  
  // Hat bill - with diagonal movement
  beginShape();
  vertex(145 + hatOffset, 140); 
  vertex(125 + hatOffset + billOffset.x, 145 + billOffset.y); 
  bezierVertex(125 + hatOffset + billOffset.x, 155 + billOffset.y, 
               190 + hatOffset + billOffset.x, 160 + billOffset.y, 
               190 + hatOffset, 145); 
  vertex(205 + hatOffset, 145); 
  vertex(145 + hatOffset, 140); 
  endShape();
  
  // Hat seams - to add dimension
  stroke(0, 25, 90);
  strokeWeight(1);
  line(200 + hatOffset, 105, 200 + hatOffset, 135); 
  line(170 + hatOffset, 115, 170 + hatOffset, 140); 
  line(230 + hatOffset, 115, 230 + hatOffset, 140);
  
  // "KC" text on hat
  noStroke();
  fill(255);
  textSize(18);
  textAlign(CENTER);
  text("KC", 170 + hatOffset, 138);
  
  // Update left eye position (X-axis movement #2, Y-axis movement #1)
  leftEyeX += leftEyeXSpeed;
  leftEyeY += leftEyeYSpeed;
  
  // Check boundaries for left eye
  if (leftEyeX < 160 || leftEyeX > 180) {
    leftEyeXSpeed *= -1;
    // Extra credit: change eye color when hitting wall
    if (wallHit) {
      eyeColor = color(random(100), random(150), 255);
    }
  }
  
  if (leftEyeY < 170 || leftEyeY > 190) {
    leftEyeYSpeed *= -1;
    wallHit = true;
  } else {
    wallHit = false;
  }
  
  // Update right eye position (X-axis movement #3, Y-axis movement #2)
  // Using different speeds from left eye
  rightEyeX += rightEyeXSpeed;
  rightEyeY += rightEyeYSpeed;
  
  // Check boundaries for right eye
  if (rightEyeX < 220 || rightEyeX > 240) {
    rightEyeXSpeed *= -1;
  }
  
  if (rightEyeY < 170 || rightEyeY > 190) {
    rightEyeYSpeed *= -1;
  }
  
  // Draw the eyes (ellipses) with movement
  fill(255);
  ellipse(leftEyeX, leftEyeY, 30, 20);
  ellipse(rightEyeX, rightEyeY, 30, 20);
  
  // Draw the pupils (circles) - blue eyes
  fill(eyeColor);
  circle(leftEyeX, leftEyeY, 15);
  circle(rightEyeX, rightEyeY, 15);
  
  // Add light reflection in eyes
  fill(255);
  circle(leftEyeX + 3, leftEyeY - 3, 5);
  circle(rightEyeX + 3, rightEyeY - 3, 5);
  
  // Update nose position (X-axis movement #4, Y-axis movement #3)
  noseX += noseXSpeed;
  noseY += noseYSpeed;
  
  // Check boundaries for nose
  if (noseX < 190 || noseX > 210) {
    noseXSpeed *= -1;
  }
  
  if (noseY < 190 || noseY > 210) {
    noseYSpeed *= -1;
  }
  
  // Draw the nose with movement
  noStroke();
  fill(skinColor);
  
  // Upper nose bridge
  beginShape();
  vertex(noseX - 5, 180);
  vertex(noseX + 5, 180);
  vertex(noseX + 5, 200);
  vertex(noseX - 5, 200);
  endShape(CLOSE);
  
  // Nose tip (triangle)
  triangle(noseX - 10, 200, noseX, 215, noseX + 10, 200);
  
  // Add some shading for the nose
  stroke(200, 150, 130);
  line(noseX - 5, 205, noseX + 5, 205);
  noStroke();
  
  // Update mouth position (Y-axis movement #4)
  mouthY += mouthYSpeed;
  if (mouthY > 10 || mouthY < -10) {
    mouthYSpeed *= -1;
    // Extra credit: change shirt color when mouth hits wall
    if (wallHit) {
      shirtColor = color(random(100), random(100), random(100));
    }
  }
  
  // Draw the mouth (rectangle with curved ends) with movement
  fill(255, 150, 150);
  noStroke();
  rect(175, 230 + mouthY, 50, 10, 5);
  
  // Draw full beard with darker dirty blonde color
  // Beard should not cover the mouth and match face edges exactly
  fill(hairColor);
  
  // Left side of beard - match face edge exactly
  beginShape();
  vertex(125, 175); // Start at face edge
  vertex(125, 200); // Follow face edge
  vertex(125, 225); // Continue along face
  vertex(135, 250); // Curve inward toward chin
  vertex(175, 250 + mouthY); // Connect to below mouth (follows mouth)
  vertex(175, 240 + mouthY); // Side of mouth (follows mouth)
  endShape(CLOSE);
  
  // Right side of beard - match face edge exactly
  beginShape();
  vertex(275, 175); // Start at face edge
  vertex(275, 200); // Follow face edge
  vertex(275, 225); // Continue along face
  vertex(265, 250); // Curve inward toward chin
  vertex(225, 250 + mouthY); // Connect to below mouth (follows mouth)
  vertex(225, 240 + mouthY); // Side of mouth (follows mouth)
  endShape(CLOSE);
  
  // Bottom of beard (chin area)
  beginShape();
  vertex(175, 250 + mouthY); // Left side of chin (follows mouth)
  bezierVertex(185, 270 + mouthY, 215, 270 + mouthY, 225, 250 + mouthY); // Chin curve
  endShape(CLOSE);
  
  // Mustache part (above mouth)
  beginShape();
  vertex(170, 225 + mouthY); // Left edge (follows mouth)
  bezierVertex(175, 215 + mouthY, 190, 220 + mouthY, 200, 220 + mouthY); // Left curve
  bezierVertex(210, 220 + mouthY, 225, 215 + mouthY, 230, 225 + mouthY); // Right curve
  endShape();
  
  // Draw the arms
  fill(skinColor);
  // Left arm
  beginShape();
  vertex(150, 290); // Top shoulder
  vertex(120, 330); // Outer elbow
  vertex(110, 380); // Hand
  vertex(130, 380); // Inner wrist
  vertex(140, 340); // Inner elbow
  vertex(150, 320); // Armpit
  endShape(CLOSE);
  
  // Right arm
  beginShape();
  vertex(250, 290); // Top shoulder
  vertex(280, 330); // Outer elbow
  vertex(290, 380); // Hand
  vertex(270, 380); // Inner wrist
  vertex(260, 340); // Inner elbow
  vertex(250, 320); // Armpit
  endShape(CLOSE);
  
  // Draw the t-shirt 
  fill(shirtColor);
  // T-shirt body
  beginShape();
  vertex(150, 290); // Left shoulder
  vertex(150, 360); // Left bottom
  vertex(250, 360); // Right bottom
  vertex(250, 290); // Right shoulder
  endShape(CLOSE);
  
  // T-shirt sleeve details
  // Left sleeve
  beginShape();
  vertex(150, 290); // Shoulder connection
  vertex(130, 300); // Outer sleeve
  vertex(140, 320); // Bottom sleeve
  vertex(150, 320); // Armpit
  endShape(CLOSE);
  
  // Right sleeve
  beginShape();
  vertex(250, 290); // Shoulder connection
  vertex(270, 300); // Outer sleeve
  vertex(260, 320); // Bottom sleeve
  vertex(250, 320); // Armpit
  endShape(CLOSE);
  
  // Draw jeans
  fill(jeansColor);
  // Jeans - more shaped
  beginShape();
  vertex(150, 360); // Top left
  vertex(140, 400); // Bottom left
  vertex(170, 400); // Inner left leg
  vertex(230, 400); // Inner right leg
  vertex(260, 400); // Bottom right
  vertex(250, 360); // Top right
  endShape(CLOSE);
  
  // Jeans details
  stroke(50, 70, 120);
  strokeWeight(1);
  line(200, 360, 200, 400); // Center seam
  line(160, 380, 160, 400); // Left detail
  line(240, 380, 240, 400); // Right detail
  noStroke();
  
  // Extra credit: Make name text move in a square pattern
  updateNamePosition();
  
  // Sign your portrait with your name
  fill(0);
  textSize(12);
  textAlign(CENTER);
  text("Charlie", nameX, nameY);
}

// Function to move name in a square pattern (extra credit)
function updateNamePosition() {
  // Square movement logic
  if (squareStep === 0) {
    // Move right
    nameX += 0.5;
    if (nameX >= 380) {
      squareStep = 1;
    }
  } else if (squareStep === 1) {
    // Move down
    nameY += 0.5;
    if (nameY >= 380) {
      squareStep = 2;
    }
  } else if (squareStep === 2) {
    // Move left
    nameX -= 0.5;
    if (nameX <= 320) {
      squareStep = 3;
    }
  } else if (squareStep === 3) {
    // Move up
    nameY -= 0.5;
    if (nameY <= 350) {
      squareStep = 0;
    }
  }
}