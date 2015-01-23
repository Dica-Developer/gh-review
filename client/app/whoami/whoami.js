(function (angular) {
  'use strict';

  angular.module('GHReview')
    .config(function ($stateProvider) {
      $stateProvider
        .state('whoami', {
          url: '/whoami',
          templateUrl: 'app/whoami/whoami.html',
          controller: 'WhoAmIController'
        });
    });
}(angular));

