define(['controllers', 'lodash', 'moment'], function (controllers, _, moment) {
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

        function getSortedCommits (commits) {
          var groupedCommits = _.groupBy(commits, function(commit){
            return moment(commit.commit.committer.date).format('YYYY-MM-DD');
          });

          return _.sortBy(groupedCommits, function(a, b){
            return moment(a).isBefore(b);
          });
        }

        filterById.getCommits(0, 20).then(function (commits) {
          $scope.sortedGroupedCommits = getSortedCommits(commits);
          setButtonStates();
        });

        $scope.getNextPage = function () {
          filterById.getNextPage().then(function (commits) {
            $scope.sortedGroupedCommits = getSortedCommits(commits);
            setButtonStates();
          });
        };

        $scope.getPreviousPage = function () {
          filterById.getPreviousPage().then(function (commits) {
            $scope.sortedGroupedCommits = getSortedCommits(commits);
            setButtonStates();
          });
        };

        $scope.getFirstPage = function () {
          filterById.getFirstPage().then(function (commits) {
            $scope.sortedGroupedCommits = getSortedCommits(commits);
            setButtonStates();
          });
        };
      }
    ]);
});
