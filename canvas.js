const colourfulBoids = ( p ) => {
  let flock = [];
  const boidCount = 50; // Size of Population

  const paletteBoid =       ["#bda794", "#80754d", "#b389b1", "#125720", "#a72c6b", "#38300f", "#55f9d1", "#088824", "#2c85d0", "#efaad1", "#4a3030", "#306a40", "#b9361a", "#f15a3a", "#a75f2d", "#7fd9fb", "#20a463", "#36ac2d", "#894624", "#890622"];
  const paletteBackground = ["#426b58", "#7fb28a", "#4c4e76", "#eddfa8", "#5894d3", "#c7f0cf", "#aa2e06", "#f7db77", "#d32f7a", "#102e55", "#b5cfcf", "#cfbf95", "#46e5c9", "#0ec5a5", "#58d2a0", "#800426", "#df9c5b", "#c9d253", "#76dbb9", "#76ddf9"];

  let boidColor, backgroundColor, alpha, alpha2;
  let jitter = 0; // Jitter between alpha and alpha2

  p.setup = function() {
    // Determine size of parent div
    const div = p.canvas.parentElement;
    p.createCanvas(div.offsetWidth, div.offsetHeight);

    // One in eight chance of rainbow boids
    if(backgroundColor == null) {
      if(p.floor(p.random(8)) != 0) {
        // Select colour from palette
        let c = p.floor(p.random(paletteBoid.length));
        boidColor = p.color(paletteBoid[c]);
        backgroundColor = p.color(paletteBackground[c]);
        alpha = p.color(paletteBackground[c]);
        alpha2 = p.color(paletteBackground[c]);
        p.print(c);
      } else {
        // Select rainbow boids
        boidColor = null;
        backgroundColor = p.color(248);
        alpha = p.color(248);
        alpha2 = p.color(248);
      }
      alpha.setAlpha(25);
      alpha2.setAlpha(50);
    }
    p.background(backgroundColor);

    // Populate flock
    flock = [];
    for(let i = 0; i < boidCount; i++) flock.push(new Boid(p, boidColor));
  }

  p.draw = function() {
    // Alternate between alpha values
    if(jitter % 2 == 0) {
      p.background(alpha);
      jitter = 0;
    } else {
      p.background(alpha2);
    }
    jitter++;

    // Update boids
    for(let boid of flock) {
      boid.contain();
      boid.flock(flock);
      boid.update();
      boid.show();
    }
  }

  p.windowResized = function() {
    p.setup();
  }
}
