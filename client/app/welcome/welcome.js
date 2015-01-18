(function (angular) {
  'use strict';
  angular.module('GHReview')
    .config(['$stateProvider',
      function ($stateProvider) {

        $stateProvider
          .state('welcome', {
            url: '/welcome',
            templateUrl: 'app/welcome/welcome.html',
            controller: 'WelcomeController'
          });
      }]);
}(angular));