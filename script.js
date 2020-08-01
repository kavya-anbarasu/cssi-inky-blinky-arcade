/* global
    createCanvas, background, height, fill, ellipse, RIGHT_ARROW
    keyCode, UP_ARROW, colorMode, RGB, color, rect, width, height, noStroke, get
    collideCircleCircle, mouseX, mouseY, noFill, stroke, strokeWeight, text
    textSize, LEFT_ARROW, DOWN_ARROW, collideRectRect, collideRectCircle,
    HALF_PI, QUARTER_PI, arc, PI, key
    PMGame, FBGame, SNGame, FRGame, FPplau, PPlay, FrPlay, SPlay createButton
*/

include("flappy-bird.js");
include("frogger.js");
include("snake.js");
include("pacman.js");

let pacmanGame, snakeGame, flappybirdGame, froggerGame;
let thePac, theSnake, theFlap, theFrog;
let started, pause;
let PPlay, FPlay;


function setup() {
  thePac = false;
  theSnake = false;
  theFlap = false;
  // theFrog = false;
  started = false;
  pause = false;
  
  createCanvas(450, 300);
  pacmanGame = new PMGame();
  flappybirdGame = new FBGame();
  snakeGame = new SNGame();
  froggerGame = new FRGame();

  //start button and text
  PPlay = createButton("PACMAN")
  PPlay.position(105, 240);
  PPlay.size(300, 50);
  PPlay.mousePressed(Pplay);


  FrPlay = createButton("FROGGER")
  FrPlay.position(305, 300);
  FrPlay.size(100, 25);
  FrPlay.mousePressed(Frplay);
  
  SPlay = createButton("SNAKE")
  SPlay.position(105, 300);
  SPlay.size(100, 25);
  SPlay.mousePressed(Splay);
  
    
  FPlay = createButton("FLAPPY BIRD")
  FPlay.position(198, 300);
  FPlay.size(110, 25);
  FPlay.mousePressed(Fplay);

}

function Pplay() {
  started = true;
  thePac = true;
  text.hide();
}

function Fplay() {
  started = true;
  theFlap = true;
  text.hide();
}

function Frplay() {
  started = true;
  theFrog = true;
  text.hide();
}

function Splay() {
  started = true;
  theSnake = true;
  text.hide();
}
function draw() {
  // if(!pause){
    background("black");
    noFill();
    stroke(0, 0, 255);
    strokeWeight(10);
    rect(0, 0, 450, 300);
    strokeWeight(4);
    fill("White");
    textSize(40);
    text("WELCOME TO", 85, 50);
    textSize(60);
    fill("Cyan");
    text("INKY", 40, 120);
    fill("Red");
    text("BLINKY", 205, 120);
    fill("White");
    text("ARCADE", 98, 185);
    strokeWeight(0);

    if (started) {
      // started = true;
      PPlay.hide();
      FPlay.hide();
      FrPlay.hide();
      SPlay.hide();
      if (thePac) pacmanGame.startUp();
      if (theFlap) flappybirdGame.startUp();
      if (theSnake) snakeGame.startUp();
      if (theFrog) froggerGame.startUp();
      started=false;
    }
  // console.log("the Pac");
  // console.log(thePac);
  
    if (thePac) pacmanGame.drawFrame();
    if (theFlap) flappybirdGame.drawFrame();
    if (theSnake) snakeGame.drawFrame();
    if (theFrog) froggerGame.drawFrame();
  // }
  // else{
  //   textSize(50);
  //   text("PAUSE", width/4, height/2)
  // }
}



function keyPressed() {
  //change Pacman's direction
  if(key == "p" && pause){
    pause = false;
  }
  else if(!pause){
    pause = true;
  }
  if (thePac) {
    if (keyCode === RIGHT_ARROW) {
      pacmanGame.pacman.direction = 0;
    } else if (keyCode === DOWN_ARROW) {
      pacmanGame.pacman.direction = 270;
    } else if (keyCode === LEFT_ARROW) {
      pacmanGame.pacman.direction = 180;
    } else if (keyCode === UP_ARROW) {
      pacmanGame.pacman.direction = 90;
    }

    if (
      keyCode === RIGHT_ARROW ||
      keyCode === DOWN_ARROW ||
      keyCode === LEFT_ARROW ||
      keyCode === UP_ARROW
    )
      pacmanGame.pacTurn = true;
  } 

  if (theFlap) {
    if (key == " ") {
      flappybirdGame.bird.up();
      //console.log("SPACE");
    } else if (key === "r") {
      flappybirdGame.restartGame();
    }
  }

  if (theSnake) {
    console.log("key pressed: ", keyCode);
    if (keyCode === UP_ARROW && snakeGame.playerSnake.direction != "S") {
      snakeGame.playerSnake.direction = "N";
    } else if (
      keyCode === DOWN_ARROW &&
      snakeGame.playerSnake.direction != "N"
    ) {
      snakeGame.playerSnake.direction = "S";
    } else if (
      keyCode === RIGHT_ARROW &&
      snakeGame.playerSnake.direction != "W"
    ) {
      snakeGame.playerSnake.direction = "E";
    } else if (
      keyCode === LEFT_ARROW &&
      snakeGame.playerSnake.direction != "E"
    ) {
      snakeGame.playerSnake.direction = "W";
    } else if (keyCode === 32) {
      snakeGame.restartGame();
    } else {
      console.log("wrong key");
    }
  }

  if (theFrog) {
    if (keyCode === UP_ARROW) froggerGame.frogY -= 30;
    if (keyCode === DOWN_ARROW) froggerGame.frogY += 30;
    if (keyCode === RIGHT_ARROW) froggerGame.frogX += 30;
    if (keyCode === LEFT_ARROW) froggerGame.frogX -= 30;
  }
}

function include(file) {
  var script = document.createElement("script");
  script.src = file;
  script.type = "text/javascript";
  script.defer = true;

  document
    .getElementsByTagName("head")
    .item(0)
    .appendChild(script);
}

function difference(setA, setB) {
  let _difference = new Set(setA);
  for (let elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}
