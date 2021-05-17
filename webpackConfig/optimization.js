/**
 * @name SEkin
 * @description description
 * @time 2020-07-10
 */
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = function () {
  return {
    // minimize: false,
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
    emitOnErrors: true,
    chunkIds: "named",
    moduleIds: "named",
    // 优化持久化缓存的, runtime 指的是 webpack 的运行环境(具体作用就是模块解析, 加载) 和 模块信息清单, 模块信息清单在每次有模块变更(hash 变更)时都会变更, 所以我们想把这部分代码单独打包出来, 配合后端缓存策略, 这样就不会因为某个模块的变更导致包含模块信息的模块(通常会被包含在最后一个 bundle 中)缓存失效. optimization.runtimeChunk 就是告诉 webpack 是否要把这部分单独打包出来.
    runtimeChunk: {
      // 包清单
      name: "runtime",
    },
    splitChunks: {
      automaticNameDelimiter: "*",
      chunks: "all",
      // minSize: 30000,
      // maxSize: 0,
      minChunks: 2,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      cacheGroups: {
        asyncCommon: {
          //检查异步加载的公共代码
          name: "asyncCommon",
          chunks: "async",
          priority: 4,
          minChunks: 2,
        },
        asyncVendors: {
          //异步加载的第三方库
          name: "asyncVendors",
          test: /[\\/]node_modules[\\/]/,
          chunks: "async", //检查异步加载的
          priority: 4,
          minChunks: 2,
        },
        vendors: {
          //检查初始化的，同步加载的第三方库 (也就是entry里的js第一次加载时引入的)
          test: /[\\/]node_modules[\\/]/,
          chunks: "initial",
          name: "vendors",
          priority: 3,
          //    enforce: true,//强制检查打包，不管最小或最大的chunk限制
          minChunks: 1,
        },
        default: {
          //检查初始化时，自己的源码的公共代码
          test: /src/,
          chunks: "initial",
          name: "common",
          priority: 2,
          minChunks: 2,
        },
      },
    },
  };
};
