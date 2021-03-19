require("dotenv").config();
const webpack = require("webpack");
const path = require("path");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const ENDPOINT_URL = process.env.ENDPOINT_URL;

module.exports = {
  mode: "production",
  entry: {
    snippet: "./_snippet/index.js",
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      __EVENTS_ENDPOINT__: JSON.stringify(ENDPOINT_URL),
      __AUTO_TRACK_PAGEVIEWS__: JSON.stringify(
        process.env.AUTO_TRACK_PAGEVIEWS
      ),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  // optimization: {
  //   minimizer: [
  //     new UglifyJsPlugin({
  //       uglifyOptions: {
  //         toplevel: true,
  //         mangle: true,
  //       },
  //       extractComments: true,
  //     }),
  //   ],
  // },
  output: {
    filename: "[name].js",
    libraryTarget: "umd",
    library: "lib",
    path: path.resolve(__dirname, "public"),
  },
};
