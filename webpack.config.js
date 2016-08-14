var compileFiles = /\.js$/;
var ignoredFolders = /node_modules/;

module.exports = {
  context: __dirname + '/src',
  entry: './index.js',
  target: 'node',
  output: {
    path: __dirname + '/build',
    filename: 'build.js'
  },

  devtool: 'source-map',

  eslint: {
    configFile: __dirname + '/.eslintrc'
  },

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
