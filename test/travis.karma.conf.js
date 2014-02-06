module.exports = function(config) {
  'use strict';

  config.set({
    basePath: '..',
    frameworks: ['jasmine', 'requirejs'],

    files: [
      {pattern: 'app/js/**/*.js', included: false},
      {pattern: 'app/bower_components/**/*.js', included: false},
      {pattern: 'test/specs/**/*-spec.js', included: false},
      {pattern: 'test/helper/**/*.js', included: false},
      {pattern: 'test/lib/**/*.js', included: true},

      'test/test-main.js'
    ],

    browsers: ['PhantomJS'],
    reporters: ['dots'],

    logLevel: config.LOG_INFO,

    autoWatch: false,
    singleRun: true
  });
};
