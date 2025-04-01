// Enhanced Simon Game
var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;
var highScore = 0;
var effectsEnabled = true;

// DOM Elements
const titleElement = document.querySelector("h1");
const bodyElement = document.querySelector("body");
const buttons = document.querySelectorAll(".btn");
const toggleEffectsBtn = document.createElement("button");

// Initialize UI
function initUI() {
  // Create effects toggle button
  toggleEffectsBtn.textContent = "Toggle Effects";
  toggleEffectsBtn.classList.add("effects-toggle");
  toggleEffectsBtn.addEventListener("click", toggleEffects);
  document.querySelector(".container").appendChild(toggleEffectsBtn);
  
  // Add rainbow title effect
  titleElement.classList.add("rainbow-text");
}

// Main game functions
function nextSequence() {
  userClickedPattern = [];
  level++;
  updateTitle(`Level ${level}`, true);
  
  const randomNumber = Math.floor(Math.random() * 4);
  const randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);
  
  animateButton(randomChosenColour);
  playSound(randomChosenColour);
}

function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      celebrateSuccess();
      setTimeout(nextSequence, 1000);
    }
  } else {
    gameOver();
  }
}

// UI Effects
function animateButton(color) {
  const button = document.querySelector(`#${color}`);
  
  if (effectsEnabled) {
    // Flash effect
    button.style.animation = "flash 0.3s";
    setTimeout(() => {
      button.style.animation = "";
    }, 300);
    
    // Glow effect
    button.classList.add("glow");
    setTimeout(() => {
      button.classList.remove("glow");
    }, 500);
  } else {
    // Simple fade if effects disabled
    fadeIn(button);
  }
}

function celebrateSuccess() {
  if (!effectsEnabled) return;
  
  // Confetti effect
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      createConfetti();
    }, i * 20);
  }
  
  // Color pulse
  bodyElement.style.animation = "colorPulse 0.5s";
  setTimeout(() => {
    bodyElement.style.animation = "";
  }, 500);
}

function createConfetti() {
  const confetti = document.createElement("div");
  confetti.classList.add("confetti");
  confetti.style.left = Math.random() * 100 + "vw";
  confetti.style.backgroundColor = buttonColours[Math.floor(Math.random() * 4)];
  confetti.style.animationDuration = Math.random() * 3 + 2 + "s";
  document.body.appendChild(confetti);
  
  setTimeout(() => {
    confetti.remove();
  }, 3000);
}

// Game states
function gameOver() {
  playSound("wrong");
  
  // Update high score
  highScore = Math.max(highScore, level - 1);
  
  if (effectsEnabled) {
    // Shake animation
    bodyElement.classList.add("shake");
    setTimeout(() => {
      bodyElement.classList.remove("shake");
    }, 500);
  }
  
  updateTitle(`Game Over! Score: ${level - 1} | High Score: ${highScore}`, false);
  startOver();
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
  
  // Show restart prompt with animation
  const restartPrompt = document.createElement("div");
  restartPrompt.textContent = "Press Any Key or Click Here to Restart";
  restartPrompt.classList.add("restart-prompt");
  restartPrompt.addEventListener("click", startGame);
  document.querySelector(".container").appendChild(restartPrompt);
  
  setTimeout(() => {
    restartPrompt.classList.add("visible");
  }, 100);
}

// Helper functions
function updateTitle(text, isLevelUp) {
  titleElement.textContent = text;
  
  if (effectsEnabled && isLevelUp) {
    titleElement.classList.add("level-up");
    setTimeout(() => {
      titleElement.classList.remove("level-up");
    }, 500);
  }
}

function playSound(name) {
  if (!effectsEnabled && name !== "wrong") return;
  
  const audio = new Audio(`sounds/${name}.mp3`);
  audio.volume = effectsEnabled ? 1.0 : 0.3;
  audio.play();
}

function toggleEffects() {
  effectsEnabled = !effectsEnabled;
  toggleEffectsBtn.textContent = effectsEnabled ? "Disable Effects" : "Enable Effects";
  toggleEffectsBtn.classList.toggle("effects-off", !effectsEnabled);
  
  // Update UI based on effects state
  if (effectsEnabled) {
    titleElement.classList.add("rainbow-text");
  } else {
    titleElement.classList.remove("rainbow-text", "level-up");
  }
}

// Event handlers
function startGame() {
  // Remove restart prompt if exists
  const prompt = document.querySelector(".restart-prompt");
  if (prompt) prompt.remove();
  
  if (!started) {
    updateTitle("Level 1", true);
    nextSequence();
    started = true;
  }
}

// Initialize game
initUI();

// Event listeners
buttons.forEach(button => {
  button.addEventListener("click", function() {
    if (!started) return;
    
    const userChosenColour = this.id;
    userClickedPattern.push(userChosenColour);
    
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length - 1);
  });
});

titleElement.addEventListener("click", startGame);
bodyElement.addEventListener("keypress", startGame);

// Animation functions
function animatePress(currentColour) {
  const button = document.querySelector(`.${currentColour}`);
  
  button.classList.add("pressed");
  setTimeout(() => {
    button.classList.remove("pressed");
  }, 100);
}

function fadeIn(el) {
  let op = 0;
  el.style.opacity = op;
  el.style.display = 'inline-block';

  const timer = setInterval(() => {
    if (op >= 1.0) clearInterval(timer);
    el.style.opacity = op;
    op += 0.1;
  }, 25);
}
