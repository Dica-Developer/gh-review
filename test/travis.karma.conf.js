module.exports = function (config) {
  'use strict';

  config.set({
    basePath: '..',
    frameworks: ['jasmine', 'requirejs'],

    files: [{
      pattern: 'app/js/**/*.js',
      included: false
    }, {
      pattern: 'app/js/**/*.html',
      included: false
    }, {
      pattern: 'app/bower_components/**/*.js',
      included: false
    }, {
      pattern: 'app/bower_components/bootstrap/less/bootstrap.less'
    }, {
      pattern: 'test/specs/**/*-spec.js',
      included: false
    }, {
      pattern: 'test/helper/**/*.js',
      included: false
    }, {
      pattern: 'test/lib/**/*.js',
      included: true
    }, {
      pattern: 'app/templates/**/*.html',
      included: false
    }, 'test/test-main.js'],

    browsers: ['PhantomJS'],

    reporters: ['dots', 'coverage'],
    preprocessors: {
      'app/js/!(github)/*.js': ['coverage'],
      'app/js/*.js': ['coverage'],
      'app/bower_components/bootstrap/less/*.less': ['less']
    },
    lessPreprocessor: {
      options: {
        paths: ['app/bower_components/bootstrap/less'],
        save: true,
        transformPath: function (path) {
          return path.replace(/\.less$/, '.compiled.css');
        }
      }
    },
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage'
    },

    logLevel: config.LOG_INFO,

    autoWatch: false,
    singleRun: true
  });
};
