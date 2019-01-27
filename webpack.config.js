const path = require('path');
const webpack = require("webpack");

module.exports = {
  entry: './index.ts',
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js', '.json' ],
    modules: ['src', 'node_modules', 'config', '.']
  },
  node: { fs: 'empty' },
  plugins: [
    new webpack.WatchIgnorePlugin([
      /\.js$/,
      /\.d\.ts$/
    ])
  ],
  output: {
    filename: 'JulienLeBot.js',
    path: path.resolve(__dirname, 'dist')
  }
};
