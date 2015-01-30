module.exports = function (config) {
  'use strict';

  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    files: [
      'client/bower_components/moment/moment.js',
      'client/bower_components/lodash/dist/lodash.js',
      'client/bower_components/highlightjs/highlight.pack.js',
      'client/bower_components/github-js/dist/github.js',
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      'client/bower_components/angular-ui-router/release/angular-ui-router.js',
      'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'client/bower_components/angular-ui-select/dist/select.js',
      'client/bower_components/angular-animate/angular-animate.js',
      'client/bower_components/angular-sanitize/angular-sanitize.js',
      'client/bower_components/angular-local-storage/angular-local-storage.js',
      'client/bower_components/angular-highlightjs/angular-highlightjs.js',
      'client/bower_components/angular-hotkeys/build/hotkeys.js',
      'client/app/app.js',
      'client/app/**/*.js',
      'client/app/**/*.html',
      'client/components/**/*.js',
      'client/components/**/*.html',
      '.tmp/options.js',
      'test/helper/commitMockModule.js',
      'test/helper/commentMockModule.js',
      'test/helper/bind-polyfill.js'
    ],
    exclude: [
      'client/worker/*.*'
    ],

    reporters: ['mocha', 'coverage'],
    preprocessors: {
      'client/!(bower_components)/**/!(*.spec).js': 'coverage',
      '**/*.html': 'html2js'
    },
    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/'
    },
    coverageReporter: {
      type: 'html',
      dir: 'test/coverage/'
    },

    autoWatch: false,
    singleRun: true,

    LogLevel: config.LOG_DEBUG,

    browsers: ['Chrome']
  });
};
