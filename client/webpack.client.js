const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV == 'production'? 'production' : 'development',
  entry: './src/index.tsx',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.{jsx?,tsx?}$/,
        exclude: /node_modules/,
        use: 'swc-loader',
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};