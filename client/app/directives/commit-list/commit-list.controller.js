(function (angular) {
  'use strict';
  angular.module('GHReview')
    .controller('commitListDirectiveController', [
      '$scope',
      '$location',
      '$state',
      'commentCollector',
      'moment',
      '_',
      'hotkeys',
      function ($scope, $location, $state, commentCollector, moment, _, hotkeys) {
        var flattenedCommitList = [], currentCommitPointer = -1, approvedCommits;

        commentCollector.getCommitApproved()
          .then(function (result) {
            approvedCommits = result;
          });

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
                  user: $scope.filter.getOwner(),
                  repo: $scope.filter.getRepo()
                });
              }
            }
          })
          .add({
            combo: 'right',
            description: 'Next page',
            callback: function (event) {
              event.preventDefault();
              if ($scope.filter.hasNextPage) {
                $scope.getNextPage();
              }
            }
          })
          .add({
            combo: 'left',
            description: 'Previous page',
            callback: function (event) {
              event.preventDefault();
              if ($scope.filter.hasPreviousPage) {
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

        var setSortedCommits = function () {
          var groupedCommits = _.groupBy($scope.commits, function (commit) {
            return moment(commit.commit.committer.date).format('YYYY-MM-DD');
          });

          var groupedSortedCommits = _.sortBy(groupedCommits, function (a, b) {
            return moment(a).isBefore(b);
          });

          flattenedCommitList = _.flatten(groupedSortedCommits);

          var existingShaHash = $location.hash();
          if (existingShaHash !== '') {
            currentCommitPointer = _.findIndex(flattenedCommitList, {sha: existingShaHash});
            $scope.selectedCommit = existingShaHash;
            $location.hash(existingShaHash);
          }

          $scope.sortedCommits = groupedSortedCommits;
        };

        $scope.commitApproved = function (sha) {
          return approvedCommits && (true === approvedCommits[sha]);
        };
        $scope.$watch('commits', function () {
          setSortedCommits();
        });
      }
    ]);
}(angular));
