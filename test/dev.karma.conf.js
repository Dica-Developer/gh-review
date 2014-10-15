module.exports = function (config) {
  config.set({
    basePath: '../',
    frameworks: ['jasmine'],
    files: [
      'app/bower_components/moment/moment.js',
      'app/bower_components/lodash/dist/lodash.js',
      'app/bower_components/highlightjs/highlight.pack.js',
      'app/bower_components/github-js/dist/github.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/bower_components/angular-ui-select/dist/select.js',
      'app/bower_components/angular-animate/angular-animate.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-local-storage/angular-local-storage.js',
      'app/bower_components/angular-highlightjs/angular-highlightjs.js',
      'app/bower_components/angular-hotkeys/build/hotkeys.js',
      'app/bower_components/underscore.string/lib/underscore.string.js',
      'app/js/app.js',
      'app/js/**/*.js',
      'test/helper/commitMockModule.js',
      'test/unit/**/*-spec.js',
      'app/templates/*.html'
    ],
    exclude: [
      'app/js/worker/*.*'
    ],

    reporters: ['dots', 'coverage'],
    preprocessors: {
      'app/js/**/*.js': ['coverage'],
      'app/templates/*.html': ['ng-html2js']
    },
    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/',
      moduleName: 'templates'
    },
    coverageReporter: {
      type: 'html',
      dir: 'test/coverage/'
    },

    autoWatch: true,

    LogLevel: config.LOG_DEBUG,

    browsers: ['Chrome']
  });
};
