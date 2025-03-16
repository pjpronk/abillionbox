const white = 255;
const black = 0;
const boxSize = 160;

const boxColor = black;

let fillColor;
let angle = 0;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  fillColor = color(black);
}

function draw() {
  background(255);
  orbitControl(2.5, 2.5, 2.5);

  angle = frameCount * 0.01;
  rotate(angle, [1, 0.75, 0]);
  fill(fillColor);
  stroke(255 - fillColor);
  box(boxSize);
}

let clickStartX, clickStartY;

function mousePressed() {
  clickStartX = mouseX;
  clickStartY = mouseY;
}

function mouseReleased() {
  let dx = abs(mouseX - clickStartX);
  let dy = abs(mouseY - clickStartY);

  if (dx < 5 && dy < 5 && checkHitBox()) {
    socket.send('hit');
    flash();
  }
}

function checkHitBox() {
  // To avoid math, I use inherent properties of the object and the background
  const mouseColor = get(mouseX, mouseY);
  for (let i = 0; i < mouseColor.length; i++) {
    if (mouseColor[i] != fillColor.levels[i]) {
      return false;
    }
  }
  return true;
}

function flash() {
  fillColor = color(white);
  setTimeout(() => {
    fillColor = color(black);
  }, 100);

  setTimeout(() => {
    fillColor = color(white);
  }, 120);

  setTimeout(() => {
    fillColor = color(black);
  }, 140);
}
