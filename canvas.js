const colourfulBoids = ( p ) => {
  let flock = [];
  let boidColor, backgroundColor;

  p.setup = function() {
    // Determine size of parent div
    const div = p.canvas.parentElement;
    p.createCanvas(div.offsetWidth, div.offsetHeight);

    // Set palette if not set
    if(backgroundColor == null) {
      p.randomPalette();
    }

    // Populate
    popSize = p.determinePopSize(div.offsetWidth,div.offsetHeight, 0.005);
    for(let i = 0; i < popSize; i++) flock.push(new Boid(p, boidColor));
  }

  p.determinePopSize = function(width, height, density) {
    area = width * height;
    return area / (100/density);
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
