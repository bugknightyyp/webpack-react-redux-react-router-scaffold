

/**
 * 
 * 
 *  http://blog.csdn.net/mjzhang1993/article/details/64440148
 *  https://github.com/zzlw/webpack-dev-super
 *
 * https://codeburst.io/how-to-lazy-load-features-using-react-and-webpack-557f559ccde7
 */
const path = require('path');
const webpack = require('webpack')



module.exports = {
	context: __dirname,
	entry: {
        vendor: ['react', 'react-dom', 'redux', 'react-redux', 'react-router-dom'],
    },
	output: {
		filename: "vendor.js", // best use [hash] here too
		path: path.resolve(__dirname, "dll"),
		library: "vendor_lib_[hash]",
	},
	plugins: [
		new webpack.DllPlugin({
			name: "[name]_[hash]",
			path: path.resolve(__dirname, "dll/vendor-manifest.json"),
		}),
	],
};
