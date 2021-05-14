/**
 * @author: SEKin 
 * @Date: 2021-05-14 13:43:43 
 * @description:  
 * @Last Modified time: 2021-05-14 13:43:43 
 */
const path = require("path");
const fs = require("fs");
const moduleFn = require("./webpackConfig/module");
const pluginFn = require("./webpackConfig/plugin");
const optimizationFn = require("./webpackConfig/optimization");
const devServer = require("./webpackConfig/devServer.js");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = (env) => {
  const isDev = env.dev;
  return {
    target: 'web',
    devtool: isDev ? "eval-source-map" : false,
    entry: {
      main: path.join(__dirname, "src/App.tsx"),
    },
    output: {
      path: path.join(__dirname, "./static"),
      filename: "[name].[contenthash:5].js",
      publicPath: "", 
      chunkFilename: "js/[name].[chunkhash:5].js",
      clean: true,
    },
    mode: isDev ? "development" : "production",
    resolve: {
      extensions: [".js", ".css", ".ts", ".tsx", ".scss"],
      modules: ["node_modules"],
      plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
      alias: {
        // 配置绝对路径的文件名
        css: path.join(__dirname, "src/css"),
        component: path.join(__dirname, "src/Common/component"),
        api: path.join(__dirname, "src/api"),
        assert: path.join(__dirname, "src/assert"),
      },
    },
    optimization: optimizationFn(),
    module: moduleFn(isDev),
    plugins: pluginFn(isDev),
    devServer: devServer(),
    experiments:{
      syncWebAssembly: true
    },
    stats: {
       children: true
    }
  };
};
