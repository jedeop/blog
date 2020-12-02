const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  name: 'server',
  mode: process.env.NODE_ENV == 'production'? 'production' : 'development',
  target: 'node',
  node: false,
  entry: './src/server.tsx',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/server'),
    publicPath: '/dist/server'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'ts-loader'],
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  externals: [nodeExternals()],
};