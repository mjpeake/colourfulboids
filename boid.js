class Boid {
  constructor(p, boidColor) {
    this.p = p;
    this.color = boidColor;

    // Position, Velocity and Acceleration
    this.position = p.createVector(p.random(p.width), p.random(p.height));
    this.velocity = p.createVector(p.random(-1, 1), p.random(-1, 1));
    this.acceleration = p.createVector();

    // Body
    this.body = []
    this.bodyLength = 15;

    // Vision and Movement
    this.perceptionRadius = 60;
    this.separationRadius = 30;
    this.maxForce = 0.03;
    this.maxSpeed = 3;
  }

  // Display Boid on Canvas
  show() {
    this.p.strokeWeight(6);
    this.bodyColor = this.p.color(this.color.toString('#rrggbb'));
    for (var i = this.body.length - 1; i > 0; i--) {
      var alphaStep = 255 / this.body.length
      this.bodyColor.setAlpha(alphaStep * (this.body.length - i));
      this.p.stroke(this.bodyColor);
      this.p.point(this.body[i].x,this.body[i].y);
    }
  }

  // Contain Boid within Canvas
  contain() {
    if(this.position.x < 0) {
      this.position.x = this.p.width;
    } else if(this.position.x > this.p.width) {
      this.position.x = 0;
    }

    if(this.position.y < 0) {
      this.position.y = this.p.height;
    } else if(this.position.y > this.p.height) {
      this.position.y = 0;
    }
  }

  // Follow mouse pointer
  follow() {
    let follow = this.p.createVector();
    if(this.p.mouseX > 0 && this.p.mouseX < this.p.width && this.p.mouseY > 0 && this.p.mouseY < this.p.height) {
      let d = this.p.dist(this.position.x, this.position.y, this.p.mouseX, this.p.mouseY);
      if(d < this.perceptionRadius * 2) {
        follow.add(this.p.createVector(this.p.mouseX,this.p.mouseY));
        follow.sub(this.position);
        follow.setMag(this.maxSpeed);
        follow.sub(this.velocity);
        follow.limit(this.maxForce);
        follow.mult(2);
      }
    }
    return follow;
  }

  // Allign with other boids
  align(boids) {
    let alignment = this.p.createVector();
    let total = 0;

    for(let other of boids) {
      let d = this.p.dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if(other != this && d < this.perceptionRadius) {
        alignment.add(other.velocity);
        total++;
      }
    }

    if(total > 0) {
      alignment.div(total);
      alignment.setMag(this.maxSpeed);
      alignment.sub(this.velocity);
      alignment.limit(this.maxForce);
    }
    return alignment;
  }

  // Group with other boids
  cohesion(boids) {
    let cohesion = this.p.createVector();
    let total = 0;

    for(let other of boids) {
      let d = this.p.dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if(other != this && d < this.perceptionRadius) {
        cohesion.add(other.position);
        total++;
      }
    }

    if(total > 0) {
      cohesion.div(total);
      cohesion.sub(this.position);
      cohesion.setMag(this.maxSpeed);
      cohesion.sub(this.velocity);
      cohesion.limit(this.maxForce);
    }
    return cohesion;
  }

  // Avoid other boids
  separation(boids) {
    let separation = this.p.createVector();
    let total = 0;

    for(let other of boids) {
      let d = this.p.dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if(other != this && d < this.separationRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d);
        separation.add(diff);
        total++;
      }
    }

    if(total > 0) {
      separation.div(total);
      separation.setMag(this.maxSpeed);
      separation.sub(this.velocity);
      separation.limit(this.maxForce);
    }
    return separation;
  }


  flock(boids) {
    this.acceleration.mult(0);  // Reset acceleration

    // Create Flocking Vectors
    let alignment = this.p.createVector();
    let separation = this.p.createVector();
    let cohesion = this.p.createVector();

    let total = 0;
    let totalSep = 0;

    for(let other of boids) {
      let d = this.p.dist(this.position.x, this.position.y, other.position.x, other.position.y);

      if(other != this) {
        // Within Vision Radius
        if(d < this.perceptionRadius) {
          alignment.add(other.velocity);
          cohesion.add(other.position);
          total++;
        }
        // Within Separation Radius
        if(d < this.separationRadius) {
          let diff = p5.Vector.sub(this.position, other.position);
          diff.div(d);
          separation.add(diff);
          totalSep++;
        }
      }
    }

    if(total > 0) {
      alignment.div(total);
      alignment.setMag(this.maxSpeed);
      alignment.sub(this.velocity);
      alignment.limit(this.maxForce);

      cohesion.div(total);
      cohesion.sub(this.position);
      cohesion.setMag(this.maxSpeed);
      cohesion.sub(this.velocity);
      cohesion.limit(this.maxForce);
    }

    if(totalSep > 0) {
      separation.div(totalSep);
      separation.setMag(this.maxSpeed);
      separation.sub(this.velocity);
      separation.limit(this.maxForce);
    }

    alignment.mult(1);
    cohesion.mult(1);
    separation.mult(1.2);

    // Interact with mouse
    let follow = this.follow();

    // Add influences
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
    this.acceleration.add(follow);
  }

  update() {
    // Update head
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);

    // Update body
    this.body.unshift(this.p.createVector(this.position.x, this.position.y));
    if (this.body.length > this.bodyLength) {
      this.body.pop();
    }
  }
}