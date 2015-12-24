(function (angular) {
  'use strict';
  angular.module('GHReview')
    .config(['$stateProvider',
      function ($stateProvider) {

        $stateProvider
          .state('pullRequestFiles', {
            url: '/{user}/{repo}/pull/{number}',
            templateUrl: 'app/pull-requests/pull_request_files.html',
            controller: 'PullRequestFilesController'
          });
      }]);
}(angular));