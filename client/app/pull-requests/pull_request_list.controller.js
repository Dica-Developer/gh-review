(function (angular) {
  'use strict';
  angular.module('GHReview')
    .controller('PullRequestListController', ['$scope', 'ghPullRequest', 'repoList', '_',
      function ($scope, ghPullRequest, repoList, _) {
        $scope.scope = $scope;
        $scope.selectedRepo = null;
        $scope.repoList = repoList;
        $scope.pulls = [];
        $scope.user = null;
        $scope.repo = null;

        $scope.$watch('selectedRepo', function (newRepo, oldRepo) {
          if (!_.isEqual(newRepo, oldRepo) && !_.isNull(newRepo)) {
            console.log(newRepo);
            $scope.user = newRepo.owner.login;
            $scope.repo = newRepo.name;
            ghPullRequest.getAll({
                'user': newRepo.owner.login,
                'repo': newRepo.name
              })
              .then(function (pulls) {
                console.log(pulls);
                $scope.pulls = pulls;
              });
          }
        });
      }
    ]);
}(angular));