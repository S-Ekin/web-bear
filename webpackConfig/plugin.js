/**
 * @name SEkin
 * @description
 * @time 2021-01-25
 */
const webpack = require("webpack");
const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin: CleanDistPlugin } = require("clean-webpack-plugin"); // 清理指定文件夹
const CopyWebpackPlugin = require("copy-webpack-plugin"); // 复制静态文件
const ProgressBarPlugin = require("progress-bar-webpack-plugin"); // 查看打包进度
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
module.exports = function (isDev) {
  return [
    isDev
      ? function () {} : new ExtractCssChunks ({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "css/[name].[contenthash:5].css",
      chunkFilename: "css/[id].[contenthash:5].css",
    }),
    new ProgressBarPlugin(),
    new htmlWebpackPlugin({
      title: "ts-react",
      filename: "index.html",
      inject: "body",
      hash: true,
      template: path.join(__dirname, "../src/index.html"),
      chunks: ["runtime", "main", "vendors", "common","asyncCommon","asyncVendors"],
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "./src/assert", to: "./assert" }],
    }),
  //  new webpack.HotModuleReplacementPlugin(), //模块的热替换
    // new webpack.ids.HashedModuleIdsPlugin(), // so that file hashes don't change unexpectedly
    // isDev ? function () {} : new CleanDistPlugin(),
    // isDev
    //   ? function () {}
    //   : new BundleAnalyzerPlugin({
    //       analyzerMode: "server",
    //       analyzerHost: "127.0.0.1",
    //       analyzerPort: 8889,
    //       reportFilename: "report.html",
    //       defaultSizes: "parsed",
    //       openAnalyzer: true,
    //       generateStatsFile: false,
    //       statsFilename: "stats.json",
    //       statsOptions: null,
    //       logLevel: "info",
    //     }),
  ];
};
