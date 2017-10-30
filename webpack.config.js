const path = require('path');

module.exports = {
  entry: {
    login: './src/login.js',
    session: './src/session.js',
  },
  output: {
    path: path.resolve(__dirname, 'public/javascripts'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          path.resolve(__dirname, 'node_modules'),
        ],
        loader: 'babel-loader',
        options: {
          presets: ['es2015'],
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
  devtool: 'inline-source-map',
  node: {
    fs: 'empty',
  },
};
