const path = require('path');
const LoadablePlugin = require('@loadable/webpack-plugin')

const isDevMode =  process.env.node_env !== 'production'

module.exports = {
  name: `client`,
  mode: isDevMode ? 'production' : 'development',
  watch: isDevMode,
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
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [new LoadablePlugin()],
}
