var webpack = require('webpack');
var compileFiles = /\.js$/;
var ignoredFolders = /node_modules/;

module.exports = {
  context: __dirname + '/src',
  entry: './index.js',
  target: node,
  output: {
    path: __dirname + '/build',
    filename: 'build.js'
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],

  module: {
    preLoaders: [
      {
        test: compileFiles,
        exclude: ignoredFolders,
        loaders: ['eslint-loader']
      }
    ],

    loaders: [
      {
        test: compileFiles,
        exclude: ignoredFolders,
        loaders: ['babel']
      }
    ]
  }
};
