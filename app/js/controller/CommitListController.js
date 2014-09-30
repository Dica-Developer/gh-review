(function (angular) {
  'use strict';
  angular.module('GHReview')
    .controller('CommitListController', [
      '$scope',
      '$state',
      '$stateParams',
      '$location',
      '_',
      'moment',
      'commitsApproved',
      'filter',
      'events',
      'hotkeys',
      function ($scope, $state, $stateParams, $location, _, moment, commitsApproved, filter, events, hotkeys) {
        var flattenedCommitList = [], currentCommitPointer = -1;

        hotkeys.bindTo($scope)
          .add({
            combo: 'down',
            description: 'Navigate through commits',
            callback: function (event) {
              event.preventDefault();
              if (currentCommitPointer < flattenedCommitList.length - 1) {
                currentCommitPointer++;
                setSelectedCommit();
              }
            }
          })
          .add({
            combo: 'up',
            description: 'Navigate through commits',
            callback: function (event) {
              event.preventDefault();
              if (currentCommitPointer > 0) {
                currentCommitPointer--;
                setSelectedCommit();
              }
            }
          })
          .add({
            combo: 'enter',
            description: 'Navigate through commits',
            callback: function (event) {
              event.preventDefault();
              if (currentCommitPointer > -1) {
                var sha = flattenedCommitList[currentCommitPointer].sha;
                $scope.loader = sha;
                $state.go('commitBySha', {
                  sha: sha,
                  user: filterById.getOwner(),
                  repo: filterById.getRepo()
                });
              }
            }
          })
          .add({
            combo: 'right',
            description: 'Next page',
            callback: function (event) {
              event.preventDefault();
              if (filterById.hasNextPage) {
                $scope.getNextPage();
              }
            }
          })
          .add({
            combo: 'left',
            description: 'Previous page',
            callback: function (event) {
              event.preventDefault();
              if (filterById.hasPreviousPage) {
                $scope.getPreviousPage();
              }
            }
          });

        function setSelectedCommit() {
          if (flattenedCommitList.length > 0) {
            var sha = flattenedCommitList[currentCommitPointer].sha;
            $scope.selectedCommit = sha;
            $location.hash(sha);
          }
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

        function getSortedCommits(commits) {
          var groupedCommits = _.groupBy(commits, function (commit) {
            return moment(commit.commit.committer.date).format('YYYY-MM-DD');
          });

          var groupedSortedCommits = _.sortBy(groupedCommits, function (a, b) {
            return moment(a).isBefore(b);
          });

          flattenedCommitList = _.flatten(groupedSortedCommits);

          return groupedSortedCommits;
        }

        filterById.getCommits(0, 20).then(function (commits) {
          $scope.sortedGroupedCommits = getSortedCommits(commits);
          $scope.filterEvents = events.getForFilter(filterById);
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
}(angular));
