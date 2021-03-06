var path = require('path');
var join = path.join;

var SvgStore = require('webpack-svgstore-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var webpack = require('webpack');
var prod = process.env.NODE_ENV === 'production';

module.exports = {
  context: join(__dirname, 'app'),
  entry: {
    vendor: ["react", "react-dom", "react-hot-loader"],
    app: [
      './app.jsx'
    ]
  },
  output: {
    filename: 'app.bundle.js',
    path: join(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: [/dist/],
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.js$/,
        include: [join(__dirname, 'app')],
        exclude: [/node_modules/, /dist/],
        loader: 'babel-loader'
      },
      {
        test: /\.jsx$/,
        include: [join(__dirname, 'app')],
        exclude: [/node_modules/, /dist/],
        loader: 'babel-loader!react-vue-style-loader'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css-loader!sass-loader')
      }
    ]
  },
  resolve: {
    modules: [
      join(__dirname, 'app'),
      join(__dirname, 'uikit'),
      "node_modules"
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
    new ExtractTextPlugin("app.bundle.css"),
    new SvgStore({
      svgoOptions: {
        plugins: [
          { removeTitle: true }
        ]
      },
      prefix: 'icon-'
    })
  ]
};

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = module.exports.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(true)
  ]);
} else {
  module.exports.devtool = '#source-map';
  module.exports.watchOptions = { poll: true };
}