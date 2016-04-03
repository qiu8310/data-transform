var webpack = require('webpack');
var path = require('path');

var srcDir = path.join(__dirname, 'src');

var minify = process.argv.indexOf('-p') > 0;

module.exports = {
  devtool: 'source-map',
  resolve: {
    root: srcDir,
    extensions: ['', '.ts', '.js']
  },
  entry: {
    'data-transform': './src/data-transform.ts'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle' + (minify ? '.min' : '') + '.js',
    library: 'DT',
    libraryTarget: 'umd'
  },
  module: {
    preLoaders: [
      {
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: /\.e2e\.ts$/
      },
      {
        test: /\.json$/,
        loader: 'json5-loader'
      }
    ]
  },

  node: {
    __filename: true,
    __dirname: true
  },

  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: srcDir
  }
}