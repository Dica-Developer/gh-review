(function (angular) {
  'use strict';
  angular.module('GHReview')
    .config(['$stateProvider',
      function ($stateProvider) {

        $stateProvider
          .state('root', {
            url: '/',
            controller: 'RootController'
          });
      }]);
}(angular));
