let L = 800; //x length of canvas
let W = 400; //y length of canvas
let scale = 100;
let offset = 2.5;
let fSlider;
let lSlider, lcSlider, kSlider;
let mInput1, mInput2, aInput1, aInput2;
let sButton, pButton;
let sAngle, d;
let nIter = 0;

var plot1 = undefined;
var plot2 = undefined;
let count = 0;
let numP = 0;

let par = {
  theta: [0, 0], // [Initial angle 1, Initial angle 2]
  omega: [0, 0],
  alpha: [0, 0],
  dt: 0.001, // Initial time step size
  mass: [1, 1], // [Mass of pendulum 1, Mass of pendulum 2]
  length: [1, 1], // [Pendulum length, Coupling length]
  k: 0.5 / 100, //Spring constant
  center: [L / 3, 3 * W / 10], //midpoint of hinges
  hinge: [
    [L / 3 - 50, 3 * W / 10], //hinge of pendulum 1
    [L / 3 + 50, 3 * W / 10] //hinge of pendulum 2
  ],
  g: 9.8 / 100
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

  fSlider = createSlider(1, 1000, 50, 1); //frameskip slider
  fSlider.position(L / 3 - 50, 373);
  fSlider.style('width', '90px');

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
    par.k = kSlider.value() / 100;
    par.omega = [0, 0];
    par.alpha = [0, 0];
    par.hinge[0] = [par.center[0] - scale * par.length[1] / 2, par.center[1]];
    par.hinge[1] = [par.center[0] + scale * par.length[1] / 2, par.center[1]];
  })

  plot1 = new GPlot(this);
  plot1.setPos(2 * L / 3, 0);
  plot1.setMar(30, 40, 30, 10);
  plot1.setOuterDim(this.width / 3, this.height / 2);
  plot1.setAxesOffset(4);
  plot1.setTicksLength(4);

  plot1.setTitleText("Energy vs. Time");

  plot2 = new GPlot(this);
  plot2.setPos(2 * L / 3, W / 2);
  plot2.setMar(30, 40, 30, 10);
  plot2.setOuterDim(this.width / 3, this.height / 2);
  plot2.setAxesOffset(4);
  plot2.setTicksLength(4);

  plot2.setTitleText("Energy vs. Time");

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
  text("Frameskip : " + fSlider.value(), L / 3 - 50, 374)
  text("Framerate: " + int(getFrameRate()), 10, 200);

  //plots spring
  strokeWeight(2);
  drawspring(par.hinge[0][0] + scale * par.length[0] * sin(par.theta[0]), par.hinge[0][1] + scale * par.length[0] * cos(par.theta[0]), par.hinge[1][0] + scale * par.length[0] * sin(par.theta[1]), par.hinge[1][1] + scale * par.length[0] * cos(par.theta[1]), scale * par.length[1], true)
  stroke(0);

  strokeWeight(3)
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
  par.k = kSlider.value() / 100;
  par.hinge[0] = [par.center[0] - scale * par.length[1] / 2, par.center[1]];
  par.hinge[1] = [par.center[0] + scale * par.length[1] / 2, par.center[1]];


  //code to evolve in time; Euler scheme
  for (let i = 0; i < fSlider.value(); i++) {
    d = ((par.length[0] * (cos(par.theta[0]) - cos(par.theta[1]))) ** 2 + (par.length[1] + par.length[0] * sin(par.theta[1]) - par.length[0] * sin(par.theta[0])) ** 2) ** 0.5;
    sAngle = atan((-cos(par.theta[1]) + cos(par.theta[0])) / (par.length[1] / par.length[0] + sin(par.theta[1]) - sin(par.theta[0])));

    par.alpha[0] = -par.g * sin(par.theta[0]) / par.length[0] + par.k * (d - par.length[1]) * cos(par.theta[0] - sAngle) / (par.mass[0] * par.length[0]);
    par.alpha[1] = -par.g * sin(par.theta[1]) / par.length[0] - par.k * (d - par.length[1]) * cos(par.theta[1] - sAngle) / (par.mass[1] * par.length[0]);
    par.omega[0] += par.alpha[0] * par.dt;
    par.omega[1] += par.alpha[1] * par.dt;
    par.theta[0] += par.omega[0] * par.dt;
    par.theta[1] += par.omega[1] * par.dt;
    count++;

  }

  //plotting the data
  plot1.addPoint(new GPoint(count * par.dt, 0.5 * par.mass[0] * par.length[0] ** 2 * par.omega[0] ** 2));
  plot2.addPoint(new GPoint(count * par.dt, 0.5 * par.mass[1] * par.length[0] ** 2 * par.omega[1] ** 2));
  numP++;
  if (numP > 500) {
    plot1.removePoint(0);
    plot2.removePoint(0);
  }


  plot1.beginDraw();
  plot1.drawBox();
  plot1.drawXAxis();
  plot1.drawYAxis();
  plot1.drawTitle();
  plot1.drawLines();
  plot1.endDraw();

  plot2.beginDraw();
  plot2.drawBox();
  plot2.drawXAxis();
  plot2.drawYAxis();
  plot2.drawTitle();
  plot2.drawLines();
  plot2.endDraw();
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