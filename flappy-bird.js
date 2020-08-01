// Name any p5.js functions we use in the global so Glitch can recognize them.
/* global
 *    createCanvas, background, flappybirdGame
 *    colorMode, HSB
 *    frameRate,
 *    width, height,
 *    rect,
 *    stroke, noStroke, noFill, fill
 *    keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW
 *    text, random, collideRectRect, frameCount, key, circle, collideRectCircle
 *    textAlign, textStyle, textSize, LEFT, CENTER, BOLD, NORMAL, noLoop, loop
 */

class FBGame {
  constructor(){
    this.bird;
    this.pipes = [];
    this.score = 0
    this.highScore = 0;
    this.restartButton;
  }

  startUp() {
    createCanvas(640, 480);
    this.bird = new Bird();
    this.pipes.push(new Pipe());
  }

  drawFrame() {
    background(14, 175, 255);

    for (var i = this.pipes.length - 1; i >= 0; i--) {
      this.pipes[i].show();
      this.pipes[i].update();

      if (this.pipes[i].hits(this.bird)) {
        console.log('HIT');
      }

      if (this.pipes[i].behindBird(this.bird)){
        this.score += 1;
      }

      if (this.pipes[i].offscreen()) {
        this.pipes.splice(i, 1);
      }
    }

    this.bird.update();
    this.bird.show();

    if (frameCount % 75 == 0) {
      this.pipes.push(new Pipe());
    }
    this.display();  
    
    if(this.upward){
      this.bird.up()
      this.upward = false;
    }
    
    if(this.restartGameNow){
      this.restartGame()
      this.restartGameNow = false;
    }
  }


  display() {
    textAlign(LEFT);
    textSize(12);
    textStyle(NORMAL)
    console.log('displaying score');
    fill('black');
    text(`Score: ${this.score}`, 10, 20);
    text(`High Score: ${this.highScore}`, 10, 40);
  }

  restartGame() {
    this.score = 0;
    this.bird = new Bird();
    this.pipes = [];
    loop();
  }

  gameOver() {
    if (this.score > this.highScore){
      this.highScore = this.score;
    }
    noLoop();
    fill("black")
    textAlign(CENTER);
    textSize(32);
    textStyle(BOLD)
    text("Game Over", width / 2, height / 2);
    textSize(12);
    textStyle(NORMAL)
    text("Hit the 'R' key to play again!", width / 2, height / 2 + 20);
    
    // this.restartButton = createButton("Play Again!")
    // this.restartButton.position(100, 240);
    // this.restartButton.size(100, 50);
    // this.restartButton.mousePressed(this.restartGame());
  }
}

class Bird{
  constructor(){
    this.y = height / 2;
    this.x = 64;
    this.r = 16
    this.gravity = .85;
    this.lift = -14;
    this.velocity = 0;
  }
  
  show(){
    fill("yellow");
    circle(this.x, this.y, 2 * this.r);
  }
  
  up(){
    this.velocity += this.lift;
  }
  
  update(){
    this.velocity += this.gravity;
    this.y += this.velocity;

    if (this.y + this.r > height) {
      flappybirdGame.gameOver();
    }

    if (this.y - this.r < 0) {
      flappybirdGame.gameOver();
    }
  }
}

class Pipe{
  constructor(){
    this.spacing = random(3.5 * 32, 7 * 32);
    this.top = random(height / 12, (3 / 4) * height);
    this.bottom = height - (this.top + this.spacing); 
    this.x = width;
    this.w = 80;
    this.speed = 6;
    this.highlight = false;
    this.timesPassed = 0;
  }
  
  hits(bird){
    let hit = collideRectCircle(this.x, 0, this.w, this.top, bird.x, bird.y, 32) ||
                collideRectCircle(this.x, height - this.bottom, this.w, this.bottom, bird.x, bird.y, 32)
    if (hit) {
      flappybirdGame.gameOver();
    }
  }
  
  show(){
    fill(40, 255, 60);
    if (this.highlight) {
      fill(255, 0, 0);
    }
    rect(this.x, 0, this.w, this.top);
    rect(this.x, height - this.bottom, this.w, this.bottom); 
  }
  
  update(){
    this.x -= this.speed;
  }
  
  offscreen(){
    return(this.x < -this.w)
  }
  
  behindBird(bird){
    if (bird.x > (this.x + this.w)){
      this.timesPassed += 1;
    }
    if (this.timesPassed == 1){
      return true
    }
    else{
      return false
    }
  }
}
