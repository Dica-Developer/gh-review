(function (angular) {
  'use strict';
  angular.module('GHReview')
    .config(['$stateProvider',
      function ($stateProvider) {

        $stateProvider
          .state('standup', {
            url: '/standup/{filterId}',
            templateUrl: 'app/standup/standup.html',
            controller: 'StandupController'
          });
      }]);
}(angular));
