(function (angular) {
  'use strict';
  angular.module('GHReview')
    .config(['$stateProvider',
      function ($stateProvider) {

        $stateProvider
          .state('pullRequestList', {
            url: '/pulls',
            templateUrl: 'app/pull-requests/pull_request_list.html',
            controller: 'PullRequestListController',
            resolve: {
              repoList: ['repoCollector', function(repoCollector){
                return repoCollector.getAll();
              }]
            }
          });
      }]);
}(angular));