This JavaScript project simulates a flock of colorful boids moving around a canvas. The boids exhibit flocking behavior, including alignment, cohesion, and separation. Each boid is represented by a series of colored dots forming its body.

## Installation

You can install Colourful Boids via npm:
```bash
npm i @mjpeake/colourfulboids
```

Alternatively, you can also use the following script tag reference:
```html
<script src="https://cdn.jsdelivr.net/npm/@mjpeake/colourfulboids@1.0.1/dist/colourfulboids.js"></script>
```

## Parameters

```javascript
ColourfulBoids(parentElement, boidColor, backgroundColor);
```

- `parentElement`: The HTML element where the Boids canvas will be appended.
- `boidColor`: Optional. The color of the Boids in hexadecimal notation. If not provided, a random palette will be used.
- `backgroundColor`: Optional. The background color of the canvas in hexadecimal notation. If not provided, a random palette will be used.

## Usage

To use Colourful Boids in your project, include the library in your HTML file and initialize it with the appropriate parameters. Here's an example:

```html {linenos=inline}
<!DOCTYPE html>
<html>

<head>
  <title>Colourful Boids</title>
  <link rel="stylesheet" href="assets/style.css">
  <script src="https://cdn.jsdelivr.net/npm/@mjpeake/colourfulboids@1.0.1/dist/colourfulboids.js"></script>
  <script> ColourfulBoids("boids") </script>
</head>

<body>
  <div id="boids"></div>
</body>

</html>
```

This example initializes a Colourful Boids visualization without defining any specific colours to be used, as a result the sketch will randomly select two contrasting colours.

## Features

- **Flocking Behavior**: The boids exhibit realistic flocking behavior, including alignment, cohesion, and separation.
- **Colorful Visualization**: Each boid is represented by a series of colored dots forming its body, creating an aesthetically pleasing visualization.
- **Dynamic Population**: The population size of the flock adjusts based on the size of the canvas and the internally-specified population density.

## Credits

This project was inspired by Craig Reynolds' classic [boids](https://www.red3d.com/cwr/boids/) algorithm for simulating flocking behavior.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/mjpeake/colourfulboids/blob/main/LICENSE) file for details.