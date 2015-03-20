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
              preparedCommit: ['$stateParams', 'Commit', function($stateParams, Commit){
                var commit = new Commit($stateParams);
                return commit.prepareForView();
              }]
            }
          });
      }]);
}(angular));
