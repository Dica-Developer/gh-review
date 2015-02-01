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
  ]).run(['authenticated', 'collectComments', function (authenticated, collectComments) {
    if(authenticated.get()){
      collectComments();
    }
  }]).config(['localStorageServiceProvider', '$urlRouterProvider',
    function (localStorageServiceProvider, $urlRouterProvider) {
      localStorageServiceProvider.setPrefix('ghreview');

      $urlRouterProvider
        .otherwise('/')
        .rule(function ($injector, $location) {
          var auth = $injector.get('authenticated'),
            authenticated = auth.get(),
            path = $location.path();

          if ((path === '/' || path === '/login' || path === '/welcome') || authenticated) {
            return $location.abbsUrl;
          } else {
            return $location.replace().path('/welcome');
          }
        });
    }
  ]);
}(angular));