// A2 M2 Missile Command
//

const CANVAS_WIDTH = 1344;
const CANVAS_HEIGHT = 756;
const FRAME_RATE = 60;

// Debug Mode
const DEBUG = false;

// Sprites
let missileGroup;
let explosionGroup;
let bulletGroup;
let targetGroup;
let platformGroup;
let cityGroup;

// Time
let countSplash = 3;
let countDown = 3;

// Mode statuses
let showSplash = true;
let showGame = false;
let showMainMenu = false;
let showCountdown = false;
let showLeaderboard = false;

// Player
let players = [];
let currentPlayer;
class Player {
  constructor(playerName, topScore, currentScore) {
    this.playerName = playerName;
    this.topScore = topScore;
    this.currentScore = currentScore;
  }
}

// Sound
let shootSound;

// Images
let shootingImg;
let purpleImg1;
let purpleImg2;
let purpleImg3;
let orangeImg1;
let orangeImg2;
let orangeImg3;
let yellowImg1;
let yellowImg2;
let yellowImg3;
let greenImg1;
let greenImg2;
let greenImg3;
let pinkImg1;
let pinkImg2;
let pinkImg3;
let blueImg1;
let blueImg2;
let blueImg3;

let colours = ['purple', 'orange', 'yellow', 'green', 'pink', 'blue'];

function preload() {
  // Background Img
  paperBgImg = loadImage('images/background.jpg'); 
  // Images for sprites
  shootingImg = loadImage('images/shooting.png');
  purpleImg1 = loadImage('images/purple-1.png');
  purpleImg2 = loadImage('images/purple-2.png');
  purpleImg3 = loadImage('images/purple-3.png');
  orangeImg1 = loadImage('images/orange-1.png');
  orangeImg2 = loadImage('images/orange-2.png');
  orangeImg3 = loadImage('images/orange-3.png');
  yellowImg1 = loadImage('images/yellow-1.png');
  yellowImg2 = loadImage('images/yellow-2.png');
  yellowImg3 = loadImage('images/yellow-3.png');
  greenImg1 = loadImage('images/green-1.png');
  greenImg2 = loadImage('images/green-2.png');
  greenImg3 = loadImage('images/green-3.png');
  pinkImg1 = loadImage('images/pink-1.png');
  pinkImg2 = loadImage('images/pink-2.png');
  pinkImg3 = loadImage('images/pink-3.png');
  blueImg1 = loadImage('images/blue-1.png');
  blueImg2 = loadImage('images/blue-2.png');
  blueImg3 = loadImage('images/blue-3.png');
  // Sound
  soundFormats('mp3');
  shootSound  = loadSound('sounds/417217');
  // Json file for sample players
  loadJSON('sample_players.json', importSamplePlayers); 
}

function setup() {
  frameRate(FRAME_RATE);
  rectMode(CENTER);

  // Set sprite groups
  missileGroup = new Group();
  explosionGroup = new Group();
  bulletGroup = new Group();
  targetGroup = new Group();
  platformGroup = new Group();
  cityGroup = new Group();

  // Create sprites
  createGround();
  createPlatforms();
  createCities();

  setGUI(); // Set up GUI components
  sortPlayersByScore(); // Sort and update players array
}


function draw() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  //background(255);
  image(paperBgImg, 0, 0);
  drawSprites();

  displayGame();
  displaySplash();
  displayMainMenu();
  displayLeaderboard();
  displayCountdown();
}

function incomingMissiles() {
  let shootMissile = int(random(0,30));
  if (shootMissile == 1) {
    let x = random(0, CANVAS_WIDTH);
    let aimX = random(0, CANVAS_WIDTH);
    let speed = random(0.5, 5); // Speed of missiles
    missile = createSprite(x, 0, 10, 10);
    missile.rotateToDirection = true;
    missile.attractionPoint(speed, aimX, CANVAS_HEIGHT);

    missile.setCollider('circle');
    missile.debug = DEBUG;
    
    missileGroup.add(missile); // add missile to group
  }
  missileGroup.collide(ground, removeMissile); // set collide with ground
  missileGroup.collide(explosionGroup, killMissile); // set collide with explosions
  missileGroup.collide(platformGroup, explode); // set collide with platforms
  missileGroup.collide(cityGroup, explode); // set collide with cities
}

function createPlatforms() {
  platform1 = createSprite(CANVAS_WIDTH*0.1, CANVAS_HEIGHT - 30, 40, 40);
  platform2 = createSprite(CANVAS_WIDTH/2, CANVAS_HEIGHT - 30, 40, 40);
  platform3 = createSprite(CANVAS_WIDTH*0.9, CANVAS_HEIGHT - 30, 40, 40);
  platformGroup.add(platform1);
  platformGroup.add(platform2);
  platformGroup.add(platform3);
  platformGroup.debug = DEBUG;
}
function createCities() {
  city1 = createSprite(CANVAS_WIDTH*0.2, CANVAS_HEIGHT - 30, 40, 40);
  city2 = createSprite(CANVAS_WIDTH*0.3, CANVAS_HEIGHT - 30, 40, 40);
  city3 = createSprite(CANVAS_WIDTH*0.4, CANVAS_HEIGHT - 30, 40, 40);
  city4 = createSprite(CANVAS_WIDTH*0.6, CANVAS_HEIGHT - 30, 40, 40);
  city5 = createSprite(CANVAS_WIDTH*0.7, CANVAS_HEIGHT - 30, 40, 40);
  city6 = createSprite(CANVAS_WIDTH*0.8, CANVAS_HEIGHT - 30, 40, 40);
  cityGroup.add(city1);
  cityGroup.add(city2);
  cityGroup.add(city3);
  cityGroup.add(city4);
  cityGroup.add(city5);
  cityGroup.add(city6);
  
  cityGroup.debug = DEBUG;
}
function createGround() {
  ground = createSprite(CANVAS_WIDTH/2, CANVAS_HEIGHT - 5, CANVAS_WIDTH, 10);
}
// Create and add a player
function createPlayer(name, topScore, currentScore) {
  let newPlayer = new Player(name, topScore, currentScore);
  players.push(newPlayer); // add new player to players array
  return newPlayer;
}

// Sort and update players array by top scores
function sortPlayersByScore() {
  if (players.length > 1) {
    for (let i = 0; i < players.length; i++) {
      for (let t = i+1; t < players.length; t++) {
        if (players[i].topScore < players[t].topScore) {
          let lower = players[i];
          players[i] = players[t];
          players[t] = lower;
        }
      }
    }
  }
}

// Json file import
function importSamplePlayers(samplePlayers) {
  let array = samplePlayers.players;
  for (let i = 0; i < array.length; i++) {
    let name = array[i].playerName;
    let topScore = array[i].topScore;
    let currentScore = array[i].currentScore;
    // Add imported player to players array
    createPlayer(name, topScore, currentScore);
  }
}
function removeMissile(missile) {
  missile.remove();
}
// Remove missile and give point to player
function killMissile(missile) {
  missile.remove();
  currentPlayer.currentScore++;
}
function launchMissile(x, y) {
  target = createSprite(x, y, 10, 10);
  targetGroup.add(target);

  let fromX;
  let fromY;
  if (x < CANVAS_WIDTH*0.3 && !platform1.removed || x < CANVAS_WIDTH*0.7 && platform2.removed && !platform1.removed || platform2.removed && platform3.removed) {
    fromX = platform1.position.x;
    fromY = platform1.position.y;
  } else if (x > CANVAS_WIDTH*0.7 && !platform3.removed || platform1.removed && platform2.removed) {
    fromX = platform3.position.x;
    fromY = platform3.position.y;
  } else if (!platform2.removed) {
    fromX = platform2.position.x;
    fromY = platform2.position.y;
  }

  bullet = createSprite(fromX, fromY, 5, 5);
  bullet.attractionPoint(10, x, y);
  bullet.rotateToDirection = true;
  bullet.addImage(shootingImg);
  bulletGroup.add(bullet);
  shootSound.play();
  
}


function explode(bullet, target) {
  x = target.position.x;
  y = target.position.y;
  bullet.remove();
  target.remove();

  explosion = createSprite(x, y, 60, 60);
  explosion.life = 30;
  explosion.setCollider('circle');
  explosion.debug = DEBUG;
  explosionGroup.add(explosion); // add to group
  splashInk(); // Splashing ink animation and image
}

// Splashing ink animation and image with colours
function splashInk() {
  let colour = random(colours);
  let angle = int(random(1, 360));
  let splash = createSprite(x, y, 60, 60);
  splash.rotation = angle;
  if (colour == 'purple') {
    explosion.addAnimation('purple', purpleImg1, purpleImg2, purpleImg3);
    splash.addImage(purpleImg3);
  } else if (colour == 'orange') {
    explosion.addAnimation('orange', orangeImg1, orangeImg2, orangeImg3);
    splash.addImage(orangeImg3);
  } else if (colour == 'yellow') {
    explosion.addAnimation('yellow', yellowImg1, yellowImg2, yellowImg3);
    splash.addImage(yellowImg3);
  } else if (colour == 'green') {
    explosion.addAnimation('green', greenImg1, greenImg2, greenImg3);
    splash.addImage(greenImg3);
  } else if (colour == 'pink') {
    explosion.addAnimation('pink', pinkImg1, pinkImg2, pinkImg3);
    splash.addImage(pinkImg3);
  } else if (colour == 'blue') {
    explosion.addAnimation('blue', blueImg1, blueImg2, blueImg3);
    splash.addImage(blueImg3);
  }
}

function monitorCities() {
  let removedCities = 0;
  for (let i = 0; i < cityGroup.length; i++) {
    if (cityGroup[i].removed) {
      removedCities++;
    }
  }
  if (removedCities == cityGroup.length) {
    gameEnd();
  }
}

function gameEnd() {
  fill(0);
  stroke(0);
  textSize(100);
  textAlign(CENTER, TOP);
  text('Game Over', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
  noLoop();
}

function gameInfoBar() {
  noStroke();
  fill(200, 200, 200, 150);
  rect(CANVAS_WIDTH/2, 15, CANVAS_WIDTH, 30);
  fill(0);
  textSize(16);
  textAlign(LEFT, TOP);
  text('Player: ' + currentPlayer.playerName, 20, 5);
  textAlign(CENTER, TOP);
  text('Score: ' + currentPlayer.currentScore, CANVAS_WIDTH/2, 5);
}

///
/// Key and Mouse controls
///

function mousePressed() {
  if (showGame) {
    launchMissile(mouseX, mouseY);
  }
}
function keyPressed() {
  // ENTER key to Pause
  if (keyCode === ENTER) {
    if (isLooping()) {
      noLoop();
    } else {
      loop();
    }
  } else if (keyCode === ESCAPE) {
    if (!showMainMenu) {
      showMainMenu = true;
      //noLoop();
    } else {
      showMainMenu = false;
      //loop();
    }
  } else if (key === '3') {
    if (showMainMenu) {
      showLeaderboard = true;
      showMainMenu = false; 
    } else if (showLeaderboard) {
      showMainMenu = true;
      showLeaderboard = false;
    }
  }
}

///
/// Scenes
///

// Game
function displayGame() {
  if (showGame) {
    monitorCities();
    incomingMissiles();
    bulletGroup.collide(targetGroup, explode);
    gameInfoBar();
  }
}

// Leaderboard Scene
function displayLeaderboard() {
  if (showLeaderboard) {
    hideGUI(); // Hide button and input
    let menuBoxTop = CANVAS_HEIGHT*0.2
    noStroke();
    fill(200, 200, 200, 200);
    rect(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_WIDTH*0.6, CANVAS_HEIGHT - menuBoxTop*2);
    noStroke();
    fill(0);
    textAlign(CENTER);
    textSize(30);
    text('- Leaderboard -', CANVAS_WIDTH/2, menuBoxTop + 80);
    textSize(30);

    // Display list of top players
    let maxList = 5;
    if (players.length < 5) {
      maxList = players.length; // Amend list number for less players
    }
    // Display text each player from players array
    for(let i = 0; i < maxList; i++) {
      let rank = i + 1;
      let name = players[i].playerName;
      let score = players[i].topScore;
      if (score != null) {
        text(rank + '. ' + score + ' points by ' + name, CANVAS_WIDTH/2, menuBoxTop + 180 + 40*i);
      }
    }
  }
}

// Main Menu
function displayMainMenu() {
  if (showMainMenu) {
    let menuBoxTop = CANVAS_HEIGHT*0.2;
    noStroke();
    fill(200, 200, 200, 200);
    rect(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_WIDTH*0.6, CANVAS_HEIGHT - menuBoxTop*2);
    noStroke();
    fill(0);
    textAlign(CENTER);
    textSize(50);
    text('Ink Missile Battle', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 200);
    textSize(20);
    text('Type your name', CANVAS_WIDTH/2, CANVAS_HEIGHT*0.4 - 50);
    nameInput.position(CANVAS_WIDTH/2, CANVAS_HEIGHT*0.4);
    startButton.position(CANVAS_WIDTH/2, CANVAS_HEIGHT*0.5);
    textSize(40);
    text('key [2] End Game', CANVAS_WIDTH/2, menuBoxTop + 180);
    text('key [3] Leaderboard', CANVAS_WIDTH/2, menuBoxTop + 260);
    text('key [4] Mute Sound', CANVAS_WIDTH/2, menuBoxTop + 340);
  }
}

// Splash Scene
function displaySplash() {
  if (showSplash) {
    //background(255);
    noStroke();
    fill(0);
    textAlign(CENTER);
    textSize(50);
    text('Ink Missile Battle', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 200);
    textSize(20);
    text(countSplash, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    if (frameCount % FRAME_RATE == 0 && countSplash > 0) {
      countSplash--;
    } else if (countSplash == 0) {
      showMainMenu = true;
      showSplash = false;
    }
  }
}

// Countdown Scene
function displayCountdown() {
  if (showCountdown) {
    background(255);
    noStroke();
    fill(0);
    textAlign(CENTER);
    textSize(400);
    text(countDown, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    if (frameCount % FRAME_RATE == 0 && countDown > 0) {
      countDown--;
    } else if (countDown == 0) {
      showGame = true;
      showCountdown = false;
    }
  }
}

// Segue to Game
function segueToGame() {
  showMainMenu = false;
  hideGUI(); // Hide button and input
  showCountdown = true;
  currentPlayer = createPlayer(nameInput.value(), null, 0);
}

///
/// GUI
///

function setGUI() {
  // Input
  nameInput = createInput('');
  nameInput.position(-500, -500);
  nameInput.size(300);

  // Button
  startButton = createButton('START');
  startButton.position(-100, -100);
  startButton.mousePressed(segueToGame);
}

function hideGUI() {
  nameInput.position(-500, -500);
  startButton.position(-100, -100);
}