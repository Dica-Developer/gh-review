require.config({
  paths: {
    angular: '../bower_components/angular/angular',
    angularRoute: '../bower_components/angular-ui-router/release/angular-ui-router.min',
    angularMocks: '../bower_components/angular-mocks/angular-mocks',
    angularUi: '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
    angularUiSelect: '../bower_components/angular-ui-select/dist/select',
    angularAnimate: '../bower_components/angular-animate/angular-animate.min',
    angularSanitize: '../bower_components/angular-sanitize/angular-sanitize.min',
    angularLocalStorage: '../bower_components/angular-local-storage/angular-local-storage.min',
    angularHighlightJS: '../bower_components/angular-highlightjs/angular-highlightjs.min',
    angularHotkeys: '../bower_components/angular-hotkeys/build/hotkeys.min',
    moment: '../bower_components/moment/min/moment.min',
    lodash: '../bower_components/lodash/dist/lodash.min',
    'underscore.string': '../bower_components/underscore.string/dist/underscore.string.min',
    text: '../bower_components/requirejs-text/text',

    'highlightjs': '../bower_components/highlightjs/highlight.pack',

    githubjs: '../bower_components/github-js/dist/github',

    options: 'options',

    routes: 'routes',

    //Modules
    Filter: 'modules/Filter',
    Chunk: 'modules/Chunk',
    Comment: 'modules/Comment',
    CommentProvider: 'modules/CommentProvider',
    CommitProvider: 'modules/CommitProvider',
    Events: 'modules/Events',

    //Controller
    CommitController: 'controller/CommitController',
    CommitListController: 'controller/CommitListController',
    CommentCollector: 'modules/CommentCollector',
    ModuleFilterController: 'controller/ModuleFilterController',
    FileController: 'controller/FileController',
    FilterController: 'controller/FilterController',
    FilterListController: 'controller/FilterListController'
  },
  shim: {
    'angular': {
      'exports': 'angular'
    },
    'angularRoute': ['angular'],
    'angularUi': ['angular'],
    'angularSanitize': ['angular'],
    'angularLocalStorage': ['angular'],
    'angularHotkeys': ['angular'],
    'angularHighlightJS': ['angular', 'highlightjs'],
    'angularMocks': {
      deps: ['angular'],
      'exports': 'angular.mock'
    },
    'highlightjs': {
      exports: 'hljs'
    }
  },
  priority: [
    'angular'
  ]
});

require([
  'lodash',
  'underscore.string',
  'angular'
], function (_, str, angular) {
  'use strict';
  _.str = str;

  require([
    'app',
    'routes'
  ], function (app) {

    app.config(
      [
        'localStorageServiceProvider',
        function (localStorageServiceProvider) {
          localStorageServiceProvider.setPrefix('ghreview');
        }
      ]
    );
    angular.element(document).ready(function () {
      angular.bootstrap(document, [app.name]);
    });
  });
});
