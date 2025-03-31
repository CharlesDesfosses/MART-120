// Self-Portrait in p5.js
// 

function setup() {
  createCanvas(400, 400);
  background(220, 230, 240);
}

function draw() {
  // Set colors
  let skinColor = color(245, 222, 179);
  let hairColor = color(180, 150, 100); //
  let eyeColor = color(30, 100, 200); // 
  let shirtColor = color(80, 80, 80); // 
  let jeansColor = color(70, 90, 140); // 
  let hatColor = color(0, 51, 160); // 
  

  fill(0);
  textSize(20);
  textAlign(CENTER);
  text("Just A Chill Guy", width/2, 30);
  

  fill(skinColor);
  rect(175, 250, 50, 40);
  
  fill(skinColor);
  circle(200, 200, 150);
  

  fill(hatColor);
  
  beginShape();
  vertex(145, 135); //
  bezierVertex(155, 105, 245, 105, 255, 135); //
  vertex(255, 145); //
  vertex(145, 145); //
  endShape(CLOSE);
  
  beginShape();
  vertex(145, 140); //
  vertex(125, 145); //
  bezierVertex(125, 155, 190, 160, 190, 145); //
  vertex(205, 145); // 
  vertex(145, 140); // 
  endShape();
  
  stroke(0, 25, 90);
  strokeWeight(1);
  line(200, 115, 200, 135); //
  line(160, 120, 170, 140); //
  line(240, 120, 230, 140); //
  
  noStroke();
  fill(255);
  textSize(18);
  textAlign(CENTER);
  text("KC", 170, 138);
  
  fill(255);
  ellipse(170, 180, 30, 20);
  ellipse(230, 180, 30, 20);
  
  fill(eyeColor);
  circle(170, 180, 15);
  circle(230, 180, 15);
  
  fill(255);
  circle(173, 177, 5);
  circle(233, 177, 5);
  
  noStroke();
  fill(skinColor);
  
  beginShape();
  vertex(195, 180); //
  vertex(205, 180); //
  vertex(205, 200); //
  vertex(195, 200); //
  endShape(CLOSE);
  
  triangle(190, 200, 200, 215, 210, 200);
  
  stroke(200, 150, 130);
  line(195, 205, 205, 205);
  noStroke();
  
  fill(255, 150, 150);
  noStroke();
  rect(175, 230, 50, 10, 5);
  
  fill(hairColor);
  
  fill(255, 150, 150);
  rect(175, 230, 50, 10, 5);
  fill(hairColor); //
  
  beginShape();
  vertex(125, 175); // 
  vertex(125, 200); // 
  vertex(125, 225); // 
  vertex(135, 250); // 
  vertex(175, 250); // 
  vertex(175, 240); // 
  endShape(CLOSE);
  
  beginShape();
  vertex(275, 175); //
  vertex(275, 200); //
  vertex(275, 225); //
  vertex(265, 250); //
  vertex(225, 250); //
  vertex(225, 240); //
  endShape(CLOSE);

  beginShape();
  vertex(175, 250); //
  bezierVertex(185, 270, 215, 270, 225, 250); //
  endShape(CLOSE);
  
  beginShape();
  vertex(170, 225); //
  bezierVertex(175, 215, 190, 220, 200, 220); //
  bezierVertex(210, 220, 225, 215, 230, 225); //
  endShape();
  
  fill(skinColor);
  beginShape();
  vertex(150, 290); //
  vertex(120, 330); //
  vertex(110, 380); //
  vertex(130, 380); //
  vertex(140, 340); //
  vertex(150, 320); //
  endShape(CLOSE);
  
  beginShape();
  vertex(250, 290); //
  vertex(280, 330); //
  vertex(290, 380); //
  vertex(270, 380); //
  vertex(260, 340); //
  vertex(250, 320); //
  endShape(CLOSE);
  
  fill(shirtColor);
  beginShape();
  vertex(150, 290); //
  vertex(150, 360); //
  vertex(250, 360); //
  vertex(250, 290); //
  endShape(CLOSE);
  
  beginShape();
  vertex(150, 290); //
  vertex(130, 300); //
  vertex(140, 320); //
  vertex(150, 320); //
  endShape(CLOSE);
  
  beginShape();
  vertex(250, 290); //
  vertex(270, 300); //
  vertex(260, 320); //
  vertex(250, 320); //
  endShape(CLOSE);
  
  fill(jeansColor);
  beginShape();
  vertex(150, 360); //
  vertex(140, 400); //
  vertex(170, 400); //
  vertex(230, 400); //
  vertex(260, 400); //
  vertex(250, 360); //
  endShape(CLOSE);
  
  stroke(50, 70, 120);
  strokeWeight(1);
  line(200, 360, 200, 400); //
  line(160, 380, 160, 400); //
  line(240, 380, 240, 400); //
  noStroke();
  
  stroke(255);
  strokeWeight(3);
  point(180, 310);
  point(200, 320);
  point(220, 310);
  
  // 
  fill(0);
  noStroke();
  textSize(12);
  textAlign(RIGHT);
  text("Charlie", 380, 380);
  
  // 
  noLoop();
}