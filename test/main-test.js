// we get all the test files automatically
var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/^\/base\/test\/unit\S*Spec.js$/.test(file)) {
            tests.push(file);
        }
    }
}

require.config({
    baseUrl: '/base/app/js',
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
        jquery: '../bower_components/jquery/dist/jquery.min',
        'underscore.string': '../bower_components/underscore.string/dist/underscore.string.min',

        'd3': '../bower_components/d3/d3',
        'dcjs': '../bower_components/dcjs/dc',
        'crossfilter': '../bower_components/crossfilter/crossfilter',

        githubjs: '../bower_components/github-js/dist/github.min',

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
        'angular': {deps: ['jquery'], 'exports': 'angular'},
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
    ], function () {

        require(tests, function () {
            window.__karma__.start();
        });
    });
});