define([
    'angular',
    'Filter',
    'Chunk',
    'Charts',
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
    'angularAnimate'
], function (angular) {
    'use strict';

    return angular.module('GHReview', [
        'GHReview.Filter',
        'GHReview.CommentProvider',
        'GHReview.CommentCollector',
        'GHReview.CommitProvider',
        'GHReview.Chunk',
        'GHReview.Charts',
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
