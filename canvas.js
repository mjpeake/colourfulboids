let debug = false;

const colourfulBoids = (p) => {
  p.setup = function () {
    // Params
    p.cellSize = 30;
    p.popDensity = 0.0075;

    // Init new flock
    p.flock = [];

    // Determine size of parent div
    const div = p.canvas.parentElement;
    p.createCanvas(div.offsetWidth, div.offsetHeight);

    // Set palette if not set
    if (p.backgroundColor == null) {
      p.randomPalette();
    }

    // Determine num of cells
    p.determineCellCount(div.offsetWidth, div.offsetHeight);

    // Populate
    p.determinePopSize(div.offsetWidth, div.offsetHeight, p.popDensity);
    for (let i = 0; i < p.popSize; i++) p.flock.push(new Boid(p));
  }

  p.determinePopSize = function (width, height, density) {
    p.popSize = (width * height) / (100 / density);
  }

  p.determineCellCount = function (width, height) {
    p.cellCountX = p.round(width / p.cellSize);
    p.cellCountY = p.round(height / p.cellSize);
  }

  p.randomPalette = function () {
    rgb = [p.random(255), p.random(255), p.random(255)];
    p.backgroundColor = p.color(rgb[0], rgb[1], rgb[2]);
    p.boidColor = p.color(255 - rgb[0], 255 - rgb[1], 255 - rgb[2]);
    p.debugColor = p.color(rgb[0] - 50, rgb[1] - 50, rgb[2] - 50);

    if (!isReadable(p.boidColor, p.backgroundColor)) {
      p.randomPalette();
    }
  }

  p.draw = function () {
    p.background(p.backgroundColor);
    if (debug) {
      p.drawDebug()
    }

    // Update boids
    for (let boid of p.flock) {
      boid.contain();
      boid.flock(p.flock);
      boid.update();
      boid.draw();
    }
  }

  p.drawDebug = function () {
    p.stroke(p.debugColor);
    p.strokeWeight(1);
    for (var x = 0; x < p.width; x += p.width / p.cellCountX) {
      p.line(x, 0, x, p.height);
    }
    for (var y = 0; y < p.height; y += p.height / p.cellCountY) {
      p.line(0, y, p.width, y);
    }

    p.fill(p.backgroundColor);
    p.rect(0, 0, 120, 70);
    p.noFill();
    p.text("FPS:  " + p.round(p.frameRate()), 15, 20);
    p.text("POP: " + p.flock.length, 15, 35);
    p.text("CELLS: " + p.cellCountX * p.cellCountY, 15, 50);
  }

  p.windowResized = function () {
    p.setup();
  }
}

// isReadable determines if the two colours are different enough to be readable
function isReadable(textColor, bgColor) {
  // Calculate the contrast ratio
  const contrastRatio = calculateContrastRatio(textColor, bgColor);

  // Check if the contrast ratio is sufficient for readability
  return contrastRatio >= 3.5;
}

function calculateContrastRatio(color1, color2) {
  // Calculate relative luminance using the W3C formula
  const luminance1 = calculateLuminance(color1.levels[0], color1.levels[1], color1.levels[2]);
  const luminance2 = calculateLuminance(color2.levels[0], color2.levels[1], color2.levels[2]);

  // Calculate the contrast ratio
  const brighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  const contrastRatio = (brighter + 0.05) / (darker + 0.05);

  return contrastRatio;
}

function calculateLuminance(r, g, b) {
  // W3C luminance formula
  return 0.2126 * luminanceChannel(r / 255) +
    0.7152 * luminanceChannel(g / 255) +
    0.0722 * luminanceChannel(b / 255);
}

function luminanceChannel(value) {
  // Adjust gamma for each color channel
  if (value <= 0.03928) {
    return value / 12.92;
  } else {
    return Math.pow((value + 0.055) / 1.055, 2.4);
  }
}