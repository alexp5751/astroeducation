// Karma configuration
// Generated on Mon Oct 17 2016 14:53:36 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'cb.astroeducation.gatech.edu/js/angular.min.js',
      'node_modules/angular-mocks/angular-route.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'cb.astroeducation.gatech.edu/js/jquery-2.2.3.min.js',
      'cb.astroeducation.gatech.edu/js/bootstrap.min.js',
      // 'cb.astroeducation.gatech.edu/js/three/three.js',
      // 'cb.astroeducation.gatech.edu/js/three/FlyControls.js',
      // 'cb.astroeducation.gatech.edu/js/three/physi.js',
      // 'cb.astroeducation.gatech.edu/js/three/DAT.GUI.js',
      'cb.astroeducation.gatech.edu/js/loadscript.js',

      'cb.astroeducation.gatech.edu/app.js',
      'cb.astroeducation.gatech.edu/**/*.html',
      'tests/unit/**/*.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],
  })
}
