var webpack = require('webpack');
var path = require('path');

var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HistoryApiFallback = require('connect-history-api-fallback');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpackUglifyJsPlugin = require('webpack-uglify-js-plugin');

var SOURCE_DIR = path.resolve(__dirname, './src');
var COMPONENTS_DIR = path.resolve(SOURCE_DIR, './components');
var LIBRARIES_DIR = path.resolve(__dirname, './libraries');
var BUILD_DIR = path.resolve(__dirname, './dist');
var MODULES_DIR = path.resolve(__dirname, './node_modules');

var env = "production";
var dev = true;
var dir = "";
process.argv.forEach(function(element, index) {
  if (element.indexOf("env=") > -1) {
    env = element.replace("env=", "");
    if (env == "production") {
      dev = false;
    }
  } else if (element.indexOf("dir=") > -1) {
    dir = element.replace("dir=", "");
  }
});

var definePlugin = new webpack.DefinePlugin({
  __DEV__: false,
  __DIRECTORY__: JSON.stringify(dir),
  'process.env':{
    'NODE_ENV': JSON.stringify(env) // production or develop
  }
});

var vendorList = [
  'three',
];

var corePlugins = [
  definePlugin,
  new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"./js/vendor-bundle.js"),
  // new webpack.ProvidePlugin({
  //   // 'googletile': 'imports?this=>global!exports?googletile!googletile',
  //   // 'leaflet-canvas-marker': 'imports?this=>global!exports?leaflet-canvas-marker!leaflet-canvas-marker',
  //   // 'iscroll': 'imports?this=>global!exports?iscroll!iscroll',
  //   // 'chartjs': 'imports?this=>global!exports?chartjs!chartjs',
  //   // 'createjs': 'imports?this=>global!exports?createjs!createjs',
  // })
  // ,
  new CopyWebpackPlugin([
    { from: path.join(SOURCE_DIR, "./.htaccess"), to: BUILD_DIR },
    { from: path.join(SOURCE_DIR, "./index.html"), to: path.join(BUILD_DIR, "./index.html") },
    { from: path.join(SOURCE_DIR, "./favicons/"), to: path.join(BUILD_DIR, "./favicons/") },
    { from: path.join(SOURCE_DIR, "./assets/"), to: path.join(BUILD_DIR, "./assets/") },
    // { from: path.join(SOURCE_DIR, "./data/"), to: path.join(BUILD_DIR, "./data/") },
    // { from: path.join(SOURCE_DIR, "./assets/"), to: path.join(BUILD_DIR, "./assets/") },
    // { from: path.join(__dirname, "./libraries/"), to: path.join(BUILD_DIR, "./js/") }
  ]),
  new ExtractTextPlugin("./css/app-bundle.css", {
    allChunks: true
  }),
];

var extraPlugins = [
  new BrowserSyncPlugin({
    host: process.env.IP || 'localhost',
    port: process.env.PORT || 3000,
    open: false,
    server: {
      baseDir: BUILD_DIR,
      middleware: [ HistoryApiFallback() ]
    }
    // proxy: 'http://localhost'
  })
];

if (env == 'production') {
  extraPlugins.push(
      new webpackUglifyJsPlugin({
      cacheFolder: path.resolve(__dirname, 'public/cached_uglify/'),
      debug: false,
      minimize: true,
      sourceMap: false,
      output: {
        comments: false
      },
      compressor: {
        warnings: false,
        drop_console: true,
      }
    })
  );
}

var loaders = [
  { test: /\.(jpg|png)$/, loader: "file-loader?limit=10000&name=/images/[hash].[ext]" },
  { test: /\.jsx?/, exclude: MODULES_DIR, loader: 'babel' },
  { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') },
  { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff&name=/fonts/[hash].[ext]" },
  { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff&name=/fonts/[hash].[ext]" },
  { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream&name=/fonts/[hash].[ext]" },
  { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file?limit=10000&&name=/fonts/[hash].[ext]" },
  { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml&name=/fonts/[hash].[ext]" }
];

var config = {
  entry: {
    app: path.join(COMPONENTS_DIR, "./index.js"),
    vendor: vendorList
  },
  output: {
    path: BUILD_DIR,
    filename: './js/[name]-bundle.js',
    publicPath: dir
  },
  plugins: corePlugins.concat(extraPlugins),
  devtool: 'eval',
  resolve: {
    // Absolute path that contains modules
    root: __dirname,
    // Directory names to be searched for modules
    modulesDirectories: ['libraries', 'node_modules'],
    extensions: ['', '.js', '.jsx'],
    alias: {
      // 'googletile' : path.join(__dirname, './node_modules/leaflet-plugins/layer/tile/Google.js'),
      // 'leaflet-canvas-marker' : path.join(__dirname, './libraries/leaflet-canvas-marker.js'),
      // 'iscroll' : path.join(__dirname, './libraries/iscroll-zoom.js'),
      // 'chartjs' : path.join(__dirname, './libraries/Chart.Core.js'),
      // 'createjs' : path.join(__dirname, './libraries/createjs.js')
    }
  },
  module : {
    loaders : loaders
  }
};

module.exports = config;
