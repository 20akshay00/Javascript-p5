let L = 800; //x length of canvas
let W = 400; //y length of canvas
let offset = 2.5;

let par = {
  theta: [0, 0], // [Initial angle 1, Initial angle 2]
  dt: 0.01, // Initial time step size
  mass: [1, 1], // [Mass of pendulum 1, Mass of pendulum 2]
  length: [1, 1], // [Pendulum length, Coupling length]
  spring: 0.5, //Spring constant
}

function setup() {
  bg = loadImage('assets/canvas.png');
  createCanvas(L, W);
}

function draw() {
  background(bg);
}





/* //SETUP FOR BACKGROUND IMAGE

background(204, 229, 255);
strokeWeight(offset * 2);
stroke(0, 128, 255);

fill(102, 178, 255);
rect(0, 0, L, W / 5);

fill(204, 229, 255);
rect(0, W / 5, 2 * L / 3, 7 * W / 10);

fill(102, 178, 255);
rect(0, 9 * W / 10, 2 * L / 3, W / 10);

fill(153, 204, 255);
rect(2 * L / 3, W / 5, L / 3, 4 * W / 5);

noFill();
rect(0 + offset, 0 + offset, L - 2 * offset, W - 2 * offset);
noStroke();
*/