/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const nodeExternals = require("webpack-node-externals");
const LoadablePlugin = require("@loadable/webpack-plugin");
const NodemonPlugin = require("nodemon-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const getConfig = (mode) => {
  const isDevMode = process.env.NODE_ENV !== "production";
  const isServer = mode == "server";

  return {
    name: mode,
    mode: isDevMode ? "development" : "production",
    target: isServer ? "node" : "web",
    node: isServer ? false : undefined,
    watch: isDevMode,
    entry: `./src/${mode}.tsx`,
    output: {
      filename: isServer ? "[name].js" : "[name].[chunkhash].js",
      path: path.resolve(__dirname, `dist/${mode}/`),
      publicPath: "/dist/",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ["babel-loader", "ts-loader"],
        },
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "@": path.resolve(__dirname, "src")
      }
    },
    plugins: isServer ? [new CleanWebpackPlugin(), new NodemonPlugin()] : [new CleanWebpackPlugin(), new LoadablePlugin()],
    externals: isServer ? [nodeExternals()] : [],
    optimization: {
      runtimeChunk: true,
    },
  };
};

module.exports = [
  getConfig("client"),
  getConfig("server"),
];