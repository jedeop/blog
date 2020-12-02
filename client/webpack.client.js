const path = require('path');
const LoadablePlugin = require('@loadable/webpack-plugin')

module.exports = {
  name: `client`,
  mode: process.env.NODE_ENV == 'production' ? 'production' : 'development',
  entry: `./src/client.tsx`,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, `dist/client/`),
    publicPath: `/dist/`,
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
  },
  plugins: [new LoadablePlugin()],
}
