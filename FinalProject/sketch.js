// ASD-Friendly Pomodoro Timer
// Customized with 20-minute work periods and 10-minute breaks

// Timer variables
let workTime = 20 * 60; // 20 minutes in seconds
let breakTime = 10 * 60; // 10 minutes in seconds
let currentTime; // Current time remaining
let isWorking = true; // Whether in work mode or break mode
let timerRunning = false; // Whether timer is active
let lastSecond = 0; // For tracking second changes
let timerStartTime = 0; // When the current session started
let completedCycles = 0; // Counter for completed work-break cycles

// Visual customization variables
let currentTheme = "focus"; // Options: calm, focus, minimal
let visualIntensity = 0.5; // Scale from 0-1
let soundEnabled = true;
let warningTime = 2 * 60; // 2-minute warning before transitions
let predictabilityMode = true; // Enhanced predictability mode for ASD
let countdownVisible = true; // Visual countdown display option
let transitionAlerts = true; // Extra transition warnings
let textSize1 = 24; // Mode label size
let textSize2 = 120; // Timer size
let textSize3 = 16; // Status text size

// Background media variables
let workBackgroundImg = null;
let breakBackgroundImg = null;
let currentBackgroundImg = null;
let workAudio = null;
let breakAudio = null;
let currentAudio = null;
let audioVolume = 0.5; // Default volume
let volumeSlider;

// History tracking
let sessionHistory = []; // Array to store session data
let dailyGoal = 4; // Number of cycles aimed for per day

// UI elements
let startButton, resetButton, themeButton, soundButton;
let settingsOpen = false;
let settingsButton;
let imageButton, audioButton;
let fontSizeButton, predictabilityButton, transitionButton;
let nextActivityLabel;

// Particle system for background
let particles = [];
let particleCount = 15; // Reduced for minimalism

// Sounds
let workCompleteSound;
let breakCompleteSound;
let tickSound;
let warningSound;

// Preload sounds and images
function preload() {
  // Create simple sound files programmatically
  workCompleteSound = new p5.Oscillator("sine");
  breakCompleteSound = new p5.Oscillator("sine");
  tickSound = new p5.Oscillator("sine");
  warningSound = new p5.Oscillator("triangle");

  // Set up sound files and events in the first draw call
  setTimeout(() => {
    setupSounds();
  }, 1000);

  // Try to load default background images
  // Note: These would need to be replaced with actual image files
  // workBackgroundImg = loadImage('assets/work-background.jpg');
  // breakBackgroundImg = loadImage('assets/break-background.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  currentTime = workTime;

  // Create UI elements with improved spacing
  let buttonWidth = 140;
  let buttonHeight = 50;
  let buttonY = height - 80;

  startButton = createButton("Start");
  startButton.position(width / 2 - buttonWidth - 30, buttonY);
  startButton.size(buttonWidth, buttonHeight);
  startButton.mousePressed(toggleTimer);

  resetButton = createButton("Reset");
  resetButton.position(width / 2 + 30, buttonY);
  resetButton.size(buttonWidth, buttonHeight);
  resetButton.mousePressed(resetTimer);

  settingsButton = createButton("⚙️");
  settingsButton.position(20, 20);
  settingsButton.size(40, 40);
  settingsButton.mousePressed(toggleSettings);

  // Media control buttons - moved to top of screen
  imageButton = createButton("Change Image");
  imageButton.position(width / 2 - 200, 20);
  imageButton.size(130, 40);
  imageButton.mousePressed(selectImage);

  audioButton = createButton("Change Audio");
  audioButton.position(width / 2 + 70, 20);
  audioButton.size(130, 40);
  audioButton.mousePressed(selectAudio);

  // Volume slider - positioned in an uncluttered area
  volumeSlider = createSlider(0, 1, 0.5, 0.01);
  volumeSlider.style("width", "120px");
  volumeSlider.input(adjustVolume);
  positionVolumeSlider();

  // Create next activity label (for predictability)
  nextActivityLabel = createP("");
  nextActivityLabel.position(width / 2 - 150, height - 150);
  nextActivityLabel.style("font-size", "16px");
  nextActivityLabel.style("color", "rgba(200, 200, 220, 0.8)");
  nextActivityLabel.style("text-align", "center");
  nextActivityLabel.style("width", "300px");
  updateNextActivityLabel();

  // Create particles for background
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Style the buttons
  styleButtons();

  // Set initial background image
  currentBackgroundImg = workBackgroundImg;
  currentAudio = workAudio;
}

function positionVolumeSlider() {
  // Position the volume slider in an uncluttered area at the bottom right corner
  volumeSlider.position(width - 150, height - 50);
}

function draw() {
  // Display background image or color
  if (currentBackgroundImg) {
    // Create a semi-transparent overlay to ensure text remains readable
    image(currentBackgroundImg, 0, 0, width, height);
    fill(
      getBackgroundColor().levels[0],
      getBackgroundColor().levels[1],
      getBackgroundColor().levels[2],
      150
    );
    rect(0, 0, width, height);
  } else {
    background(getBackgroundColor());
  }

  // Update and display particles
  updateParticles();

  // Update timer if running
  if (timerRunning) {
    updateTimer();
  }

  // Display the main timer interface
  displayTimerInterface();

  // Display warning if approaching transition
  if (currentTime <= warningTime && timerRunning) {
    displayTransitionWarning();
  }

  // Display settings panel if open
  if (settingsOpen) {
    displaySettings();
  }

  // Display cycle progress in a less obtrusive way
  displayCycleProgress();

  // Label for volume slider
  if (!settingsOpen) {
    textAlign(RIGHT, CENTER);
    textSize(14);
    fill(getTextColor(0.7));
    text("Volume", width - 160, height - 50);
  }
}

function setupSounds() {
  // Configure sounds
  if (typeof p5.Oscillator !== "undefined") {
    // Work complete sound - three rising tones
    workCompleteSound.setType("sine");
    workCompleteSound.freq(440);
    workCompleteSound.amp(0);

    // Break complete sound - two falling tones
    breakCompleteSound.setType("sine");
    breakCompleteSound.freq(440);
    breakCompleteSound.amp(0);

    // Tick sound - short click
    tickSound.setType("square");
    tickSound.freq(220);
    tickSound.amp(0);

    // Warning sound - pulsing tone
    warningSound.setType("triangle");
    warningSound.freq(330);
    warningSound.amp(0);
  }
}

function updateTimer() {
  let currentSecond = floor(millis() / 1000);

  if (currentSecond > lastSecond) {
    currentTime--;
    lastSecond = currentSecond;

    // Play tick sound every 15 seconds if enabled
    if (soundEnabled && currentTime % 15 === 0 && currentTime > 0) {
      playTickSound();
    }

    // Play warning sound at warning time if enabled
    if (soundEnabled && currentTime === warningTime) {
      playWarningSound();
    }

    if (currentTime <= 0) {
      switchMode();
    }
  }
}

function switchMode() {
  // Play appropriate sound
  if (soundEnabled) {
    if (isWorking) {
      playWorkCompleteSound();
    } else {
      playBreakCompleteSound();
      completedCycles++;

      // Record completed cycle
      let cycleData = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        duration: workTime + breakTime,
      };
      sessionHistory.push(cycleData);
    }
  }

  // Enhanced transition for ASD users - show clear visual indicator
  if (transitionAlerts) {
    // Create a full-screen flash with the new mode color
    let flashColor = !isWorking
      ? color(80, 120, 255, 80) // Transitioning to work - blue
      : color(80, 230, 120, 80); // Transitioning to break - green

    fill(flashColor);
    rect(0, 0, width, height);

    // Display large mode change text
    textAlign(CENTER, CENTER);
    textSize(40);
    fill(getTextColor());
    text(
      !isWorking ? "STARTING WORK MODE" : "STARTING BREAK MODE",
      width / 2,
      height / 2
    );

    // Slight delay before continuing to make transition clear
    setTimeout(() => {
      continueModeSwitching();
    }, 1000);
  } else {
    continueModeSwitching();
  }
}

function continueModeSwitching() {
  isWorking = !isWorking;
  if (isWorking) {
    currentTime = workTime;
    startButton.html("Start Work");

    // Change background image and audio
    currentBackgroundImg = workBackgroundImg;
    if (breakAudio && breakAudio.isPlaying()) {
      fadeAudio(breakAudio, workAudio);
    }
  } else {
    currentTime = breakTime;
    startButton.html("Start Break");

    // Change background image and audio
    currentBackgroundImg = breakBackgroundImg;
    if (workAudio && workAudio.isPlaying()) {
      fadeAudio(workAudio, breakAudio);
    }
  }

  // Update next activity label
  if (predictabilityMode) {
    updateNextActivityLabel();
  }

  // Update button text
  if (timerRunning) {
    startButton.html("Pause");
  }
}

function toggleTimer() {
  timerRunning = !timerRunning;

  if (timerRunning) {
    startButton.html("Pause");
    timerStartTime = millis() - (workTime - currentTime) * 1000;
    lastSecond = floor(millis() / 1000);

    // Start audio if available
    if (isWorking && workAudio) {
      workAudio.setVolume(audioVolume);
      workAudio.loop();
    } else if (!isWorking && breakAudio) {
      breakAudio.setVolume(audioVolume);
      breakAudio.loop();
    }
  } else {
    startButton.html(isWorking ? "Resume Work" : "Resume Break");

    // Pause audio
    if (isWorking && workAudio && workAudio.isPlaying()) {
      workAudio.pause();
    } else if (!isWorking && breakAudio && breakAudio.isPlaying()) {
      breakAudio.pause();
    }
  }
}

function resetTimer() {
  currentTime = isWorking ? workTime : breakTime;
  timerRunning = false;
  startButton.html(isWorking ? "Start Work" : "Start Break");

  // Stop audio
  if (isWorking && workAudio && workAudio.isPlaying()) {
    workAudio.stop();
  } else if (!isWorking && breakAudio && breakAudio.isPlaying()) {
    breakAudio.stop();
  }
}

function toggleSettings() {
  settingsOpen = !settingsOpen;

  // Hide all settings buttons when closing the panel
  if (!settingsOpen) {
    hideSettingsButtons();
  }
}

function toggleTheme() {
  if (currentTheme === "calm") {
    currentTheme = "focus";
  } else if (currentTheme === "focus") {
    currentTheme = "minimal";
  } else {
    currentTheme = "calm";
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
}

function toggleFontSize() {
  if (textSize1 === 24) {
    // Switch to larger text
    textSize1 = 32;
    textSize2 = 150;
    textSize3 = 20;
  } else {
    // Switch to normal text
    textSize1 = 24;
    textSize2 = 120;
    textSize3 = 16;
  }
}

function togglePredictability() {
  predictabilityMode = !predictabilityMode;

  if (predictabilityMode) {
    nextActivityLabel.show();
    updateNextActivityLabel();
  } else {
    nextActivityLabel.hide();
  }
}

function toggleTransitionAlerts() {
  transitionAlerts = !transitionAlerts;
}

function updateNextActivityLabel() {
  if (!predictabilityMode) return;

  let nextActivity = isWorking ? "Break" : "Work Session";
  let minutes = floor(currentTime / 60);
  let seconds = currentTime % 60;

  let labelText = `Next: ${nextActivity} in ${minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
  nextActivityLabel.html(labelText);

  // Highlight label when approaching transition
  if (currentTime <= warningTime) {
    nextActivityLabel.style("color", "rgba(255, 180, 180, 0.9)");
    nextActivityLabel.style("font-weight", "bold");
  } else {
    nextActivityLabel.style("color", "rgba(200, 200, 220, 0.8)");
    nextActivityLabel.style("font-weight", "normal");
  }
}

function displaySettings() {
  // Settings panel background - smaller and more discreet
  fill(
    getBackgroundColor().levels[0],
    getBackgroundColor().levels[1],
    getBackgroundColor().levels[2],
    230
  );
  stroke(getAccentColor(0.5));
  strokeWeight(2);
  rect(20, 70, 280, 380, 15);

  // Settings title
  textAlign(LEFT, TOP);
  textSize(20);
  fill(getTextColor());
  text("Settings", 40, 90);

  // Theme toggle
  textSize(16);
  text("Theme: " + currentTheme, 40, 130);

  if (!themeButton) {
    themeButton = createButton("Change Theme");
    themeButton.position(160, 125);
    themeButton.size(120, 35);
    themeButton.mousePressed(toggleTheme);
    styleButtons();
  } else {
    themeButton.position(160, 125);
    themeButton.size(120, 35);
    themeButton.show();
  }

  // Sound toggle
  text("Sound: " + (soundEnabled ? "On" : "Off"), 40, 180);

  if (!soundButton) {
    soundButton = createButton(soundEnabled ? "Turn Off" : "Turn On");
    soundButton.position(160, 175);
    soundButton.size(120, 35);
    soundButton.mousePressed(toggleSound);
    styleButtons();
  } else {
    soundButton.position(160, 175);
    soundButton.size(120, 35);
    soundButton.html(soundEnabled ? "Turn Off" : "Turn On");
    soundButton.show();
  }

  // Font size toggle
  text("Font Size: " + (textSize2 === 120 ? "Normal" : "Large"), 40, 230);

  if (!fontSizeButton) {
    fontSizeButton = createButton("Toggle Size");
    fontSizeButton.position(160, 225);
    fontSizeButton.size(120, 35);
    fontSizeButton.mousePressed(toggleFontSize);
    styleButtons();
  } else {
    fontSizeButton.position(160, 225);
    fontSizeButton.size(120, 35);
    fontSizeButton.show();
  }

  // Predictability mode toggle
  text("Predictability: " + (predictabilityMode ? "On" : "Off"), 40, 280);

  if (!predictabilityButton) {
    predictabilityButton = createButton(
      predictabilityMode ? "Turn Off" : "Turn On"
    );
    predictabilityButton.position(160, 275);
    predictabilityButton.size(120, 35);
    predictabilityButton.mousePressed(togglePredictability);
    styleButtons();
  } else {
    predictabilityButton.position(160, 275);
    predictabilityButton.size(120, 35);
    predictabilityButton.html(predictabilityMode ? "Turn Off" : "Turn On");
    predictabilityButton.show();
  }

  // Transition alerts toggle
  text("Extra Alerts: " + (transitionAlerts ? "On" : "Off"), 40, 330);

  if (!transitionButton) {
    transitionButton = createButton(transitionAlerts ? "Turn Off" : "Turn On");
    transitionButton.position(160, 325);
    transitionButton.size(120, 35);
    transitionButton.mousePressed(toggleTransitionAlerts);
    styleButtons();
  } else {
    transitionButton.position(160, 325);
    transitionButton.size(120, 35);
    transitionButton.html(transitionAlerts ? "Turn Off" : "Turn On");
    transitionButton.show();
  }

  // Stats - smaller and less prominent
  textSize(16);
  text("Completed cycles: " + completedCycles, 40, 380);
  text("Daily goal: " + dailyGoal + " cycles", 40, 410);
}

function displayTimerInterface() {
  // Display mode label - smaller and less prominent
  textAlign(CENTER, CENTER);
  textSize(textSize1);
  fill(getTextColor(0.8));
  text(isWorking ? "FOCUS TIME" : "BREAK TIME", width / 2, height / 3 - 80);

  // Display timer with appropriate font size - centered on screen
  let minutes = floor(currentTime / 60);
  let seconds = currentTime % 60;
  let timeString = nf(minutes, 2) + ":" + nf(seconds, 2);

  textSize(textSize2);
  text(timeString, width / 2, height / 2 - 30);

  // Optional small status text - reduced size
  textSize(textSize3);
  fill(getTextColor(0.6));
  let statusText = isWorking
    ? "Stay focused on your current task"
    : "Take a moment to rest";
  text(statusText, width / 2, height / 2 + 70);

  // Visual countdown if enabled
  if (countdownVisible && predictabilityMode) {
    let totalTime = isWorking ? workTime : breakTime;
    let percentage = currentTime / totalTime;

    // Draw arc countdown
    noFill();
    stroke(getAccentColor(0.3));
    strokeWeight(6);
    arc(
      width / 2,
      height / 2 - 30,
      textSize2 * 1.5,
      textSize2 * 1.5,
      -HALF_PI,
      TWO_PI * percentage - HALF_PI,
      OPEN
    );
  }

  // Next activity notification if predictability mode is on
  if (predictabilityMode) {
    updateNextActivityLabel();
  } else {
    nextActivityLabel.html("");
  }
}

function displayTransitionWarning() {
  // Calculate warning opacity based on blink
  let warningAlpha = map(sin(frameCount * 0.1), -1, 1, 0.2, 0.8);

  // Display warning text - smaller and positioned better
  textAlign(CENTER, CENTER);
  textSize(textSize3);
  fill(255, 100, 100, warningAlpha * 255);

  let warningText = isWorking
    ? "Break starting soon..."
    : "Work session starting soon...";

  // Positioned to avoid overlap with other elements
  text(warningText, width / 2, height / 2 + 120);

  // Display countdown - smaller
  let minutes = floor(currentTime / 60);
  let seconds = currentTime % 60;
  let countdownText = nf(minutes, 1) + ":" + nf(seconds, 2);

  textSize(textSize3 + 2);
  text(countdownText, width / 2, height / 2 + 150);

  // Extra transition alerts for ASD users
  if (transitionAlerts && currentTime % 15 === 0) {
    // Create a visual pulse for additional awareness
    noFill();
    stroke(255, 100, 100, warningAlpha * 200);
    strokeWeight(3);
    ellipse(width / 2, height / 2, textSize2 * 1.8, textSize2 * 1.8);
  }
}

function displayCycleProgress() {
  // Display cycle progress at top right with smaller text
  textAlign(RIGHT, TOP);
  textSize(14);
  fill(getTextColor(0.6));

  // Simple text-only status
  let cycleInfo = completedCycles + " of " + dailyGoal + " cycles completed";
  text(cycleInfo, width - 20, 20);

  // Percentage as text
  let goalPercentage = min(completedCycles / dailyGoal, 1);
  text(floor(goalPercentage * 100) + "%", width - 20, 40);
}

// Helper functions for colors based on theme
function getBackgroundColor() {
  if (currentTheme === "calm") {
    return isWorking
      ? color(230, 240, 255) // Soft blue for work
      : color(220, 255, 230); // Soft green for break
  } else if (currentTheme === "focus") {
    return isWorking
      ? color(28, 30, 48) // Dark blue for work
      : color(28, 48, 30); // Dark green for break
  } else {
    // minimal
    return isWorking
      ? color(250, 250, 255) // Near white for work
      : color(245, 255, 245); // Near white for break
  }
}

function getTextColor(alpha = 1) {
  if (currentTheme === "calm" || currentTheme === "minimal") {
    return color(50, 50, 70, alpha * 255); // Dark blue-gray
  } else {
    // focus
    return color(230, 230, 240, alpha * 255); // Light blue-gray
  }
}

function getAccentColor(alpha = 1) {
  if (isWorking) {
    if (currentTheme === "calm") {
      return color(100, 130, 230, alpha * 255); // Medium blue
    } else if (currentTheme === "focus") {
      return color(80, 120, 255, alpha * 255); // Bright blue
    } else {
      // minimal
      return color(70, 90, 180, alpha * 255); // Muted blue
    }
  } else {
    // break mode
    if (currentTheme === "calm") {
      return color(100, 200, 130, alpha * 255); // Medium green
    } else if (currentTheme === "focus") {
      return color(80, 230, 120, alpha * 255); // Bright green
    } else {
      // minimal
      return color(70, 160, 90, alpha * 255); // Muted green
    }
  }
}

// Particle class for background animation
class Particle {
  constructor() {
    this.reset();
    this.x = random(width);
    this.y = random(height);
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(2, 5); // Smaller particles
    this.speed = random(0.1, 0.3) * visualIntensity; // Slower movement
    this.direction = random(TWO_PI);
    this.alpha = random(0.05, 0.2) * visualIntensity; // More transparent
    this.wiggle = random(0.01, 0.03);
  }

  update() {
    // Update direction with slight wiggle
    this.direction += random(-this.wiggle, this.wiggle);

    // Move particle
    this.x += cos(this.direction) * this.speed;
    this.y += sin(this.direction) * this.speed;

    // Wrap around edges
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;

    // Occasionally change direction
    if (random(1) < 0.01) {
      this.direction = random(TWO_PI);
    }
  }

  display() {
    noStroke();

    // Use the accent color with reduced alpha
    let particleColor = getAccentColor(this.alpha);
    fill(particleColor);

    ellipse(this.x, this.y, this.size);
  }
}

function updateParticles() {
  for (let particle of particles) {
    // Skip particle updates in minimal theme
    if (currentTheme === "minimal") continue;

    particle.update();
    particle.display();
  }
}

function styleButtons() {
  // Style all buttons
  let buttons = [
    startButton,
    resetButton,
    settingsButton,
    imageButton,
    audioButton,
  ];
  if (themeButton) buttons.push(themeButton);
  if (soundButton) buttons.push(soundButton);
  if (fontSizeButton) buttons.push(fontSizeButton);
  if (predictabilityButton) buttons.push(predictabilityButton);
  if (transitionButton) buttons.push(transitionButton);

  for (let btn of buttons) {
    // More subtle button style
    btn.style("background-color", getAccentColor(0.7));
    btn.style("color", "white");
    btn.style("border", "none");
    btn.style("border-radius", "8px");
    btn.style("padding", "8px 12px");
    btn.style("font-size", "16px");
    btn.style("font-weight", "bold");
    btn.style("cursor", "pointer");
    btn.style("transition", "all 0.3s ease");
    btn.style("box-shadow", "0px 3px 5px rgba(0, 0, 0, 0.2)");

    btn.mouseOver(() => {
      btn.style("background-color", getAccentColor(0.9));
      btn.style("transform", "translateY(-2px)");
      btn.style("box-shadow", "0px 5px 8px rgba(0, 0, 0, 0.25)");
    });

    btn.mouseOut(() => {
      btn.style("background-color", getAccentColor(0.7));
      btn.style("transform", "translateY(0px)");
      btn.style("box-shadow", "0px 3px 5px rgba(0, 0, 0, 0.2)");
    });
  }

  // ASD-friendly focus indication for buttons
  for (let btn of buttons) {
    btn.elt.addEventListener("focus", function () {
      btn.style("outline", "3px solid rgba(255, 255, 255, 0.6)");
      btn.style("outline-offset", "2px");
    });

    btn.elt.addEventListener("blur", function () {
      btn.style("outline", "none");
    });
  }
}

function hideSettingsButtons() {
  if (themeButton) themeButton.hide();
  if (soundButton) soundButton.hide();
  if (fontSizeButton) fontSizeButton.hide();
  if (predictabilityButton) predictabilityButton.hide();
  if (transitionButton) transitionButton.hide();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Reposition buttons
  let buttonWidth = 140;
  let buttonHeight = 50;
  let buttonY = height - 80;

  startButton.position(width / 2 - buttonWidth - 30, buttonY);
  resetButton.position(width / 2 + 30, buttonY);
  settingsButton.position(20, 20);

  // Reposition media buttons - at top of screen
  imageButton.position(width / 2 - 200, 20);
  audioButton.position(width / 2 + 70, 20);

  // Reposition volume slider
  positionVolumeSlider();

  // Reposition next activity label
  nextActivityLabel.position(width / 2 - 150, height - 150);

  // Hide settings buttons when window is resized
  hideSettingsButtons();

  // Reset settings panel state
  settingsOpen = false;
}

// Media handling functions
function playWorkCompleteSound() {
  if (!soundEnabled || typeof p5.Oscillator === "undefined") return;

  workCompleteSound.start();
  workCompleteSound.amp(0.2, 0.05);
  workCompleteSound.freq(440);

  // Simple melody: C, E, G
  setTimeout(() => {
    workCompleteSound.freq(523.25);
  }, 200);
  setTimeout(() => {
    workCompleteSound.freq(659.25);
  }, 400);
  setTimeout(() => {
    workCompleteSound.freq(783.99);
  }, 600);
  setTimeout(() => {
    workCompleteSound.amp(0, 0.1);
  }, 800);
  setTimeout(() => {
    workCompleteSound.stop();
  }, 1000);
}

function playBreakCompleteSound() {
  if (!soundEnabled || typeof p5.Oscillator === "undefined") return;

  breakCompleteSound.start();
  breakCompleteSound.amp(0.2, 0.05);
  breakCompleteSound.freq(659.25);

  // Simple melody: E, C
  setTimeout(() => {
    breakCompleteSound.freq(523.25);
  }, 300);
  setTimeout(() => {
    breakCompleteSound.amp(0, 0.1);
  }, 600);
  setTimeout(() => {
    breakCompleteSound.stop();
  }, 800);
}

function playTickSound() {
  if (!soundEnabled || typeof p5.Oscillator === "undefined") return;

  tickSound.start();
  tickSound.amp(0.05, 0.01);
  setTimeout(() => {
    tickSound.amp(0, 0.05);
  }, 50);
  setTimeout(() => {
    tickSound.stop();
  }, 100);
}

function playWarningSound() {
  if (!soundEnabled || typeof p5.Oscillator === "undefined") return;

  warningSound.start();
  warningSound.amp(0.1, 0.05);
  setTimeout(() => {
    warningSound.amp(0, 0.2);
  }, 200);
  setTimeout(() => {
    warningSound.stop();
  }, 400);
}

// Image and audio selection
function selectImage() {
  // Create file input element
  let fileInput = createFileInput(handleImageFile);
  fileInput.position(0, 0);
  fileInput.size(0, 0);
  fileInput.elt.click();
}

function handleImageFile(file) {
  if (file.type === "image") {
    // User is currently in work mode
    if (isWorking) {
      workBackgroundImg = loadImage(file.data, (img) => {
        currentBackgroundImg = img;
      });
    } else {
      breakBackgroundImg = loadImage(file.data, (img) => {
        currentBackgroundImg = img;
      });
    }
  }
}

function selectAudio() {
  // Create file input element
  let fileInput = createFileInput(handleAudioFile);
  fileInput.position(0, 0);
  fileInput.size(0, 0);
  fileInput.elt.click();
}

function handleAudioFile(file) {
  if (file.type === "audio") {
    // Stop current audio
    if (currentAudio && currentAudio.isPlaying()) {
      currentAudio.stop();
    }

    // Load and play new audio
    if (isWorking) {
      workAudio = loadSound(file.data, (sound) => {
        currentAudio = sound;
        if (timerRunning) {
          currentAudio.setVolume(audioVolume);
          currentAudio.loop();
        }
      });
    } else {
      breakAudio = loadSound(file.data, (sound) => {
        currentAudio = sound;
        if (timerRunning) {
          currentAudio.setVolume(audioVolume);
          currentAudio.loop();
        }
      });
    }
  }
}

function adjustVolume() {
  audioVolume = volumeSlider.value();
  if (currentAudio && currentAudio.isPlaying()) {
    currentAudio.setVolume(audioVolume);
  }
}

function fadeAudio(fromAudio, toAudio) {
  if (!fromAudio || !toAudio) return;

  // Fade out current audio
  let vol = audioVolume;
  let fadeInterval = setInterval(() => {
    vol -= 0.05;
    if (vol <= 0) {
      clearInterval(fadeInterval);
      fromAudio.stop();

      // Start new audio
      toAudio.setVolume(0);
      toAudio.loop();

      // Fade in new audio
      let newVol = 0;
      let fadeInInterval = setInterval(() => {
        newVol += 0.05;
        if (newVol >= audioVolume) {
          clearInterval(fadeInInterval);
          toAudio.setVolume(audioVolume);
        } else {
          toAudio.setVolume(newVol);
        }
      }, 100);
    } else {
      fromAudio.setVolume(vol);
    }
  }, 100);
}
