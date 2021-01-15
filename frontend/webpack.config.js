/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const nodeExternals = require("webpack-node-externals");
const LoadablePlugin = require("@loadable/webpack-plugin");
const NodemonPlugin = require("nodemon-webpack-plugin");


const getConfig = (mode) => {
  const isDevMode = process.env.NODE_ENV !== "production";
  const isServer = mode == "server";

  return {
    name: mode,
    mode: isDevMode ? "production" : "development",
    target: isServer ? "node" : "web",
    node: isServer ? false : undefined,
    watch: isDevMode,
    entry: `./src/${mode}.tsx`,
    output: {
      filename: "[name].js",
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
    plugins: isServer ? [new NodemonPlugin()] : [new LoadablePlugin()],
    externals: isServer ? [nodeExternals()] : [],
  };
};

module.exports = [
  getConfig("client"),
  getConfig("server"),
];