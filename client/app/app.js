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
      var commentCollectorStarted = false;

      $urlRouterProvider
        .otherwise('/')
        .rule(function ($injector, $location) {
          var auth = $injector.get('authenticated'),
            collectComments = $injector.get('collectComments'),
            authenticated = auth.get(),
            path = $location.path();

          if ((path === '/' || path === '/login' || path === '/welcome') || authenticated) {
            if(!commentCollectorStarted){
              commentCollectorStarted = true;
              collectComments();
            }
            return $location.abbsUrl;
          } else {
            return $location.replace().path('/welcome');
          }
        });
    }
  ]);
}(angular));