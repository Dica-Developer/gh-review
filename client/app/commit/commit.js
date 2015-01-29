(function (angular) {
  'use strict';
  angular.module('GHReview')
    .config(['$stateProvider',
      function ($stateProvider) {

        $stateProvider
          .state('commitBySha', {
            url: '/{user}/{repo}/commit/{sha}',
            templateUrl: 'app/commit/commit.html',
            controller: 'CommitController'
          });
      }]);
}(angular));
