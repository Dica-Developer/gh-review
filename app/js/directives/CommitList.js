(function (angular) {
  'use strict';
  angular.module('GHReview')
    .directive('ghreviewCommitList', ['$location', '$state', 'moment', '_', 'hotkeys',
      function ($location, $state, moment, _, hotkeys) {
        return {
          restrict: 'E',
          templateUrl: 'templates/commitList.html',
          transclude: true,
          link: function ($scope, element, attr) {
            var flattenedCommitList = [], currentCommitPointer = -1, filter;

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
                      user: filter.getOwner(),
                      repo: filter.getRepo()
                    });
                  }
                }
              })
              .add({
                combo: 'right',
                description: 'Next page',
                callback: function (event) {
                  event.preventDefault();
                  if (filter.hasNextPage) {
                    $scope.getNextPage();
                  }
                }
              })
              .add({
                combo: 'left',
                description: 'Previous page',
                callback: function (event) {
                  event.preventDefault();
                  if (filter.hasPreviousPage) {
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

            function getSortedCommits(commits) {
              var groupedCommits = _.groupBy(commits, function (commit) {
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

              return groupedSortedCommits;
            }

            var setButtonStates = function () {
              $scope.hasNext = filter.hasNextPage;
              $scope.hasPrevious = filter.hasPreviousPage;
              $scope.hasFirst = filter.hasFirstPage;
            };

            $scope.$watch(attr.commitList, function (commitList) {
              $scope.sortedCommits = getSortedCommits(commitList);
            });

            $scope.$watch(attr.filter, function (newFilter) {
              filter = newFilter;
              setButtonStates();
            });

          }
        };
      }
    ]);
}(angular));
