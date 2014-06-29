require.config({
    paths: {
        angular: '../bower_components/angular/angular',
        angularRoute: '../bower_components/angular-ui-router/release/angular-ui-router.min',
        angularMocks: '../bower_components/angular-mocks/angular-mocks',
        angularUi: '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        angularAnimate: '../bower_components/angular-animate/angular-animate.min',
        angularSanitize: '../bower_components/angular-sanitize/angular-sanitize.min',
        angularLocalStorage: '../bower_components/angular-local-storage/angular-local-storage.min',
        moment: '../bower_components/moment/min/moment.min',
        lodash: '../bower_components/lodash/dist/lodash.min',
        'underscore.string': '../bower_components/underscore.string/dist/underscore.string.min',

        'd3': '../bower_components/d3/d3',
        'dcjs': '../bower_components/dcjs/dc',
        'crossfilter': '../bower_components/crossfilter/crossfilter',

        githubjs: '../bower_components/github-js/dist/github.min',
        watch: '../bower_components/watch/src/watch.min',

        routes: 'routes',
        Filter: 'modules/Filter',
        Chunk: 'modules/Chunk',
        Charts: 'modules/Charts',

        CommitProvider: 'modules/CommitProvider',
        CommitController: 'controller/CommitController',
        CommitListController: 'controller/CommitListController',
        CommentCollector: 'modules/CommentCollector',
        CommentProvider: 'modules/CommentProvider',
        ModuleFilterController: 'controller/ModuleFilterController',
        FileController: 'controller/FileController',
        FilterController: 'controller/FilterController'
    },
    shim: {
        'angular': {'exports': 'angular'},
        'angularRoute': ['angular'],
        'angularUi': ['angular'],
        'angularSanitize': ['angular'],
        'angularLocalStorage': ['angular'],
        'angularMocks': {
            deps: ['angular'],
            'exports': 'angular.mock'
        },
        'crossfilter': {
            exports: 'crossfilter'
        },
        'dcjs': ['crossfilter']
    },
    priority: [
        'angular'
    ]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = 'NG_DEFER_BOOTSTRAP!';

require([
    'd3',
    'lodash',
    'underscore.string',
    'angular'
], function (d3, _, str, angular) {
    'use strict';
    window.d3 = d3;
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
        angular.bootstrap(document, [app.name]);
    });
});
