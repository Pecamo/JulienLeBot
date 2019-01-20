const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  mode: 'production',
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
    alias: {
      discordjs: path.resolve(__dirname, 'node_modules/discord.js/')
    },
    modules: ['src', 'node_modules'],
  },
  node: { fs: 'empty' },
  output: {
    filename: 'JulienLeBot.js',
    path: path.resolve(__dirname, 'dist')
  }
};
