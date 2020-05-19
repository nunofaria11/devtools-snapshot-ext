const path = require('path');
const SizePlugin = require('size-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	devtool: 'sourcemap',
	stats: 'errors-only',
	entry: {
		background: './source/background',
		contentInject: './source/content-inject',
		content: './source/content',
		panel: './source/panel',
		devtools: './source/devtools'
	},
	output: {
		path: path.join(__dirname, 'distribution'),
		filename: '[name].js'
	},
	plugins: [
		new SizePlugin(),
		new CopyWebpackPlugin([
			{
				from: '**/*',
				context: 'source',
				ignore: ['*.js']
			},
			{
				from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js'
			}
		])
	],
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					mangle: true,
					compress: true,
					output: {
						beautify: false
					}
				}
			})
		]
	}
};
