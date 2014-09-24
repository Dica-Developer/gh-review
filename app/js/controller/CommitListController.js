define(['controllers', 'lodash', 'moment'], function (controllers, _, moment) {
  'use strict';
  controllers
    .controller('CommitListController', [
      '$scope',
      '$state',
      '$stateParams',
      '$location',
      'commitsApproved',
      'filter',
      'hotkeys',
      function ($scope, $state, $stateParams, $location, commitsApproved, filter, hotkeys) {
        var flattenedCommitList = [], currentCommitPointer = 0;

        hotkeys.bindTo($scope)
          .add({
            combo: 'down',
            description: 'Navigate through commits',
            callback: function(event) {
              event.preventDefault();
              if(currentCommitPointer < flattenedCommitList.length -1){
                currentCommitPointer++;
                setSelectedCommit();
              }
            }
          })
          .add({
            combo: 'up',
            description: 'Navigate through commits',
            callback: function(event) {
              event.preventDefault();
              if(currentCommitPointer > 0){
                currentCommitPointer--;
                setSelectedCommit();
              }
            }
          })
          .add({
            combo: 'enter',
            description: 'Navigate through commits',
            callback: function(event) {
              event.preventDefault();
              $state.go('commitBySha', {
                sha: flattenedCommitList[currentCommitPointer].sha,
                user: filterById.getOwner(),
                repo: filterById.getRepo()
              });
            }
          })
          .add({
            combo: 'right',
            description: 'Next page',
            callback: function(event) {
              event.preventDefault();
              if(filterById.hasNextPage){
                $scope.getNextPage();
              }
            }
          })
          .add({
            combo: 'left',
            description: 'Previous page',
            callback: function(event) {
              event.preventDefault();
              if(filterById.hasPreviousPage){
                $scope.getPreviousPage();
              }
            }
          });

        function setSelectedCommit () {
          var sha = flattenedCommitList[currentCommitPointer].sha;
          $scope.selectedCommit = sha;
          $location.hash(sha);
        }

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

          var groupedSortedCommits = _.sortBy(groupedCommits, function(a, b){
            return moment(a).isBefore(b);
          });

          flattenedCommitList = _.flatten(groupedSortedCommits);

          return groupedSortedCommits;
        }

        filterById.getCommits(0, 20).then(function (commits) {
          $scope.sortedGroupedCommits = getSortedCommits(commits);
          setButtonStates();
          setSelectedCommit();
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
