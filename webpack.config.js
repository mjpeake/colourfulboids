const path = require('path');

module.exports = {
  entry: './colourfulboids/sketch.js',
  output: {
    filename: 'colourfulboids.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'var',
    library: 'ColourfulBoids'
  },
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true
  }
};