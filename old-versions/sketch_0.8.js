// A2 M2 Missile Command
//

const CANVAS_WIDTH = 1344;
const CANVAS_HEIGHT = 756;
const FRAME_RATE = 40;

// Debug Mode
const DEBUG = false;

const GAME_TITLE = 'Battles of Watercolour';

// Missile supply default for each platform (set 20)
const MISSILE_SUPLY = 20;

// Rate of creating incoming missiles (lower, more missiles) (set 20)
const MISSILE_RATE = 20;

// Maximum incoming missiles (set 40)
const MAX_MISSILES  = 40; // deadult 40

// Big coloud to appear every # missiles
const BIG_CLOUD_RATE = 10;

let missileSupply = MISSILE_SUPLY;
let rateMissile = MISSILE_RATE;
let maxMissiles = MAX_MISSILES;

// Time
let countSplash = 1;
let countDown = 1;

// Sprite Groups
let missileGroup;
let explosionGroup;
let bulletGroup;
let targetGroup;
let platformGroup;
let cityGroup;
let bigCloudGroup;

// Mode statuses
let showSplash = true;
let showGame = false;
let showMainMenu = false;
let showCountdown = false;
let showLeaderboard = false;
let showCredits = false;
let showLevelUp = false;

let missileCount = 0;
let bigCloudCount = 1;
let gameLevel = 0;

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

// Font
let mainFont;

// Sound
let shootSound;
let popSound;
let gameoverSound;
let fanfareSound;

// Images
let targetImg;
let shootingImg1;
let shootingImg2;
let shootingImg3;
let platformImg;
let cityImg;
let groundImg;
let cloudImg1;
let cloudImg2;
let bigCloudImg1;
let bigCloudImg2;
let incomingImg1;
let incomingImg2;
let incomingImg3;
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
  // Font
  mainFont = loadFont('assets/GloriaHallelujah-Regular.ttf');
  //mainFont = loadFont('assets/ArchitectsDaughter-Regular.ttf');

  // Background Img
  paperBgImg = loadImage('images/background.jpg'); 
  // Images for sprites
  targetImg = loadImage('images/target.png');
  platformImg = loadImage('images/platform.png');
  cityImg = loadImage('images/city.png');
  groundImg = loadImage('images/ground.png');
  cloudImg1 = loadImage('images/cloud-1.png');
  cloudImg2 = loadImage('images/cloud-2.png');
  bigCloudImg1 = loadImage('images/bigcloud-1.png');
  bigCloudImg2 = loadImage('images/bigcloud-2.png');
  shootingImg1 = loadImage('images/shooting-1.png');
  shootingImg2 = loadImage('images/shooting-2.png');
  shootingImg3 = loadImage('images/shooting-3.png');
  incomingImg1 = loadImage('images/incoming-1.png');
  incomingImg2 = loadImage('images/incoming-2.png');
  incomingImg3 = loadImage('images/incoming-3.png');
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
  popSound = loadSound('sounds/570459');
  gameoverSound = loadSound('sounds/43698');
  fanfareSound = loadSound('sounds/566203');
  // Json file for sample players
  loadJSON('sample_players.json', importSamplePlayers); 
}

function setup() {
  frameRate(FRAME_RATE);
  rectMode(CENTER);
  textFont(mainFont);

  // Set sprite groups
  missileGroup = new Group();
  explosionGroup = new Group();
  bulletGroup = new Group();
  targetGroup = new Group();
  platformGroup = new Group();
  cityGroup = new Group();
  bigCloudGroup = new Group();

  setUpGame();

  setGUI(); // Set up GUI components
  
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
  displayCredits();
  displayCountdown();
  displayLevelUp();
}

function setUpGame() {
  // Create sprites
  createIncomingMissles();
  createPlatforms();
  createCities();
  createGround();

  // Sort and update players array
  sortPlayersByScore(); 
}

function incomingMissiles() {
  let rouletteMissile = int(random(0,rateMissile));
  if (rouletteMissile == 1 && missileCount < maxMissiles) {
    let aimX = random(CANVAS_WIDTH*0.1, CANVAS_WIDTH*0.9);
    let speed = random(0.5, 5); // Speed of missiles

    // Move a missile from missileGroup
    let i = maxMissiles - missileCount - 1;
    let missile = missileGroup[i];
    missile.attractionPoint(speed, aimX, CANVAS_HEIGHT);
    missile.addAnimation('incoming', incomingImg1, incomingImg2, incomingImg3);
    missileCount++;
  }
  missileGroup.collide(ground, removeMissile); // set collide with ground
  missileGroup.collide(explosionGroup, killMissile); // set collide with explosions
  missileGroup.collide(platformGroup, killPlatform); // set collide with platforms
  missileGroup.collide(cityGroup, explode); // set collide with cities
}

function createIncomingMissles() {
  for (i = 0; i < maxMissiles; i++) {
    let x = random(0, CANVAS_WIDTH);
    let missile = createSprite(x, -10, 90, 10);
    missile.setCollider('rectangle');
    //missile.attractionPoint(speed, aimX, CANVAS_HEIGHT);
    missile.rotateToDirection = true;
    missile.debug = DEBUG;
    missileGroup.add(missile); // add missile to group
  }
}

function createCloud() {
  let rouletteCloud = int(random(0, 100));
  if (rouletteCloud == 1) {
    let x;
    let angle;
    let y = random(CANVAS_HEIGHT * 0.05, CANVAS_HEIGHT * 0.5);
    let speed = random(0.1, 2); // Speed of cloud
    let directions = ['right', 'left'];
    let direction = random(directions); // Choose direction
    if (direction == 'right') {
      x = - 50;
      angle = 0;
    } else if (direction == 'left') {
      x = CANVAS_WIDTH + 50;
      angle = 180;
    }
    
    // Create a cloud
    let cloud = createSprite(x, y, 100, 60);
    cloud.setSpeed(speed, angle);
    cloud.addAnimation('cloud', cloudImg1, cloudImg2);
    cloud.life = 5000;
    cloud.debug = DEBUG;
  }
}

function createBigCloud() {
  // every 15 seconds
  if (frameCount % (FRAME_RATE*15) == 0 && missileCount > 0) {
    let directions = ['right', 'left'];
    let direction = random(directions); // Choose direction
    if (direction == 'right') {
      x = - 400;
      angle = 0;
    } else if (direction == 'left') {
      x = CANVAS_WIDTH + 400;
      angle = 180;
    }
    let y = random(CANVAS_HEIGHT*0.3, CANVAS_HEIGHT*0.5);
    let cloud = createSprite(x, y, 1000, 456);
    cloud.setSpeed(2, angle);
    cloud.life = 2000;
    cloud.addAnimation('bigCloud', bigCloudImg1, bigCloudImg2);
    cloud.debug = DEBUG;
    bigCloudGroup.add(cloud);
  }

}

function createPlatforms() {
  platform1 = createSprite(CANVAS_WIDTH*0.1, CANVAS_HEIGHT - 30, 40, 40);
  platform2 = createSprite(CANVAS_WIDTH/2, CANVAS_HEIGHT - 30, 40, 40);
  platform3 = createSprite(CANVAS_WIDTH*0.9, CANVAS_HEIGHT - 30, 40, 40);
  platform1.addImage(platformImg);
  platform2.addImage(platformImg);
  platform3.addImage(platformImg);
  platformGroup.add(platform1);
  platformGroup.add(platform2);
  platformGroup.add(platform3);
  platformGroup.debug = DEBUG;
  platform1.missiles = missileSupply;
  platform2.missiles = missileSupply;
  platform3.missiles = missileSupply;
}
function createCities() {
  city1 = createSprite(CANVAS_WIDTH*0.2, CANVAS_HEIGHT - 30, 40, 40);
  city2 = createSprite(CANVAS_WIDTH*0.3, CANVAS_HEIGHT - 30, 40, 40);
  city3 = createSprite(CANVAS_WIDTH*0.4, CANVAS_HEIGHT - 30, 40, 40);
  city4 = createSprite(CANVAS_WIDTH*0.6, CANVAS_HEIGHT - 30, 40, 40);
  city5 = createSprite(CANVAS_WIDTH*0.7, CANVAS_HEIGHT - 30, 40, 40);
  city6 = createSprite(CANVAS_WIDTH*0.8, CANVAS_HEIGHT - 30, 40, 40);
  city1.addImage(cityImg);
  city2.addImage(cityImg);
  city3.addImage(cityImg);
  city4.addImage(cityImg);
  city5.addImage(cityImg);
  city6.addImage(cityImg);
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
  ground.addImage(groundImg);
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

// Launch a missile from one of platforms
function launchMissile(x, y) {
  if (! (platform1.missiles <= 0 && platform2.missiles <= 0 && platform3.missiles <= 0)) {

    target = createSprite(x, y, 10, 10);
    target.addImage(targetImg);
    targetGroup.add(target);

    // Select which platform to launch
    if (x < CANVAS_WIDTH*0.3 && platform1.missiles > 0
      || x < CANVAS_WIDTH*0.7 && platform2.missiles == 0 && platform1.missiles > 0
      || platform2.missiles == 0 && platform3.missiles == 0) {
      // from Platform 1
      fromX = platform1.position.x;
      fromY = platform1.position.y;
      platform1.missiles--;
      shootBullet(fromX, fromY, x, y);
    } else if (x > CANVAS_WIDTH*0.7 && platform3.missiles > 0
      || platform1.missiles == 0 && platform2.missiles == 0) {
      // from Platform 3
      fromX = platform3.position.x;
      fromY = platform3.position.y;
      platform3.missiles--;
      shootBullet(fromX, fromY, x, y);
    } else if (x > CANVAS_WIDTH*0.3 && x < CANVAS_WIDTH*0.7 && platform2.missiles > 0
      || x < CANVAS_WIDTH*0.3 && platform1.missiles == 0 && platform2.missiles > 0
      || x > CANVAS_WIDTH*0.7 && platform3.missiles == 0 && platform2.missiles > 0) {
      // from Platform 2
      fromX = platform2.position.x;
      fromY = platform2.position.y;
      platform2.missiles--;
      shootBullet(fromX, fromY, x, y);
    }
  }
}

// Shoot a bullet 
function shootBullet(fromX, fromY, x, y) {
  let bullet = createSprite(fromX, fromY, 5, 5);
  bullet.attractionPoint(20, x, y);
  bullet.rotateToDirection = true;
  bullet.addAnimation('shooting', shootingImg1, shootingImg2, shootingImg3);
  bulletGroup.add(bullet);
  shootSound.play();
}

function removeMissile(missile) {
  missile.remove();
}

// Remove missile and give point to player
function killMissile(missile) {
  missile.remove();
  currentPlayer.currentScore++;
}

function killPlatform(bullet, target) {
  explode(bullet, target);
  target.missiles = 0;
}

function explode(bullet, target) {
  x = target.position.x;
  y = target.position.y;
  bullet.remove();
  target.remove();

  explosion = createSprite(x, y, 50, 50);
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
  // Sound
  popSound.play();
}

function monitorCities() {
  let removedCities = 0;
  for (let i = 0; i < cityGroup.length; i++) {
    if (cityGroup[i].removed) {
      removedCities++;
    }
  }
  if (removedCities == cityGroup.length && showGame == true) {
    gameEnd();
  }
}

function monitorMissiles() {
  if (missileCount >= maxMissiles && showGame == true) {
    // Completed the level 
    fanfareSound.play();
    gameLevel++;
    resetGame();
    showLevelUp = true;
  }
}

function displayLevelUp() {
  if (showLevelUp) {
    showGame = false;
    fill(0);
    stroke(0);
    textSize(100);
    textAlign(CENTER, CENTER);
    text('Well done, ' + currentPlayer.playerName + '!', CANVAS_WIDTH/2, CANVAS_HEIGHT*0.2);
    textSize(100);
    text('Score: ' + currentPlayer.currentScore, CANVAS_WIDTH/2, CANVAS_HEIGHT*0.4);
    if (gameLevel == 10) {
      text('Mission Accomplished!', CANVAS_WIDTH/2, CANVAS_HEIGHT*0.6);
    } else {
    startButton.position(CANVAS_WIDTH/2 - startButton.size().width/2, CANVAS_HEIGHT*0.6);
    startButton.style('font-size', '30px');
    }
    textSize(30);
    text('key [ESC] Main Menu', CANVAS_WIDTH/2, CANVAS_HEIGHT*0.8);
  }
}

function resetGame() {
  missileGroup.removeSprites();
  explosionGroup.removeSprites();
  bulletGroup.removeSprites();
  targetGroup.removeSprites();
  platformGroup.removeSprites();
  cityGroup.removeSprites();
  bigCloudGroup.removeSprites();

  missileCount = 0;

  // Change difficulities by level
  missileSupply = int(MISSILE_SUPLY * (1 - (gameLevel * 0.05)));
  rateMissile = int(MISSILE_RATE * (1 - (gameLevel * 0.05)));
  maxMissiles = int(MAX_MISSILES + MAX_MISSILES * gameLevel * 0.1);
  bigCloudCount = gameLevel + 1;

  setUpGame();
}

function gameEnd() {
  showGame = false;
  gameoverSound.play();
  fill(0);
  stroke(0);
  textSize(150);
  textAlign(CENTER, BOTTOM);
  text('Game Over', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
  noLoop();
}

function gameInfoBar() {
  noStroke();
  fill(230, 230, 230, 150);
  rect(CANVAS_WIDTH/2, 20, CANVAS_WIDTH, 40);
  fill(0);
  textSize(20);
  textAlign(LEFT, CENTER);
  text('Player: ' + currentPlayer.playerName, 20, 12);
  textAlign(CENTER, CENTER);
  text('Score: ' + currentPlayer.currentScore, CANVAS_WIDTH*0.3, 12);
  textAlign(CENTER, CENTER);
  text('Level: ' + gameLevel, CANVAS_WIDTH*0.6, 12);
  // Display remaining missiles
  let remainMissiles =  maxMissiles - missileCount;
  textAlign(RIGHT, CENTER);
  text(remainMissiles + ' missiles coming', CANVAS_WIDTH - 20, 12);
}

function platformInfo() {
  noStroke();
  fill(0);
  textSize(16);
  textAlign(CENTER, CENTER);

  let array = platformGroup;
  for (i = 0; i < platformGroup.length; i++) {
    let platform = platformGroup[i];
    if (!platform.removed) {
      text(platform.missiles, platform.position.x, platform.position.y);
    }

  }
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
      showLevelUp = false;
      //noLoop();
    } else {
      showMainMenu = false;
      hideGUI(); // Hide button and input
      //loop();
    }
  } else if (key === '1') {
    if (showMainMenu) {
      showLeaderboard = true;
      showMainMenu = false; 
    } else if (showLeaderboard) {
      showMainMenu = true;
      showLeaderboard = false;
    }
  } else if (key === '2') {
    if (showMainMenu) {
      showCredits = true;
      showMainMenu = false; 
    } else if (showCredits) {
      showMainMenu = true;
      showCredits = false;
    }
  }
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

///
/// Scenes
///

// Segue to Game
function segueToGame() {
  showMainMenu = false;
  showLevelUp = false;
  hideGUI(); // Hide button and input
  showCountdown = true;
  if (!currentPlayer) {
    currentPlayer = createPlayer(nameInput.value(), null, 0);
  }
}

// Game
function displayGame() {
  monitorCities();
  monitorMissiles();
  if (showGame) {
    incomingMissiles();
    bulletGroup.collide(targetGroup, explode);
    createCloud();
    createBigCloud();
    gameInfoBar();
    platformInfo();
  }
}

// Leaderboard Scene
function displayLeaderboard() {
  if (showLeaderboard) {
    hideGUI(); // Hide button and input
    let menuBoxTop = CANVAS_HEIGHT*0.15;
    noStroke();
    fill(230, 230, 230, 200);
    rect(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_WIDTH*0.6, CANVAS_HEIGHT - menuBoxTop*2);
    noStroke();
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(40);
    text('- Leaderboard -', CANVAS_WIDTH/2, menuBoxTop + 50);
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
        text(rank + '. ' + score + ' points by ' + name, CANVAS_WIDTH/2, menuBoxTop + 150 + 50*i);
      }
    }
    text('key [1] Back to menu', CANVAS_WIDTH/2, CANVAS_HEIGHT*0.75);
  }
}

// Leaderboard Scene
function displayCredits() {
  if (showCredits) {
    hideGUI(); // Hide button and input
    let menuBoxTop = CANVAS_HEIGHT*0.15;
    noStroke();
    fill(230, 230, 230, 200);
    rect(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_WIDTH*0.6, CANVAS_HEIGHT - menuBoxTop*2);
    noStroke();
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(40);
    text('- Credits -', CANVAS_WIDTH/2, menuBoxTop + 50);
    textSize(20);
    let gap = 25;
    let startLine = menuBoxTop + 150;

    text('Sound: air-pump-short by TheLukasBanana (CC BY 3.0)', CANVAS_WIDTH/2, startLine);
    text('https://freesound.org/s/417217/', CANVAS_WIDTH/2, startLine + gap);
    text('Sound: game-over03 by notchfilter (CC BY 3.0)', CANVAS_WIDTH/2, startLine + gap*2);
    text('https://freesound.org/s/43698/', CANVAS_WIDTH/2, startLine + gap*3);
    text('Sound: fanfare-rpg by colorsCrimsonTears (CC0 1.0)', CANVAS_WIDTH/2, startLine + gap*4);
    text('https://freesound.org/s/566203/', CANVAS_WIDTH/2, startLine + gap*5);
    text('Sound: simple-pop-sound by SplendidJams (CC0 1.0)', CANVAS_WIDTH/2, startLine + gap*6);
    text('https://freesound.org/s/570459/', CANVAS_WIDTH/2, startLine + gap*7);
    text('Thank you for your kindness!', CANVAS_WIDTH/2, startLine + gap*9);

    text('key [2] Back to menu', CANVAS_WIDTH/2, CANVAS_HEIGHT*0.75);
  }
}
// Main Menu
function displayMainMenu() {
  if (showMainMenu) {
    let menuBoxTop = CANVAS_HEIGHT*0.15;
    noStroke();
    fill(230, 230, 230, 200);
    rect(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_WIDTH*0.6, CANVAS_HEIGHT - menuBoxTop*2);
    noStroke();
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(50);
    text(GAME_TITLE, CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 200);
    if (!currentPlayer) {
      textSize(30);
      text('Type your name', CANVAS_WIDTH/2, CANVAS_HEIGHT*0.4);
      nameInput.position(CANVAS_WIDTH/2 - nameInput.size().width/2, CANVAS_HEIGHT*0.4 + 50);
      nameInput.style('font-size', '30px');
    } else {
      textSize(40);
      text('Hello, ' + currentPlayer.playerName, CANVAS_WIDTH/2, CANVAS_HEIGHT*0.4);
    }
    startButton.position(CANVAS_WIDTH/2 - startButton.size().width/2, CANVAS_HEIGHT*0.4 + 100);
    startButton.style('font-size', '30px');
    textSize(30);
    text('key [1] Leaderboard', CANVAS_WIDTH/2, CANVAS_HEIGHT*0.7);
    text('key [2] Credits', CANVAS_WIDTH/2, CANVAS_HEIGHT*0.7 + 50);
    //text('key [4] Mute Sound', CANVAS_WIDTH/2, CANVAS_HEIGHT*0.6 + 100);
  }
}

// Splash Scene
function displaySplash() {
  if (showSplash) {
    //background(255);
    noStroke();
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(50);
    text(GAME_TITLE, CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 200);
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
    textAlign(CENTER, CENTER);
    textSize(400);
    text(countDown, CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 200);
    if (frameCount % FRAME_RATE == 0 && countDown > 0) {
      countDown--;
    } else if (countDown == 0) {
      showGame = true;
      showCountdown = false;
    }
  }
}



