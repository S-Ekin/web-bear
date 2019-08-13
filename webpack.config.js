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
		devtool: id_dev ? "eval-source-map" : "source-map",
		entry: {
			main: path.join(__dirname, "src/main.tsx"),
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
							loader: "ts-loader"
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
				js: path.join(__dirname, 'src/js'),
			},
		},
		optimization: {
			//minimize: false,


		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: !id_dev ? 'css/[name].css' : 'css/[name].[hash].css',
				chunkFilename: !id_dev ? 'css/[id].css' : 'css/[id].[hash].css',
			}),
			new htmlWebpackPlugin({
				title: "ts-react",
				filename: "index.html",
				inject: "body",
				hash: true,
				template: path.join(__dirname, "src/index.html"),
				chunks: ["manifest", "main", "vendor","commonMain"]
			}),
		
			new CleanDistPlugin(),
			new webpack.HotModuleReplacementPlugin(),//模块的热替换
			new webpack.NamedModulesPlugin(), //热更新时显示更新的模块的名字，默认是模块的id
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

