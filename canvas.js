const colourfulBoids = ( p ) => {
  let flock = [];
  let boidColor, backgroundColor;
  const boidCount = 50; // Size of Population

  p.setup = function() {
    // Determine size of parent div
    const div = p.canvas.parentElement;
    p.createCanvas(div.offsetWidth, div.offsetHeight);

    if(backgroundColor == null) {
      p.randomPalette();
    }

    // Populate
    for(let i = 0; i < boidCount; i++) flock.push(new Boid(p, boidColor));
  }

  p.randomPalette = function() {
    rgb = [p.random(255),p.random(255),p.random(255)];
    backgroundColor = p.color(rgb[0], rgb[1], rgb[2]);
    boidColor = p.color(255-rgb[0],255-rgb[1],255-rgb[2]);
  }

  p.draw = function() {
    // Refresh background
    p.background(backgroundColor);

    // Update boids
    for(let boid of flock) {
      boid.contain();
      boid.flock(flock);
      boid.update();
      boid.show();
    }
  }

  p.windowResized = function() {
    flock = []
    p.setup();
  }
}
