define(['controllers'], function (controllers) {
  'use strict';
  controllers
    .controller('CommitListController', [
      '$scope',
      '$stateParams',
      'commitsApproved',
      'filter',
      function ($scope, $stateParams, commitsApproved, filter) {
        $scope.loader = '';
        $scope.hasNext = false;
        $scope.hasPrevious = false;
        $scope.hasFirst = false;

        var filterById = filter.getById($stateParams.filterId);

        $scope.user = filterById.getOwner();
        $scope.repo = filterById.getRepo();
        $scope.commitApproved = function (sha) {
          return (true === commitsApproved[sha]);
        };

        var setButtonStates = function () {
          $scope.hasNext = filterById.hasNextPage;
          $scope.hasPrevious = filterById.hasPreviousPage;
          $scope.hasFirst = filterById.hasFirstPage;
        };

        filterById.getCommits(0, 20).then(function (commits) {
          $scope.commits = commits;
          setButtonStates();
        });

        $scope.getNextPage = function () {
          filterById.getNextPage().then(function (commits) {
            $scope.commits = commits;
            setButtonStates();
          });
        };

        $scope.getPreviousPage = function () {
          filterById.getPreviousPage().then(function (commits) {
            $scope.commits = commits;
            setButtonStates();
          });
        };

        $scope.getFirstPage = function () {
          filterById.getFirstPage().then(function (commits) {
            $scope.commits = commits;
            setButtonStates();
          });
        };
      }
    ]);
});
