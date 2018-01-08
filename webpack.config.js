const path = require('path')
const webpack = require("webpack");
const process = require('process')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const prod = process.argv.indexOf('-p') !== -1;


let packages = require(path.resolve(__dirname, 'package.json'))


let config = {
  //context: __dirname + "/app",
  entry: {
      "main": [ 
        'webpack-dev-server/client?http://localhost:80',
        'webpack/hot/only-dev-server',
        "./app/routes/home/index.jsx"
      ],
      //"vendors": ['react']
  },
  resolve: {
        modules: ["node_modules", "components", "less", "stores"],
        extensions: [".js", ".json", ".jsx", ".css", ".less"],
        alias: {
        }
    },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    chunkFilename: '[chunkhash].chunk.js',
    publicPath: '/manage/js/'

  },
  module: {
    //noParse: [pathToEs6Promise, pathToFetch, pathToFastClick, /ua-parser\.js/],
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader'},
          {
            loader: 'css-loader',
            options: {
            //  modules: true
            }
          }
        ]
      },
      // LESS
      {
        test: /\.less$/,//"modifyVars": '+ JSON.stringify(require('./variables.less.js'))  +',
        use: [//'style!css!postcss!less'
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('precss'),
                  require('autoprefixer')
                ];
              }
            }
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      // iconfont
      {
        test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
        use: 'url-loader'
      },
      // iconfont
      {
        test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
        use: 'url-loader'
      },
      {
          test: /\.((js)|(jsx)|(store)|(view))$/,
          use: {
            loader: 'babel-loader',
            options: {
              "presets": [
                ["@babel/preset-env", {
                  "targets": {
                    "browsers": ["last 2 versions", "safari >= 7"]
                  },
                  "loose": true,
                  "modules": false,
                  "useBuiltIns": true,
                  "debug": true
                }],
                "@babel/preset-react",
                
              ]
            }
          },
          include: [
            path.resolve(__dirname, "app")
          ]

     },
    ],
  },
  resolveLoader: {
    // modules: ["node_modules"],
    // moduleExtensions: ['-loader'],
    // extensions: ['.js', '.json', '.coffee']
    //include://没有这个配置
  },
  //"node_modules/.bin/webpack-dev-server  --devtool eval --progress --colors --hot --port 80 --inline  --content-base ."
  devServer: {
    contentBase: path.join(__dirname, "app"),
    watchContentBase: true,
    compress: true,
    open: true,
    port: 80,
    hot: true,
    inline: true,
    watchOptions: {
      poll: 1000,
      ignored: /node_modules/
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEBUG__: true,
      __VERSION__:  JSON.stringify(packages.version)
    }),
    new webpack.DllReferencePlugin({
			context: path.join(__dirname, "..", "dll"),
			manifest: require("./dll/vendor-manifest.json") // eslint-disable-line
		}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendors",
      // (the commons chunk name)

      //filename: "vendors.js",
      // (the filename of the commons chunk)

      minChunks: function (module) {
         // this assumes your vendor imports exist in the node_modules directory
         return module.context && module.context.indexOf('node_modules') !== -1;
      },
      //children: true
      // (Modules must be shared between 3 entries)
    }),
    new HtmlWebpackPlugin()
  ],
};

if (!prod) {
  config.devtool = "inline-source-map"
}

module.exports = config