const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let mode = 'development';
let target = 'web';

if (process.env.NODE_ENV === 'production') {
	mode = 'production';
	target = 'browserslist';
}

module.exports = {
	mode: 'development',
	// devtool: 'source-map',
	devServer: {
		historyApiFallback: true,
		static: path.resolve(__dirname, './build'),
		open: true,
		compress: true,
		hot: false,
		port: 8080,
		client: {
			overlay: {
				errors: true,
				warnings: false,
			},
			progress: true,
		},
	},
	entry: {
		main: path.resolve(__dirname, './src/js/index.js'),
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: '[name].bundle.[contenthash].js',
		assetModuleFilename: 'assets/[name][ext]',
		chunkFilename: '[id].chunk.[contenthash].js',
		clean: true,
	},
	target,
	module: {
		rules: [
			{
				test: /\.html$/,
				use: 'html-loader',
			},
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						cacheDirectory: true,
					},
				},
			},
			{
				test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/i,
				exclude: /node_modules/,
				type: mode === 'production' ? 'asset' : 'asset/resource',
			},
			{
				test: /\.m?mp3$/,
				exclude: /node_modules/,
				type: 'asset/resource',
			},
			{
				test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
				exclude: /node_modules/,
				type: 'asset/inline',
			},
			{
				test: /\.(s[ac]|c)ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					{loader: 'css-loader'},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								sourceMap: true,
								plugins: [autoprefixer],
							},
						},
					},
					{loader: 'sass-loader'},
				],
			},
		],
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'src/assets/favicons/cas-share.jpg'),
					to: path.resolve(__dirname, 'build/assets'),
				},
				{
					from: path.resolve(__dirname, 'src/assets/video/review'),
					to: path.resolve(__dirname, 'build/assets/video/review'),
				},
				{
					from: path.resolve(__dirname, 'src/playables'),
					to: path.resolve(__dirname, 'build/playables'),
				},
			],
		}),
		// new BundleAnalyzerPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
		}),
		new HtmlWebpackPlugin({
			title: '[title]',
			template: './src/index.html',
		}),
		new WebpackPwaManifest({
			name: 'CAS',
			publicPath: './',
			icons: [
				{src: path.resolve('./src/assets/favicons/favicon-cas-192x192.jpg'), sizes: '192x192'},
				{src: path.resolve('./src/assets/favicons/favicon-cas-512x512.jpg'), sizes: '512x512'},
			],
		}),
	],
};
