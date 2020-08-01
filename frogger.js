// Name any p5.js functions we use in the global so Glitch can recognize them.
/* global
 *    createCanvas, background
 *    colorMode, HSB, fill
 *    ellipse, rect
 *    random
 *    width, height
 *    keyCode, UP_ARROW
 *    text, textSize
 *    collideRectCircle
 *    collideCircleCircle
 *    stroke,
 *    noStroke,
 *    strokeWeight,
 *    line,
 *    triangle
 *    soundFormats, loadSound
 */

class FRGame {
  constructor(){
    this.backgroundColor, this.frogX, this.frogY, this.score, this.lives, this.car1X, this.car1Y, this.car1V;
    this.car2X, this.car2Y, this.car2V, this.car3X, this.car3Y, this.car3V, this.logX, this.logY, this.logV, this.log2X;
    this.hit, this.hit2, this.hit3, this.end, this.time, this.logHit,  this.logHit2, this.waterHit;
  }
  startUp() {
    // Canvas & color settings
    createCanvas(400, 500);
    colorMode(HSB, 360, 100, 100);
    this.backgroundColor = 95;
    this.frogX = random(20, width-20);
    this.frogY = 465;
    this.score = 0;
    this.lives = 3;
    // this.gameIsOver = false;
    this.car1X = 0;
    this.car1Y = 100;
    this.car1V = 4;
    this.car2X = 0;
    this.car2Y = 160;
    this.car2V = -3;
    this.car3X = 0;
    this.car3Y = 220;
    this.car3V = 2.5;
    this.time = 75;
    this.logX = 0;
    this.log2X = width/2;
    this.logY = 303;
    this.logV = 50;
  }

  drawFrame() {
      background(this.backgroundColor);
      this.drawBackground();
      stroke('black')
      // Code for gold goal line
      fill(60, 80, 80);
      rect(0, 0, width, 50);
      // Code to display Frog
      this.moveCars();
      this.drawCars();
      this.checkCollisions();
      this.checkWin();
      this.displayScores();
      this.moveLog();
      fill(120, 80, 80);
      ellipse(this.frogX, this.frogY, 20);
  }

  moveCars() {
    // Move the car
    if(this.car1X < width){
      this.car1X += this.car1V
    }
    // Reset if it moves off screen
    else{
      this.car1X = 0
    }

    if(this.car2X > -40)
      this.car2X += this.car2V
    else
      this.car2X = width

    if(this.car3X < width)
      this.car3X += this.car3V
    else
      this.car3X = 0
  }

  drawCars() {
    // Code for car 1
    fill(0, 80, 80);
    rect(this.car1X, this.car1Y, 40, 30);
    fill(200, 80, 80)
    if(this.score > 0)
      rect(this.car2X, this.car2Y, 40, 30);
    fill(0, 0, 80)
    if(this.score > 1)
      rect(this.car3X, this.car3Y, 40, 30);
    // Code for additional cars
  }

  checkCollisions() {
    // If the frog collides with the car, reset the frog and subtract a life.
    this.hit = collideRectCircle(this.car1X, this.car1Y, 40, 30, this.frogX, this.frogY, 20);
    this.hit2 = collideRectCircle(this.car2X, this.car2Y, 40, 30, this.frogX, this.frogY, 20) && this.score > 0;
    this.hit3 = collideRectCircle(this.car3X, this.car3Y, 40, 30, this.frogX, this.frogY, 20) && this.score > 1;

    if(this.hit || this.hit2 || this.hit3){
      this.lives--;
      this.frogX = random(20, width-20);
      this.frogY = 465;
    }
  }

  checkWin() {
    // If the frog makes it into the yellow gold zone, increment the score
    // and move the frog back down to the bottom.
    this.end = collideRectCircle(0, 0, width, 50, this.frogX, this.frogY, 20);

    if(this.end){
      this.score++;
      this.frogX = random(20, width-20);
      this.frogY = 465;
      if(this.score > 3){
        this.car1V++;
        this.car2V--;
        this.car3V++;
      }
    }

    // if(this.score >= 5){
    //   this.gameIsOver = true
    //   text("YOU WIN!", 100, 100);
    // }
  }

  displayScores() {
    textSize(12);
    fill(0);
    // Display Lives
    text(`Lives: ${this.lives}`, 10, 20);
    // Display Score
    text(`Score: ${this.score}`, 10, 40);
    // Display game over message if the game is over
    if(this.lives <= 0){
      this.gameOver()
      // text("GAME OVER", 100, 100);
    }
  }
  
    gameOver() {
    // if (this.score > this.highScore){
    //   this.highScore = this.score;
    // }
    noLoop();
    textAlign(CENTER);
    textSize(32);
    textStyle(BOLD)
    text("Game Over", width / 2, height / 2);
    // textSize(12);
    // textStyle(NORMAL)
    // text("Hit the space bar to play again!", width / 2, height / 2 + 20);
  }

  drawBackground(){
    stroke('black')
    fill('gold')
    strokeWeight(4)
    line(0, 90, width, 90)
    line(0, 140, width, 140)
    if(this.score > 0)
      line(0, 205, width, 205)
    if(this.score > 1)
      line(0, 265, width, 265)
    strokeWeight(2);
    for(let i=15; i < width+30; i+=80){
      rect(i, 110, 50, 10)
      if(this.score > 0)
        rect(i-30, 170, 50, 10)
      if(this.score > 1)
        rect(i-10, 230, 50, 10)
    }
    strokeWeight(1);

    noStroke()
    if(this.score > 2){
      fill('cyan')
      rect(0, 300, width, 30)
      fill(120, 80, 30);
      triangle(0, 280, 0, 300, width+200, 300)
      triangle(0, 350, 0, 330, width+200, 330)
    }
  }

  moveLog(){
    if(this.time > 0){
      this.time--;
    }
    else{
      this.time = 75;
      this.logX+=this.logV
    }

    if(this.time == 37){
      this.log2X+=this.logV
    }

    if(this.logX >= width+60){
      this.logX = 0
    }
    if(this.log2X >= width+60){
      this.log2X = 0
    }

    if(this.score > 2){
      fill(20, 80, 50)
      rect(this.logX, this.logY, 60, 24)
      rect(this.log2X, this.logY, 60, 24)
      stroke(20, 80, 10)
      line(this.logX, this.logY+5, this.logX+50, this.logY+5)
      line(this.logX+15, this.logY+15, this.logX+60, this.logY+15)
      line(this.log2X+20, this.logY+8, this.log2X+50, this.logY+8)
      line(this.log2X, this.logY+18, this.log2X+45, this.logY+18)
    }

    this.logHit = collideRectCircle(this.logX, this.logY, 60, 24, this.frogX, this.frogY, 20)
    this.logHit2 = collideRectCircle(this.log2X, this.logY, 60, 24, this.frogX, this.frogY, 20)
    this.waterHit = collideRectCircle(0, 300, width, 30, this.frogX, this.frogY, 20)

    if(this.waterHit && !this.logHit && !this.logHit2 && this.score > 2){
      this.lives--;
      this.frogX = random(20, width-20);
      this.frogY = 465;
    }
  }
}
