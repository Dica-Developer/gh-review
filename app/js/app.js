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
  ]).config(['localStorageServiceProvider',
    function (localStorageServiceProvider) {
      localStorageServiceProvider.setPrefix('ghreview');
    }
  ]);
}(angular));