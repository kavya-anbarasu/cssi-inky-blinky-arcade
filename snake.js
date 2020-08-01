// Name any p5.js functions we use in the global so Glitch can recognize them.
/* global
 *    createCanvas, background
 *    colorMode, HSB
 *    frameRate,
 *    width, height,
 *    rect,
 *    stroke, noStroke, noFill, fill
 *    keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW
 *    text, random, collideRectRect
 *    textAlign, textStyle, textSize, LEFT, CENTER, BOLD, NORMAL, noLoop, loop
 *    snakeGame
 */

class SNGame{
  constructor(){
    this.backgroundColor;
    this.playerSnake;
    this.currentApple;
    this.score;
    this.lives;
    this.frate;
    this.timer;
    this.frp;
    this.totTime;
    this.highScore;
  }
  
  startUp() {
    // Canvas & color settings
    createCanvas(400, 400);
    colorMode(HSB, 360, 100, 100);
    this.backgroundColor = 95;
    this.frate = 12;
    this.frp = 0;
    this.timer = 30;
    this.totTime = 30;
    this.playerSnake = new Snake();
    this.currentApple = new Apple();
    this.score = 0;
    this.highScore = 0;
  }

  drawFrame() {
    background(this.backgroundColor);
    frameRate(this.frate);
    // The snake performs the following four methods:
    this.playerSnake.moveSelf();
    this.playerSnake.showSelf();
    this.playerSnake.checkCollisions();
    this.playerSnake.checkApples();
    // The apple needs fewer methods to show up on screen.
    this.currentApple.showSelf();
    // We put the score and timer in its own function for readability.
    this.display();
    this.frp += 1;
    if (this.frp == this.frate){
      this.frp = 0
      this.timer -= 1;
    }
    if (this.timer <= 0){
      this.gameOver();
    }
  }

  display() {
    textAlign(LEFT);
    textSize(12);
    textStyle(NORMAL)
    console.log('displaying score');
    fill('black');
    text(`Score: ${this.score}`, 10, 20);
    text(`High Score: ${this.highScore}`, 70, 20);
    text(`Apple Expires in: ${this.timer}`, 10, 40);
  }

  resetTimer(){
    if (this.score < 10){
      this.timer = 30;
      this.totTime = 30;
    }
    else if (this.score < 20){
      this.timer = 25
      this.totTime = 25;
    }
    else if (this.score < 30){
      this.timer = 20
      this.totTime = 20;
    }
    else if (this.score < 40){
      this.timer = 15
      this.totTime = 15;
    }
    else{
      this.timer = 10
      this.totTime = 10;
    }
  }

  restartGame() {
    this.score = 0;
    this.frate = 12;
    this.resetTimer();
    this.playerSnake = new Snake();
    this.currentApple = new Apple();
    loop();
  }

  gameOver() {
    if (this.score > this.highScore){
      this.highScore = this.score;
    }
    noLoop();
    textAlign(CENTER);
    textSize(32);
    textStyle(BOLD)
    text("Game Over", width / 2, height / 2);
    textSize(12);
    textStyle(NORMAL)
    text("Hit the space bar to play again!", width / 2, height / 2 + 20);
  }
}

class Snake {
  constructor() {
    this.size = 10;
    this.x = width/2;
    this.y = height - 10;
    this.direction = 'N';
    this.speed = 12;
    this.tail = []; // Array of TailSegment
  }

  moveSelf() {
    if (this.tail.length > 0) {
      // Before moving the head, update the tail segments.
      // Take the segment at the back of the tail off.
      this.tail.pop();

      // Add a new segment at the front, which is where the
      // head (this.x, this.y) is now.
      let frontSegment = new TailSegment(this.x, this.y);
      this.tail.unshift(frontSegment);
    }
    
    
    if (this.direction === "N") {
      this.y -= this.speed;
    } else if (this.direction === "S") {
      this.y += this.speed;
    } else if (this.direction === "E") {
      this.x += this.speed;
    } else if (this.direction === "W") {
      this.x -= this.speed;
    } else {
      console.log("Error: invalid direction");
    }
  }

  showSelf() {
    // stroke(240, 100, 100);
    noStroke();
    fill('black');
    rect(this.x, this.y, this.size, this.size);
    noStroke();
    
    // Show its tail
    for (let i = 0; i < this.tail.length; i++) {
      this.tail[i].showSelf();
    }
  }

  checkApples() {
    let snakeEatsApple = collideRectRect(
        this.x, this.y, 
        this.size, this.size, 
        snakeGame.currentApple.x, snakeGame.currentApple.y, 
        snakeGame.currentApple.size, snakeGame.currentApple.size);
    if (snakeEatsApple) {
      snakeGame.score++;
      snakeGame.currentApple = new Apple();
      this.extendTail();
      if (snakeGame.score % 5 == 0){
        snakeGame.frate += 2;
      }
      snakeGame.resetTimer();
    }
  }

  checkCollisions() {
    if (this.x < 0 || this.x + 10 > width || this.y < 0 || this.y + 10 > height){
      snakeGame.gameOver();
    }
    if (this.tail.length > 2) {
      for (let i=1; i < this.tail.length; i++) {
        if (this.x == this.tail[i].x && this.y == this.tail[i].y) {
          snakeGame.gameOver();
        }
      }
    }
  }

  extendTail() {
    this.tail.push(new TailSegment(this.x, this.y));
  }
}

class TailSegment {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.size = 9;
  }

  showSelf() {
    noStroke();
    fill('black');
    rect(this.x, this.y, this.size, this.size);
  }
}

class Apple {
  constructor() {
    this.x = random(width - 10);
    this.y = random(height - 10);
    this.size = 10;
  }

  showSelf() {
    noStroke();
    if (snakeGame.timer > (2 / 3 * snakeGame.totTime)){
      fill('red');
    }
    else if (snakeGame.timer > (1 / 3 * snakeGame.totTime)){
      fill('green');
    }
    else{
      fill('brown')
    }
    rect(this.x, this.y, this.size, this.size);
  }
}
