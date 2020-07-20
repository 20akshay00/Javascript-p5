function drawspring(xa, ya, xb, yb, rlen) {
  /*
  takes in start/end coordinates,
  rlen; rest length of Spring
  col; boolean value for coloring the stress of the spring
  */
  n = parseInt(10 * rlen / 100)
  step = ((xa - xb) ** 2 + (ya - yb) ** 2) ** 0.5 / n; //steps between vertices
  ang = atan((yb - ya) / (xb - xa)); //angle between two points
  step = (xa > xb) ? (-step) : step; //step is increased from a to b

  noFill();

  push();
  translate(xa, ya);
  rotate(ang, createVector(0, 0, 1));

  beginShape();
  vertex(0, 0);
  vertex(step / 2, 0)
  for (let i = 1; i < n; i++) {
    vertex(step * i, 5 * (-1) ** i)
  }
  vertex((n - 0.5) * step, 0);
  vertex(n * step, 0);
  endShape();

  pop();
}