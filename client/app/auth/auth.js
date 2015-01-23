(function (angular) {
  'use strict';
  angular.module('GHReview')
    .config(['$stateProvider',
      function ($stateProvider) {

        $stateProvider
          .state('login', {
            url: '/login',
            controller: 'LoginController'
          })
          .state('logout', {
            url: '/logout',
            controller: 'LogoutController'
          });
      }]);
}(angular));