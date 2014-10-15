module.exports = function (config) {
  config.set({
    basePath: '../',
    frameworks: ['jasmine'],
    files: [
      'test/helper/shim-polyfill.js',
      'app/bower_components/moment/min/moment.min.js',
      'app/bower_components/lodash/dist/lodash.min.js',
      'app/bower_components/highlightjs/highlight.pack.js',
      'app/bower_components/github-js/dist/github.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.min.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'app/bower_components/angular-ui-select/dist/select.js',
      'app/bower_components/angular-animate/angular-animate.min.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-local-storage/angular-local-storage.min.js',
      'app/bower_components/angular-highlightjs/angular-highlightjs.min.js',
      'app/bower_components/angular-hotkeys/build/hotkeys.min.js',
      'app/bower_components/underscore.string/dist/underscore.string.min.js',
      'app/js/app.js',
      'app/js/**/*.js',
      'test/helper/commitMockModule.js',
      'test/unit/**/*-spec.js',
      'app/templates/*.html',
    ],
    exclude: [
      'app/js/worker/*.*'
    ],

    reporters: ['story', 'coverage'],
    preprocessors: {
      'app/js/**/*.js': ['coverage'],
      'app/templates/*.html': ['ng-html2js']
    },
    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/',
      moduleName: 'templates'
    },
    coverageReporter: {
      type: 'lcov',
      dir: 'test/coverage/'
    },

    autoWatch: false,
    singleRun: true,

    LogLevel: config.LOG_INFO,

    browsers: ['PhantomJS']
  });
};
