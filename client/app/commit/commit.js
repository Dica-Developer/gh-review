(function (angular) {
  'use strict';
  angular.module('GHReview')
    .config(['$stateProvider',
      function ($stateProvider) {

        $stateProvider
          .state('commitBySha', {
            url: '/{user}/{repo}/commit/{sha}',
            templateUrl: 'app/commit/commit.html',
            controller: 'CommitController',
            resolve: {
              commitsAndComments: ['$q', '$stateParams', 'commentProviderService', 'commitProviderService',
                function ($q, $stateParams, commentProviderService, commitProviderService) {
                  return $q.all([commitProviderService.getPreparedCommit($stateParams), commentProviderService.getCommentsForCommit($stateParams)]);
                }
              ],
              loggedInUser: ['$q', 'githubUserData',
                function ($q, githubUserData) {
                  return $q.all(githubUserData.get());
                }
              ]
            }
          });
      }]);
}(angular));