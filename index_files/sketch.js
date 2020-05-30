/*
 * sketch.js
 */

/*
TODO:
2. highlight steps as executed
4. user test it!

*/

var available_height, available_width;
var canvas;
var unit;

var CODEY_WIDTH = 32;
var CODEY_HEIGHT = 40;
var CODEY_STEP = 2.5;
var CODEY_WAIT = 30;
var CODEY_START_X_UNIT = 7;
var CODEY_START_Y_UNIT = 7;
var codey, wall, tileSpriteSheet, tileGroup, codeySpriteSheet,
  standAnimation, walkRightAnimation, danceAnimation;
var error;

function preload() {
  standAnimation = loadImage('assets/codey-walk-right-02.png');
  walkRightAnimation = loadAnimation('assets/codey-walk-right-01.png', 'assets/codey-walk-right-05.png');
  walkRightAnimation.frameDelay = 12;
  danceAnimation = loadAnimation('assets/codey-dance-01.png', 'assets/codey-dance-03.png');
  danceAnimation.frameDelay = 14;
}

function setup() {
  available_height = document.querySelector('#right-container').clientHeight;
  available_width = document.querySelector('#right-container').clientWidth;
  canvas = createCanvas(available_width, available_height);

  canvas.parent('canvas-container');
  // The canvas will be divided into a 14 x 14 grid
  // Assumes canvas is a square
  unit = width / 14;

  // Expects Oxygen imported as <link> in HTML
  textFont('Oxygen');
  textSize(14);

  codey = createSprite(
    CODEY_START_X_UNIT*unit + CODEY_WIDTH/2,
    CODEY_START_Y_UNIT*unit + CODEY_HEIGHT/2);
  codey.addAnimation('stand', standAnimation);
  codey.addAnimation('walk-right', walkRightAnimation);
  codey.addAnimation('dance', danceAnimation);
  codey.changeAnimation('stand');
  codey.friction = 0.1;
  codey.setCollider('rectangle', 0, 0, unit - 1, unit - 1);
  codey.nav = [];
  codey.navIndex = 0;
  codey.timer = 0;
  codey.path = [];
  codey.static = true;
  codey.move = function () {
    // If time is up and there are more steps in codey's nav...
    if (codey.timer <= 0 && codey.navIndex < codey.nav.length) {
      codey.timer = CODEY_WAIT;
      const instruction = codey.nav[codey.navIndex++];
      switch (instruction) {
        case 'up':
          codey.position.y -= unit;
          break;
        case 'down':
          codey.position.y += unit;
          break;
        case 'left':
          codey.position.x -= unit;
          break;
        case 'right':
          codey.position.x += unit;
          break;
      }

      codey.path.push({
        x1: codey.previousPosition.x,
        y1: codey.previousPosition.y,
        x2: codey.position.x,
        y2: codey.position.y
      })
    }

    // In all cases, subtract 1 from codey's timer
    codey.timer = constrain(codey.timer-1, 0, CODEY_WAIT);

  }

}

function draw() {
  clear();
  background(0);

  fill(200);
  textAlign(CENTER);

  if (codey.nav.length === codey.navIndex) {
    codey.static = true;
    // If Codey's path forms a square
    // TODO: this returns true for more than just a square
    // e.g. 'up', 'down', 'left', 'right' will pass too
    if (hasEqualDirs(codey.nav) && beginMatchesEnd(codey.path)) {
      codey.changeAnimation('dance');
    } else {
      codey.changeAnimation('stand');
    }
  }

  if (!codey.static) {
    codey.move();
    codey.changeAnimation('walk-right');
  }
  stroke('red');
  strokeWeight(4);
  codey.path.forEach( (elem) => {
    line(elem.x1, elem.y1, elem.x2, elem.y2);
  });
  strokeWeight(1);

  drawSprites();
}

function keyPressed() {
  // Debug controls
  if (keyCode === ESCAPE) {
    getSprites().forEach( (sprite) => {
      sprite.debug = !sprite.debug;
    });
  }

}

/*****
Helper Functions
*****/

function addNavigation(dir) {
  codey.nav.push(dir);
}

function resetCodey() {
  console.log('beginning to reset Codey');
  codey.position.x = CODEY_START_X_UNIT*unit + CODEY_WIDTH/2;
  codey.position.y = CODEY_START_Y_UNIT*unit + CODEY_HEIGHT/2;
  codey.navIndex = 0;
  codey.timer = CODEY_WAIT;
  codey.static = true;
  console.log('done reseting Codey');

}

function resetNav() {
  codey.nav = [];
}

function resetPath() {
  codey.path = [];
}

function resetInstructionsDiv() {
  document.querySelector('div#instructions').innerHTML = '';
}

/* Returns true if the nav forms a square
* Returns false if the nav does not form a square or has length 0
* @param {string[]} nav - an array of strings representing directions.
* The directions may be 'up', 'down', 'left', or 'right'.
*/
function hasEqualDirs(nav) {
  if (nav.length === 0) {
    return false;
  }

  let ups = downs = lefts = rights = 0;
  nav.forEach((dir) => {
    switch (dir) {
      case 'up':
        ups++;
        break;
      case 'down':
        downs++;
        break;
      case 'left':
        lefts++;
        break;
      case 'right':
        rights++;
        break;
    }
  });

  return [ups, downs, lefts, rights].every((count) => count === ups);
}

/* Returns true if the first and last position in the path match
* Returns false if they do no match or the path has length 0
* @param {Object[]} path - an array of Objects representing line segments.
* A segment has four keys: x1, y1, x2, y2
*/
function beginMatchesEnd(path) {
  if (path.length === 1) {
    return false;
  }
  return path[0]['x1'] == path[path.length-1]['x2'] &&
    path[0]['y1'] === path[path.length-1]['y2'];
}
