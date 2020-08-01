/* global
      createCanvas, background, height, fill, ellipse, RIGHT_ARROW
      keyCode, UP_ARROW, colorMode, RGB, color, rect, width, height, noStroke, get
      collideCircleCircle, mouseX, mouseY, noFill, stroke, strokeWeight, text
      textSize, LEFT_ARROW, DOWN_ARROW, collideRectRect, collideRectCircle,
      HALF_PI, QUARTER_PI, arc, PI, pacmanGame, noLoop, textAlign, CENTER, textStyle, BOLD;
  */

/*let pacmanGame;

function setup() {
  pacmanGame = new PMGame();
  pacmanGame.startUp();
}

function draw() {
  pacmanGame.drawFrame();
}

function keyPressed() {
  //change Pacman's direction
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

*/

class PMGame {
  constructor() {
    this.backColor;
    this.pacman;
    this.inky;
    this.blinky;
    this.dot;
    this.foodX;
    this.foodY;
    this.moving;
    this.direction;
    this.score;
    this.barriers;
    this.pacCollide;
    this.pacTurn;
    this.ghostCollide;
    this.powerUp;
    this.powerTime;
  }

  startUp() {
    createCanvas(450, 300);
    colorMode(RGB, 255, 255, 255, 255);

    this.backColor = color(0, 0, 0);
    this.foodX = 20;
    this.foodY = 20;
    this.moving = true;
    this.score = 0;
    this.lives = 3;
    this.powerUp = false;
    this.powerTime = 200;

    this.pacman = new Pacman();

    // inky = new Ghost(170, 100, "cyan");
    this.blinky = new Ghost(195, 55, "red");

    this.dot = [];

    for (let i = 0; i < 162; i++) {
      this.dot.push(new Food(this.foodX, this.foodY, i));

      if (this.foodX < 390) {
        this.foodX += 22;
      } else if (this.foodX > 390) {
        this.foodX = 20;
        this.foodY += 22;
      }
    }
  }

  drawFrame() {
    if (this.score < 100) {
      background(this.backColor);
      this.handleFood();
      this.drawMap();

      this.pacman.show();
      this.pacman.move();

      // inky.show();
      // inky.move(pacman);

      this.blinky.show();
      this.blinky.move(this.pacman);
      //Fake PacMan for testing
      // fill('gold')
      // ellipse(mouseX, mouseY, 20)
      
      this.pacman.touchGhost(this.blinky);
      // console.log(255 != get(96, 0)[2])
      this.showText();
      
      if(this.powerUp){
        this.powerTime--;
      }
      else{
        this.powerTime = 400;
      }
      
      if(this.powerTime <= 0)
        this.powerUp = false;
    }
  }

  drawMap() {
    //array holding all rectangles on map to check collisions with later on
    this.barriers = [];
    noFill();
    stroke(0, 0, 255);
    strokeWeight(10);

    //Outline of box
    rect(5, 4, 405, 211);
    this.barriers.push([5, 8, 405, 0]);
    this.barriers.push([8, 5, 0, 211]);
    this.barriers.push([407, 5, 0, 211]);
    this.barriers.push([5, 211, 405, 0]);

    //barriers.push([5, 5, 405, 211]);

    fill(0, 0, 255, 255);
    noStroke();

    //4 Pillars
    rect(101, 5, 14, 44, 0, 0, 90, 90);
    rect(101, 167, 14, 44, 90, 90, 0, 0);
    rect(299, 5, 14, 44, 0, 0, 90, 90);
    rect(299, 167, 14, 44, 90, 90, 0, 0);

    this.barriers.push([101, 5, 14, 44]);
    this.barriers.push([101, 167, 14, 44]);
    this.barriers.push([299, 5, 14, 44]);
    this.barriers.push([299, 167, 14, 44]);

    //L Shape Pieces
    rect(35, 35, 38, 14, 0, 90, 90, 0);
    rect(35, 35, 14, 57, 0, 0, 90, 90);
    rect(35, 167, 38, 14, 0, 90, 90, 0);
    rect(35, 123, 14, 56, 90, 90, 0, 0);
    rect(341, 35, 38, 14, 90, 0, 0, 90);
    rect(365, 35, 14, 57, 0, 0, 90, 90);
    rect(341, 167, 38, 14, 90, 0, 0, 90);
    rect(365, 123, 14, 56, 90, 90, 0, 0);

    this.barriers.push([35, 35, 38, 14]);
    this.barriers.push([35, 35, 14, 57]);
    this.barriers.push([35, 167, 38, 14]);
    this.barriers.push([35, 123, 14, 56]);
    this.barriers.push([341, 35, 38, 14]);
    this.barriers.push([365, 35, 14, 57]);
    this.barriers.push([341, 167, 38, 14]);
    this.barriers.push([365, 123, 14, 56]);

    //Long Middle Lines
    rect(145, 35, 122, 14, 90, 90, 90, 90);
    rect(145, 167, 122, 14, 90, 90, 90, 90);

    this.barriers.push([145, 35, 122, 14]);
    this.barriers.push([145, 167, 122, 14]);

    //Little Lines
    rect(77, 78, 38, 14, 90, 90, 90, 90);
    rect(77, 123, 38, 14, 90, 90, 90, 90);
    rect(299, 78, 38, 14, 90, 90, 90, 90);
    rect(299, 123, 38, 14, 90, 90, 90, 90);

    this.barriers.push([77, 78, 38, 14]);
    this.barriers.push([77, 123, 38, 14]);
    this.barriers.push([299, 78, 38, 14]);
    this.barriers.push([299, 123, 38, 14]);

    //Ghost Box
    rect(145, 78, 14, 58);
    rect(255, 78, 14, 58);
    rect(145, 78, 38, 14);
    rect(231, 78, 38, 14);
    rect(145, 123, 122, 14);

    this.barriers.push([145, 78, 14, 58]);
    this.barriers.push([255, 78, 14, 58]);
    this.barriers.push([145, 78, 38, 14]);
    this.barriers.push([231, 78, 38, 14]);
    this.barriers.push([145, 123, 122, 14]);

    fill(this.backColor);
    rect(183, 78, 48, 14);
    rect(160, 100, 94, 14);
  }

  handleFood() {
    for (let i = 0; i < 162; i++) {
      this.dot[i].checkHit();
      this.dot[i].show();
    }
  }

  showText() {
    textSize(25);
    fill(255, 255, 255);
    text("Score: " + this.score, 20, 250);
    text("Lives: " + this.pacman.lives, 20, 280); 
    
    if(this.powerUp){
      text("PowerUp Timer: " + this.powerTime, 170, 250)
    }
    // Display game over message if the game is over
    if(this.pacman.lives <= 0){
      this.gameOver();
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
  }
}

/*function difference(setA, setB) {
  let _difference = new Set(setA);
  for (let elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}*/


class Pacman {
  constructor() {
    this.x = 140;
    this.y = 60;
    this.size = 20;
    this.direction = 0;
    this.lastDir = 0;
    this.speed = 1;
    this.col = color("yellow");
    this.power = false;
    this.lives = 3;
  }

  show() {
    fill(this.col);
    ellipse(this.x, this.y, this.size);
  }

  move() {
    //Pacman moves by himself in the direction designated by the last arrow press
    if (!this.touchWalls()) {
      //This if makes it so Pacman won't be able to move until he turns
      if (this.direction == 0) {
        this.x += this.speed;
        this.lastDir = 0;
      }
      if (this.direction == 90) {
        this.y -= this.speed;
        this.lastDir = 90;
      }
      if (this.direction == 180) {
        this.x -= this.speed;
        this.lastDir = 180;
      }
      if (this.direction == 270) {
        this.y += this.speed;
        this.lastDir = 270;
      }
    } else if (pacmanGame.pacTurn) {
      if (this.lastDir == 0) this.x--;
      if (this.lastDir == 90) this.y++;
      if (this.lastDir == 180) this.x++;
      if (this.lastDir == 270) this.y--;
      pacmanGame.pacCollide = false;
      pacmanGame.pacTurn = false;
    }

    this.fixTurn();

    fill("black");
    if (this.lastDir == 0) {
      arc(this.x, this.y, 20, 20, QUARTER_PI - HALF_PI, QUARTER_PI);
    }
    if (this.lastDir == 90) {
      arc(this.x, this.y, 20, 20, QUARTER_PI - PI, QUARTER_PI - HALF_PI);
    }
    if (this.lastDir == 180) {
      arc(this.x, this.y, 20, 20, HALF_PI + QUARTER_PI, QUARTER_PI - PI);
    }
    if (this.lastDir == 270) {
      arc(this.x, this.y, 20, 20, QUARTER_PI, PI - QUARTER_PI);
    }
  }

  touchWalls() {
    for (let i = 0; i < pacmanGame.barriers.length; i++) {
      let hit1 = collideRectRect(
        pacmanGame.barriers[i][0],
        pacmanGame.barriers[i][1],
        pacmanGame.barriers[i][2],
        pacmanGame.barriers[i][3],
        this.x - 12,
        this.y - 3,
        1,
        6
      );
      let hit2 = collideRectRect(
        pacmanGame.barriers[i][0],
        pacmanGame.barriers[i][1],
        pacmanGame.barriers[i][2],
        pacmanGame.barriers[i][3],
        this.x + 12,
        this.y - 3,
        1,
        6
      );
      let hit3 = collideRectRect(
        pacmanGame.barriers[i][0],
        pacmanGame.barriers[i][1],
        pacmanGame.barriers[i][2],
        pacmanGame.barriers[i][3],
        this.x - 3,
        this.y - 12,
        6,
        1
      );
      let hit4 = collideRectRect(
        pacmanGame.barriers[i][0],
        pacmanGame.barriers[i][1],
        pacmanGame.barriers[i][2],
        pacmanGame.barriers[i][3],
        this.x - 3,
        this.y + 12,
        6,
        1
      );
      pacmanGame.pacCollide =
        pacmanGame.pacCollide || hit1 || hit2 || hit3 || hit4;
    }

    return pacmanGame.pacCollide;
  }

  fixTurn() {
    //Ensures Pacman doesn't get stuck turning left or right
    if (this.y < 26 && (this.direction == 0 || this.direction == 180))
      this.y = 21;
    if (
      this.y < 70 &&
      this.y > 56 &&
      (this.direction == 0 || this.direction == 180)
    )
      this.y = 63;
    if (
      this.y < 114 &&
      this.y > 100 &&
      (this.direction == 0 || this.direction == 180)
    )
      this.y = 107;
    if (
      this.y < 159 &&
      this.y > 145 &&
      (this.direction == 0 || this.direction == 180)
    )
      this.y = 152;
    if (this.y > 189 && (this.direction == 0 || this.direction == 180))
      this.y = 195;

    //Ensures Pacman doesn't get stuck turning up or down
    if (this.x < 26 && (this.direction == 90 || this.direction == 270))
      this.x = 21;
    if (
      this.x < 70 &&
      this.x > 56 &&
      (this.direction == 90 || this.direction == 270)
    )
      this.x = 63;
    if (
      this.x < 93 &&
      this.x > 79 &&
      (this.direction == 90 || this.direction == 270)
    )
      this.x = 86;
    if (
      this.x < 136 &&
      this.x > 122 &&
      (this.direction == 90 || this.direction == 270)
    )
      this.x = 129;
    if (
      this.x < 290 &&
      this.x > 274 &&
      (this.direction == 90 || this.direction == 270)
    )
      this.x = 283;
    if (
      this.x < 357 &&
      this.x > 343 &&
      (this.direction == 90 || this.direction == 270)
    )
      this.x = 350;
    if (
      this.x < 333 &&
      this.x > 319 &&
      (this.direction == 90 || this.direction == 270)
    )
      this.x = 326;
    if (this.x > 387 && (this.direction == 90 || this.direction == 270))
      this.x = 393;
  }

  touchGhost(ghost) {
    if (collideRectCircle(ghost.x, ghost.y, 20, 20, this.x, this.y, this.size)){
      if(!pacmanGame.powerUp){
        console.log("lost a life!");
        this.lives -= 1;
        this.x = 168;
        this.y = 152;
      }
      else{
        pacmanGame.score += 20;
        // this.x = 168;
        // this.y = 152;
        ghost.x = 195;
        ghost.y = 55;
      }
    }
    console.log("not touching ghost");
  }
}


class Ghost {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.v = .6;
    this.color = color;
    this.lastDirections = []; //using sets so that the difference function can be invoked
    this.lastLastDirections = [];
    this.moveFix = [];
  }

  show() {
    fill(this.color);
    rect(this.x, this.y, 20, 20, 90, 90, 0, 0);
  }

  move(pacman) {
    let movesTaken = 0; //variable to check if the ghost has moved yet this turn
    let movesAttempted = 0;

    pacmanGame.ghostCollide = false;
    
    console.log("(1) Last Last: " + this.lastLastDirections);
    console.log("(2) Move Fix: " + this.moveFix);
    
    //if pacman is to the left of the ghost, and there is no wall in the way, move left
    if (pacman.x < this.x) {
      this.lastDirections.push("L");
      movesAttempted += 1;
      if (!this.touchWalls("L") && !this.moveFix.includes("R") && !this.lastLastDirections.includes("R")) {
        //checks if it would move into a wall
        this.x -= this.v;
        movesTaken += 1;

        console.log("left1");
      }
    }

    //if pacman is to the right of the ghost, and there is no wall in the way, move right
    else if (pacman.x > this.x) {
      this.lastDirections.push("R");
      movesAttempted += 1;
      if (!this.touchWalls("R") && !this.moveFix.includes("L") && !this.lastLastDirections.includes("L")) {
        this.x += this.v;
        movesTaken += 1;

        console.log("right1");
      }
    }

    //if pacman is to below the ghost, and there is no wall in the way, move down
    if (pacman.y > this.y) {
      this.lastDirections.push("D");
      movesAttempted += 1;
      if (!this.touchWalls("D") && !this.moveFix.includes("U") && !this.lastLastDirections.includes("U")) {
        this.y += this.v;
        movesTaken += 1;

        console.log("down1");
      }
    }

    //if pacman is above the ghost, and there is no wall in the way, move up
    else if (pacman.y < this.y) {
      this.lastDirections.push("U");
      movesAttempted += 1;
      if (!this.touchWalls("U") && !this.moveFix.includes("D") && !this.lastLastDirections.includes("D")) {
        this.y -= this.v;
        movesTaken += 1;
        console.log("up1");
      }
    }
    
    this.moveFix.splice(0, this.moveFix.length);
    
    if (movesAttempted == 0){
      this.lastDirections = this.lastLastDirections;
    }
    
    // console.log("Moves Attempted: " + movesAttempted);
    // console.log("Moves Taken: " + movesTaken);
    // console.log(this.lastDirections);
    //if no moves have been taken that can directly move it in the direction of pacman,
    //then try the other two moves at random so that the ghost keeps moving
    // if (movesTaken == 0) {
    while (movesTaken == 0){
      let totalDirections = new Set(["L", "R", "U", "D"]);
      let setLastDirections = new Set(this.lastDirections);
      // console.log("entered random");
      let setMovesToTry = difference(totalDirections, setLastDirections);
      let movesToTry = Array.from(setMovesToTry);
      console.log(movesToTry);
      console.log("Length: " + movesToTry.length);
  
      let randIndex = Math.floor(Math.random() * movesToTry.length);
      console.log(randIndex);
      let move = movesToTry[randIndex];
      console.log(move);
        
        if (move === "L" && !this.touchWalls("L", 10)) {
          this.x -= 10 * this.v;
          this.moveFix.push("L");
          console.log("left2");
          movesTaken += 1;
          movesToTry.splice(randIndex, 1);
        }
        if (move === "R" && !this.touchWalls("R", 10)) {
          this.x += 10 * this.v;
          this.moveFix.push("R");
          console.log("right2");
          movesTaken += 1;
          movesToTry.splice(randIndex, 1);
        }
        if (move === "U" && !this.touchWalls("U", 10)) {
          this.y -= 10 * this.v;
          this.moveFix.push("U");
          console.log("up2");
          movesTaken += 1;
          movesToTry.splice(randIndex, 1);
        }
        if (move === "D" && !this.touchWalls("D", 10)) {
          this.y += 10 * this.v;
          this.moveFix.push("D");
          console.log("down2");
          movesTaken += 1;
          movesToTry.splice(randIndex, 1);
        }
        
      }
      
      // for (let move of movesToTry) {
      //   // console.log("in for loop");
      //   if (move === "L" && !this.touchWalls("L")) {
      //     this.x -= this.v;
      //     this.moveFix.push("L");
      //     console.log("left2");
      //   }
      //   else if (move === "R" && !this.touchWalls("R")) {
      //     this.x += this.v;
      //     this.moveFix.push("R");
      //     console.log("right2");
      //   }
      //   if (move === "U" && !this.touchWalls("U")) {
      //     this.y -= this.v;
      //     this.moveFix.push("U");
      //     console.log("up2");
      //   }
      //   else if (move === "D" && !this.touchWalls("D")) {
      //     this.y += this.v;
      //     this.moveFix.push("D");
      //     console.log("down2");
      //   }
      // }
    // console.log("Last: " + this.lastDirections)
    this.lastLastDirections = this.lastDirections.slice();
    // console.log("(3) Last last: " + this.lastLastDirections)
    this.lastDirections.splice(0, this.lastDirections.length);
    // console.log("Last cleared: " + this.lastDirections)
  }

  touchWalls(direction, multiplier = 1) {
    if (direction === "L") {
      for (let i = 0; i < pacmanGame.barriers.length; i++) {
        pacmanGame.ghostCollide = collideRectRect(
          pacmanGame.barriers[i][0],
          pacmanGame.barriers[i][1],
          pacmanGame.barriers[i][2],
          pacmanGame.barriers[i][3],
          this.x - (multiplier * this.v),
          this.y,
          20,
          20
        );
        if (pacmanGame.ghostCollide == true) {
          // console.log("left blocked")
          return true;
        }
      }
    } else if (direction === "R") {
      for (let i = 0; i < pacmanGame.barriers.length; i++) {
        pacmanGame.ghostCollide = collideRectRect(
          pacmanGame.barriers[i][0],
          pacmanGame.barriers[i][1],
          pacmanGame.barriers[i][2],
          pacmanGame.barriers[i][3],
          this.x + (multiplier * this.v),
          this.y,
          20,
          20
        );
        if (pacmanGame.ghostCollide == true) {
          // console.log("right blocked")
          return true;
        }
      }
    } else if (direction === "U") {
      for (let i = 0; i < pacmanGame.barriers.length; i++) {
        pacmanGame.ghostCollide = collideRectRect(
          pacmanGame.barriers[i][0],
          pacmanGame.barriers[i][1],
          pacmanGame.barriers[i][2],
          pacmanGame.barriers[i][3],
          this.x,
          this.y - (multiplier * this.v),
          20,
          20
        );
        if (pacmanGame.ghostCollide == true) {
          // console.log("up blocked")
          return true;
        }
      }
    } else if (direction === "D") {
      for (let i = 0; i < pacmanGame.barriers.length; i++) {
        pacmanGame.ghostCollide = collideRectRect(
          pacmanGame.barriers[i][0],
          pacmanGame.barriers[i][1],
          pacmanGame.barriers[i][2],
          pacmanGame.barriers[i][3],
          this.x,
          this.y + (multiplier * this.v),
          20,
          20
        );
        if (pacmanGame.ghostCollide == true) {
          // console.log("down blocked")
          return true;
        }
      }
    }
  }
}

class Food {
  constructor(x, y, i) {
    this.x = x;
    this.y = y;
    this.col = color(255, 255, 255);
    this.eat = false;
    this.size = 7;
    this.pos = i;
    this.power = false;
  }

  show() {
    fill(this.col);
        
    if(this.pos == 0 || this.pos == 17 || this.pos == 144 || this.pos == 161){
      this.size = 14;
      this.power = true;
    }
    
    ellipse(this.x, this.y, this.size);
  }

  checkHit() {
    let hit = collideCircleCircle(
      this.x,
      this.y,
      7,
      pacmanGame.pacman.x,
      pacmanGame.pacman.y,
      pacmanGame.pacman.size
    );

    if (hit && !this.eat) {
      this.col = pacmanGame.backColor;
      this.eat = true;
      pacmanGame.score++;
      if(this.power){
        pacmanGame.powerUp = true;
      }
    }
  }
}

function difference(setA, setB) {
  let _difference = new Set(setA);
  for (let elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}
