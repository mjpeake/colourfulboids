const debounce = require("debounce");
const Boid = require("./boid.js");
const p5 = require("p5");

function ColourfulBoids(element, boidColor, backgroundColor) {
  const sketch = (p) => {
    p.setup = function () {
      // Params
      p.debug = false;
      p.cellSize = 30;
      p.popDensity = 0.005;

      // Init new flock
      p.flock = [];

      // Determine size of parent div
      const div = p.canvas.parentElement;
      p.createCanvas(div.offsetWidth, div.offsetHeight);

      // Set palette
      if (boidColor != null && backgroundColor != null) {
        p.boidColor = p.color(boidColor);
        p.backgroundColor = p.color(backgroundColor);
      } else {
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
      if (p.debug) {
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

    p.resize = function () {
      // Only resize if the canvas size has actually changed
      const div = p.canvas.parentElement;
      if (p.canvas.offsetWidth != div.offsetWidth || p.canvas.offsetHeight != div.offsetHeight) {
        p.setup();
      }
    }
    p.windowResized = debounce(p.resize, 100);
  }
  new p5(sketch, element)
}
module.exports = ColourfulBoids;

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