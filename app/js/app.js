define([
  'angular',
  'Filter',
  'Chunk',
  'Comment',
  'CommentCollector',
  'CommentProvider',
  'CommitProvider',
  'services',
  'directives',
  'controllers',
  'angularRoute',
  'angularUi',
  'angularUiSelect',
  'angularLocalStorage',
  'angularSanitize',
  'angularAnimate',
  'angularHighlightJS',
  'angularHotkeys',

  'FilterController',
  'FilterListController',
  'FileController',
  'ModuleFilterController',
  'CommitController',
  'CommitListController',
  'Events'
], function (angular) {
  'use strict';

  return angular.module('GHReview', [
    'GHReview.Filter',
    'GHReview.CommentProvider',
    'GHReview.CommentCollector',
    'GHReview.CommitProvider',
    'GHReview.Chunk',
    'GHReview.Comment',
    'GHReview.controllers',
    'GHReview.services',
    'GHReview.directives',
    'GHReview.Events',
    'ui.router',
    'ui.select',
    'ui.bootstrap',
    'cfp.hotkeys',
    'LocalStorageModule',
    'ngSanitize',
    'ngAnimate',
    'hljs'
  ]);

});
