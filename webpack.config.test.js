var webpack = require('webpack');
var path = require('path');

var srcDir = path.join(__dirname, 'src');

module.exports = {
  resolve: {
    root: srcDir,
    extensions: ['', '.ts', '.js']
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
    ],
    postLoaders: [
      {
        test: /\.(js|ts)$/,
        loader: 'istanbul-instrumenter-loader',
        include: srcDir,
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/
        ]
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