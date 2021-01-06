const path = require("path");
const webpack = require("webpack");
const htmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const {CleanWebpackPlugin:CleanDistPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = env => {

	const id_dev = env === "development";
	return {
		devtool: id_dev ? "eval-source-map" : "",
		entry: {
			main: path.join(__dirname, "src/App.tsx"),
		},
		output: {
			path: path.join(__dirname, "static"),
			filename: "[name].js",
			publicPath: "/",
			chunkFilename: id_dev ? 'js/[name].[chunkhash:5].chunk.js' : 'js/[name].chunk.js',
		},
		mode: env,
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: [
						{
							loader:id_dev ? "ts-loader" :"babel-loader"
						}
					]
				},
				{
					test: /.(css|scss)$/,
					use: [

						!id_dev ? {
							loader: MiniCssExtractPlugin.loader,
							options: {
								sourceMap: true,
								publicPath: "/",
							}
						} : {
								loader: "style-loader",
								options: {
									sourceMap: true,
								}
							},
						{
							loader: "css-loader",
							options: {
								sourceMap: true,
							}
						},
						{
							loader: "sass-loader",
							options: {
								sourceMap: true,
							}
						}
					]
				},
				{
					test: /\.(jpg|png|ico|jpeg|gif)$/,
					use: [{
						loader: "url-loader",
						options: {
							name: "[name].[ext]",
							limit: 100,
							publicPath: "../img/",
							outputPath: "img/"
						}
					}]
				},
				{
					test: /\.(eot|svg|ttf|woff|woff2)$/,
					use: [{
						loader: "url-loader",
						options: {
							limit: 5000,
							name: "[name].[ext]",
							publicPath: "../fonts/",
							outputPath: "fonts/"
						}
					}]
				}

			]
		},
		resolve: {
			extensions: ['.js', '.css', ".tsx", '.json', ".scss", ".ts"],
			modules: ['node_modules'],
			plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
			alias: { //配置绝对路径的文件名
				css: path.join(__dirname, 'src/css'),
				component: path.join(__dirname, 'src/component'),
			},
		},
		optimization: {
			// minimize: false,
			namedModules: true,
			namedChunks: true,
			chunkIds: 'named',
			moduleIds: 'named',
			// 优化持久化缓存的, runtime 指的是 webpack 的运行环境(具体作用就是模块解析, 加载) 和 模块信息清单, 模块信息清单在每次有模块变更(hash 变更)时都会变更, 所以我们想把这部分代码单独打包出来, 配合后端缓存策略, 这样就不会因为某个模块的变更导致包含模块信息的模块(通常会被包含在最后一个 bundle 中)缓存失效. optimization.runtimeChunk 就是告诉 webpack 是否要把这部分单独打包出来.
			runtimeChunk: {
				// 包清单
				name: "runtime",
			},
			splitChunks: {
				automaticNameDelimiter: '~', // 分隔符 yong * 可能会导致报错
				chunks: 'all', 
				minSize: 0,
				name: true, 
				// maxSize: 0,
				minChunks: 2,
				maxAsyncRequests: 5,
				maxInitialRequests: 3, // 很重要不然会导致有的js不能打包进去 // 每个入口并行加载的最大请求数（最多能拆分的包）是用来限制入口的拆分数量
				cacheGroups: {
				common: {
				  // 检查异步加载的公共代码
				  name: 'common',
				  chunks: 'async',
				  priority: 4,
				  minChunks: 4
				},
				asyncVendors: {
				  // 异步加载的第三方库
				  name: 'asyncVendors',
				  test: /[\\/]node_modules[\\/]/,
				  chunks: 'async', // 检查异步加载的
				  priority: 8,
				  minChunks: 3
				},
				default: {
					// 检查初始化时，自己的源码的公共代码
					test: /src/,
					chunks: 'initial',
					name: 'commonMain', // 这里要是指定了名字那么，那会把所有这个拆分条件的全放在commonMain这个文件下
					priority: 4,
					minChunks: 3,
					// 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
					reuseExistingChunk: true, 
				},
				vendors: {
					// 检查初始化的，同步加载的第三方库 (也就是entry里的js第一次加载时引入的)
					test: /[\\/]node_modules[\\/]/,
					chunks: 'initial',
					name: 'vendor',
					// filename: '[name].bundle.js',
					priority: -10,
					enforce: true, // 强制检查打包，不管最小或最大的chunk限制
					minChunks: 1,
					reuseExistingChunk: true, 
				},
				// default: { // 这样配置能够把本地加载的公共js拆分出来， 比如多个文件都引入本地的jq  import $ from "./assert/js/jquery.js"; 要是不配置会有默认配置的。默认配置不会的文件名称是以有公共部门的文件名合起来。
				//   minChunks: 1,
				//   priority: -20,
				//   reuseExistingChunk: true,
				// },
				},
			},
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: !id_dev ? 'css/[name].css' : 'css/[name].[hash].css',
				chunkFilename: !id_dev ? 'css/[name].css' : 'css/[id].[hash].css',
			}),
			new htmlWebpackPlugin({
				title: "ts-react",
				filename: "index.html",
				inject: "body",
				hash: true,
				template: path.join(__dirname, "src/index.html"),
				chunks: ["runtime", "main", "vendor","commonMain","asyncVendors","common"]
			}),
		
			new CleanDistPlugin(),
			new webpack.HotModuleReplacementPlugin(),//模块的热替换
			new webpack.HashedModuleIdsPlugin(), // so that file hashes don't change unexpectedly
		],
		devServer: {
			historyApiFallback: true,
			contentBase: path.resolve(__dirname, 'static'),
			quiet: false, //控制台中不输出打包的信息
			noInfo: false,
			inline: true, //开启页面自动刷新,
			hot: true,
			hotOnly: true,//开启后，页面不会刷新，不然一改页面就会刷新
			lazy: false,
			publicPath: "/",
			compress: true,
			progress: false, //显示打包的进度
			overlay: {  //把编译的错误显示在浏览器上
				errors: true,
				warnings: true,
			},
			watchOptions: {
				aggregateTimeout: 300
			},
			clientLogLevel: "none", // cancel console client log
			port: '8099', //设置端口号
			openPage: "index.html",//导航页面
		},
	}
}

