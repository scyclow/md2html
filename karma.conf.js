// Karma configuration

var webpackConfig = require('./webpack.config.js');
webpackConfig.entry = {};

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      { pattern: './specs.webpack.js', watched: true },
      // { pattern: 'src/**/*.js', watched: true },
      { pattern: './node_modules/phantomjs-polyfill/bind-polyfill.js', watched: false }
    ],

    exclude: [],

    preprocessors: {
      './specs.webpack.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    },

    plugins: [
      require("karma-webpack"),
      'karma-jasmine',
      'karma-phantomjs-launcher',
      // 'karma-chrome-launcher',
      'karma-sourcemap-loader'
    ],

    reporters: ['progress', 'dots'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: [
      // 'Chrome',
      'PhantomJS'
    ],

    singleRun: false
  })
}
