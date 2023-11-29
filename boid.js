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
    this.bodyColor = [];
    let alphaStep = 255 / this.bodyLength;
    for (var i = 0; i < this.bodyLength; i++) {
      let stepColor = this.p.color(p.boidColor.toString('#rrggbb'));
      stepColor.setAlpha(alphaStep * (this.bodyLength - i));
      this.bodyColor.push(stepColor);
    }

    // Position, Velocity and Acceleration
    this.position = p.createVector(p.random(p.width), p.random(p.height));
    this.velocity = p.createVector(p.random(-1, 1), p.random(-1, 1));
    this.acceleration = p.createVector();
    this.cell = this.currentCell();
  }

  // Display Boid on Canvas
  draw() {
    this.p.strokeWeight(6);
    for (var i = this.body.length - 1; i > 0; i--) {
      this.p.stroke(this.bodyColor[i]);
      this.p.point(this.body[i].x, this.body[i].y);
    }

    if (debug) {
      this.p.strokeWeight(1);
      this.p.stroke(this.p.boidColor);
      this.p.noFill();
      this.p.ellipse(this.body[0].x, this.body[0].y, this.perceptionRadius, this.perceptionRadius)
    }
  }

  // Contain Boid within Canvas
  contain() {
    if (this.position.x < 0) {
      this.position.x = this.p.width;
    } else if (this.position.x > this.p.width) {
      this.position.x = 0;
    }

    if (this.position.y < 0) {
      this.position.y = this.p.height;
    } else if (this.position.y > this.p.height) {
      this.position.y = 0;
    }
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
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);

    this.cell = this.currentCell();

    // Update body
    this.body.unshift(this.p.createVector(this.position.x, this.position.y));
    if (this.body.length > this.bodyLength) {
      this.body.pop();
    }
  }

  currentCell() {
    let x = this.p.floor(this.position.x / (this.p.width / this.p.cellCountX));
    let y = this.p.floor(this.position.y / (this.p.height / this.p.cellCountY));
    return this.p.createVector(x, y)
  }

  inNeighbourhood(other) {
    for (let x = this.cell.x - 1; x <= this.cell.x + 1; x++) {
      for (let y = this.cell.y -1; y <= this.cell.y + 1; y++) {
        if (other.cell.x == x || other.cell.y == y) {
          return true
        }
      }
    }
    return false
  }
}