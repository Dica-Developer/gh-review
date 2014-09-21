require.config({
    paths: {
        angular: '../bower_components/angular/angular',
        angularRoute: '../bower_components/angular-ui-router/release/angular-ui-router.min',
        angularMocks: '../bower_components/angular-mocks/angular-mocks',
        angularUi: '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        angularAnimate: '../bower_components/angular-animate/angular-animate.min',
        angularSanitize: '../bower_components/angular-sanitize/angular-sanitize.min',
        angularLocalStorage: '../bower_components/angular-local-storage/angular-local-storage.min',
        angularHighlightJS: '../bower_components/angular-highlightjs/angular-highlightjs.min',
        moment: '../bower_components/moment/min/moment.min',
        lodash: '../bower_components/lodash/dist/lodash.min',
        'underscore.string': '../bower_components/underscore.string/dist/underscore.string.min',
        text: '../bower_components/requirejs-text/text',

        'd3': '../bower_components/d3/d3',
        'dcjs': '../bower_components/dcjs/dc',
        'crossfilter': '../bower_components/crossfilter/crossfilter',

        'highlightjs': '../bower_components/highlightjs/highlight.pack',

        githubjs: '../bower_components/github-js/dist/github.min',

        options: 'options',

        routes: 'routes',

        //Modules
        Filter: 'modules/Filter',
        Chunk: 'modules/Chunk',
        Charts: 'modules/Charts',
        Comment: 'modules/Comment',
        CommentProvider: 'modules/CommentProvider',
        CommitProvider: 'modules/CommitProvider',

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
        'angularHighlightJS': ['angular', 'highlightjs'],
        'angularMocks': {
            deps: ['angular'],
            'exports': 'angular.mock'
        },
        'crossfilter': {
            exports: 'crossfilter'
        },
        'dcjs': ['crossfilter'],
        'highlightjs': {
            exports: 'hljs'
        }
    },
    priority: [
        'angular'
    ]
});

require([
    'd3',
    'lodash',
    'underscore.string',
    'angular'
], function (d3, _, str, angular) {
    'use strict';
    // FIXME removed for now because it is set in d3.js itself to window.d3 and set for me only undefied to undefined
    // window.d3 = d3;
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
