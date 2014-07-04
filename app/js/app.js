define([
    'angular',
    'Filter',
    'Chunk',
    'Charts',
    'Comment',
    'CommentCollector',
    'CommentProvider',
    'CommitProvider',
    'services',
    'directives',
    'controllers',
    'angularRoute',
    'angularUi',
    'angularLocalStorage',
    'angularSanitize',
    'angularAnimate',

    'FilterController',
    'FileController',
    'ModuleFilterController',
    'CommitController',
    'CommitListController'
], function (angular) {
    'use strict';

    return angular.module('GHReview', [
        'GHReview.Filter',
        'GHReview.CommentProvider',
        'GHReview.CommentCollector',
        'GHReview.CommitProvider',
        'GHReview.Chunk',
        'GHReview.Charts',
        'GHReview.Comment',
        'GHReview.controllers',
        'GHReview.services',
        'GHReview.directives',
        'ui.router',
        'ui.bootstrap',
        'LocalStorageModule',
        'ngSanitize',
        'ngAnimate'
    ]);

});
