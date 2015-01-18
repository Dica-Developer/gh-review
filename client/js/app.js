(function (angular) {
  'use strict';

  angular.module('GHReview', [
    'ui.router',
    'ui.select',
    'ui.bootstrap',
    'cfp.hotkeys',
    'LocalStorageModule',
    'ngSanitize',
    'ngAnimate',
    'hljs'
  ]).config(['localStorageServiceProvider', '$urlRouterProvider',
    function (localStorageServiceProvider, $urlRouterProvider) {
      localStorageServiceProvider.setPrefix('ghreview');

      $urlRouterProvider
        .otherwise('/');
    }
  ]);
}(angular));