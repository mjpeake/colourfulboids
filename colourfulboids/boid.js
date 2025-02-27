const p5 = require("p5");

class Boid {
  constructor(p) {
    this.p = p;

    // Body
    this.body = []
    this.bodyLength = 10;

    // Vision and Movement
    this.perceptionRadius = 60;
    this.separationRadius = 30;
    this.maxForce = 0.03;
    this.maxSpeed = 3;
    this.alignmentCoef = 1;
    this.cohesionCoef = 1;
    this.separationCoef = 1.2;

    // Colour
    this.color = p.boidColor;
    this.bodyColor = this.setBodyColor();

    // Position, Velocity and Acceleration
    this.position = p.createVector(p.random(p.width), p.random(p.height));
    this.velocity = p.createVector(p.random(-1, 1), p.random(-1, 1));
    this.acceleration = p.createVector();
    this.cell = this.currentCell();
  }

  setBodyColor() {
    let bodyColor = [];
    let alphaStep = 255 / this.bodyLength;
    for (let i = 0; i < this.bodyLength; i++) {
      bodyColor.push(
        this.p.color(
          this.color.levels[0],
          this.color.levels[1],
          this.color.levels[2],
          alphaStep * (this.bodyLength - i)
        )
      );
    }
    return bodyColor;
  }

  // Display Boid on Canvas
  draw() {
    this.p.strokeWeight(6);
    for (var i = this.body.length - 1; i > 0; i--) {
      this.p.stroke(this.bodyColor[i]);
      this.p.point(this.body[i].x, this.body[i].y);
    }

    if (this.p.debug) {
      this.p.strokeWeight(1);
      this.p.stroke(this.p.boidColor);
      this.p.noFill();
      this.p.ellipse(this.body[0].x, this.body[0].y, this.perceptionRadius, this.perceptionRadius)
    }
  }

  // Contain Boid within Canvas
  contain() {
    this.position.x = (this.position.x + this.p.width) % this.p.width;
    this.position.y = (this.position.y + this.p.height) % this.p.height;
  }

  flock(boids) {
    this.acceleration.mult(0);  // Reset acceleration

    // Create Flocking Vectors
    let alignment = this.p.createVector();
    let separation = this.p.createVector();
    let cohesion = this.p.createVector();

    let total = 0;
    let totalSep = 0;

    for (let other of boids) {
      if (other == this || !this.inNeighbourhood(other)) {
        continue
      }

      let d = this.p.dist(this.position.x, this.position.y, other.position.x, other.position.y);

      // Within Vision Radius
      if (d <= this.perceptionRadius) {
        alignment.add(other.velocity);
        cohesion.add(other.position);
        total++;
      }
      // Within Separation Radius
      if (d <= this.separationRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d);
        separation.add(diff);
        totalSep++;
      }
    }


    if (total > 0) {
      // Alignment
      alignment.div(total);
      alignment.setMag(this.maxSpeed);
      alignment.sub(this.velocity);
      alignment.limit(this.maxForce);
      alignment.mult(this.alignmentCoef);
      this.acceleration.add(alignment);

      // Cohesion
      cohesion.div(total);
      cohesion.sub(this.position);
      cohesion.setMag(this.maxSpeed);
      cohesion.sub(this.velocity);
      cohesion.limit(this.maxForce);
      cohesion.mult(this.cohesionCoef);
      this.acceleration.add(cohesion);
    }

    if (totalSep > 0) {
      // Separation
      separation.div(totalSep);
      separation.setMag(this.maxSpeed);
      separation.sub(this.velocity);
      separation.limit(this.maxForce);
      separation.mult(this.separationCoef);
      this.acceleration.add(separation);
    }
  }

  update() {
    // Update head
    this.velocity.add(this.acceleration).limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.cell = this.currentCell();

    // Update body
    this.body.unshift(this.p.createVector(this.position.x, this.position.y));
    if (this.body.length > this.bodyLength) {
      this.body.pop();
    }
  }

  currentCell() {
    const x = Math.floor(this.position.x / (this.p.width / this.p.cellCountX));
    const y = Math.floor(this.position.y / (this.p.height / this.p.cellCountY));
    return this.p.createVector(x, y)
  }

  inNeighbourhood(other) {
    const withinX = Math.abs(other.cell.x - this.cell.x) <= 1;
    const withinY = Math.abs(other.cell.y - this.cell.y) <= 1;
    return withinX && withinY;
  }
}
module.exports = Boid;