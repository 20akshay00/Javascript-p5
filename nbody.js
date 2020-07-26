let G = 100;
let dt = 0.5;

class body {
  constructor(x, y, m, id) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(200), random(200));
    this.acceleration = createVector(0, 0);
    this.pacceleration = createVector(0, 0);
    this.mass = m;
    this.radius = 20 * sqrt(this.mass);
    this.pid = id;
  }

  draw() {
    noStroke()
    fill(150)
    ellipse(this.position.x, this.position.y, this.radius, this.radius)
  }

  update() {
    this.position.add(this.velocity.mult(dt), this.pacceleration.mult(0.5 * dt ** 2))
    this.velocity.add(this.acceleration.mult(0.5 * dt), this.pacceleration.mult(0.5 * dt))

    this.pacceleration = this.acceleration.copy()
    this.acceleration.set(0, 0)
  }

  attract(nbodies) {
    let force = createVector(0, 0);
    for (let other of nbodies) {
      if (this.pid != other.pid) {
        let fdir = p5.Vector.sub(other.position, this.position)
        let fmag = G * this.mass * other.mass / fdir.magSq();
        if (fdir.mag() < this.radius + other.radius) {
          fdir.mult(-1)
          fmag *= 100
        }
        force.add(fdir.setMag(fmag));
      }
    }

    this.acceleration.add(p5.Vector.div(force, this.mass))
    this.update()
  }

}