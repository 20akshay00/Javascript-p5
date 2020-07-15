let L = 800; //x length of canvas
let W = 400; //y length of canvas
let scale = 100;
let offset = 2.5;
let fskip = 0;
let lSlider, lcSlider, kSlider;
let mInput1, mInput2, aInput1, aInput2;
let sButton, pButton;
let x1, x2, y1, y2, sAngle, d;
let nIter = 0;

let par = {
  theta: [0, 0], // [Initial angle 1, Initial angle 2]
  omega: [0, 0],
  alpha: [0, 0],
  dt: 0.001, // Initial time step size
  mass: [1, 1], // [Mass of pendulum 1, Mass of pendulum 2]
  length: [1, 1], // [Pendulum length, Coupling length]
  k: 0.5, //Spring constant
  center: [L / 3, 3 * W / 10], //midpoint of hinges
  hinge: [
    [L / 3 - 50, 3 * W / 10], //hinge of pendulum 1
    [L / 3 + 50, 3 * W / 10] //hinge of pendulum 2
  ],
  g: 9.8 / 3600
};

function linedash(x1, y1, x2, y2, list) {
  drawingContext.setLineDash(list); // set the "dashed line" mode
  line(x1, y1, x2, y2); // draw the line
  drawingContext.setLineDash([]); // reset into "solid line" mode
}

function setup() {
  bg = loadImage('assets/canvas.png');
  createCanvas(L, W);

  lSlider = createSlider(0.1, 2.0, 1.0, 0.1); //angle slider
  lSlider.position(10, 10);
  lSlider.style('width', '90px');

  lcSlider = createSlider(0.1, 2.0, 1.0, 0.1); //dt slider
  lcSlider.position(10, 30);
  lcSlider.style('width', '90px');

  kSlider = createSlider(0, 2.0, 0.5, 0.1); //length slider
  kSlider.position(10, 50);
  kSlider.style('width', '90px');

  mInput1 = createInput();
  mInput1.position(10, 364);
  mInput1.size(20);

  mInput2 = createInput();
  mInput2.position(50, 364);
  mInput2.size(20);

  aInput1 = createInput();
  aInput1.position(2 * L / 3 - 84, 364);
  aInput1.size(20);

  aInput2 = createInput();
  aInput2.position(2 * L / 3 - 44, 364);
  aInput2.size(20);

  button = createButton('Start'); //START button
  button.position(400, 30);
  button.mousePressed(() => { //Updates values only when START is pressed
    par.theta = [(aInput1.value() % 90) * PI / 180, (aInput2.value() % 90) * PI / 180];
    par.length = [lSlider.value(), lcSlider.value()];
    par.mass = [mInput1.value(), mInput2.value()];
    par.k = kSlider.value();
    par.omega = [0, 0];
    par.alpha = [0, 0];
    par.hinge[0] = [par.center[0] - scale * par.length[1] / 2, par.center[1]];
    par.hinge[1] = [par.center[0] + scale * par.length[1] / 2, par.center[1]];
  })
}

function draw() {
  background(bg);


  fill(0, 0, 0);
  strokeWeight(0);
  text("Length (m): " + lSlider.value().toFixed(2), 110, 25);
  text("C-Length (m): " + lcSlider.value().toFixed(2), 110, 45);
  text("Spring constant (N/m): " + kSlider.value().toFixed(2), 110, 65);
  text("Mass (kg)", 95, 384);
  text("Initial angle (°)", 2 * L / 3 - 180, 384)


  strokeWeight(3);
  stroke(0, 0, 0);

  //line of suspension of pendulum
  line(par.center[0] - 2 * L / 9, par.center[1], par.center[0] + 2 * L / 9, par.center[1]);
  stroke(0, 0, 0);
  strokeWeight(2);

  //first pendulum
  line(...par.hinge[0], par.hinge[0][0] + scale * par.length[0] * sin(par.theta[0]), par.hinge[0][1] + scale * par.length[0] * cos(par.theta[0]));
  linedash(...par.hinge[0], par.hinge[0][0], par.hinge[0][1] + scale * par.length[0], [5])

  fill(51, 153, 255); //Plots the pendulum
  ellipse(par.hinge[0][0] + scale * par.length[0] * sin(par.theta[0]), par.hinge[0][1] + scale * par.length[0] * cos(par.theta[0]), 15 * (par.mass[0]) ** 0.25, 15 * (par.mass[0]) ** 0.25);

  //second pendulum
  line(...par.hinge[1], par.hinge[1][0] + scale * par.length[0] * sin(par.theta[1]), par.hinge[1][1] + scale * par.length[0] * cos(par.theta[1]));
  linedash(...par.hinge[1], par.hinge[1][0], par.hinge[1][1] + scale * par.length[0], [5])

  fill(51, 153, 255); //Plots the pendulum
  ellipse(par.hinge[1][0] + scale * par.length[0] * sin(par.theta[1]), par.hinge[1][1] + scale * par.length[0] * cos(par.theta[1]), 15 * (par.mass[1]) ** 0.25, 15 * (par.mass[1]) ** 0.25);

  //update values of parameters
  par.length = [lSlider.value(), lcSlider.value()];
  par.k = kSlider.value();
  par.hinge[0] = [par.center[0] - scale * par.length[1] / 2, par.center[1]];
  par.hinge[1] = [par.center[0] + scale * par.length[1] / 2, par.center[1]];

  x1 = par.hinge[0][0] + par.length[0] * sin(par.theta[0]);
  y1 = par.hinge[0][1] + par.length[0] * cos(par.theta[0]);
  x2 = par.hinge[1][0] + par.length[0] * sin(par.theta[1]);
  y2 = par.hinge[1][1] + par.length[0] * cos(par.theta[1]);

  d = ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5
  sAngle = acos(abs(x2 - x1) / d);

  par.alpha[0] = -par.g * sin(par.theta[0]) - par.k * (d - par.length[1]) * cos(par.theta[0] + sAngle) / (par.mass[0] * par.length[0]);
  par.alpha[1] = -par.g * sin(par.theta[1]) + par.k * (d - par.length[1]) * cos(par.theta[1] + sAngle) / (par.mass[1] * par.length[0]);
  par.omega[0] += par.alpha[0] * par.dt;
  par.omega[1] += par.alpha[1] * par.dt;
  par.theta[0] += par.omega[0] * par.dt;
  par.theta[1] += par.omega[1] * par.dt;

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