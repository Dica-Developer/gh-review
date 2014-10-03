(function (angular) {
  'use strict';

  /* Directives */

  var directives = angular.module('GHReview');

  directives.directive('menu', ['$state', 'authenticated', 'githubUserData', 'collectComments', 'hotkeys',
    function ($state, authenticated, githubUserData, collectComments, hotkeys) {
      var commentCollectorInitialized = false;
      if (!commentCollectorInitialized) {
        commentCollectorInitialized = collectComments();
      }
      var returnVal = {
        restrict: 'A'
      };
      if (authenticated.get()) {
        returnVal.templateUrl = 'templates/authenticatedMenu.html';
        returnVal.link = function ($scope) {
          hotkeys.bindTo($scope)
            .add({
              combo: 'g f',
              description: 'Go to filter list',
              callback: function (event) {
                event.preventDefault();
                $state.go('filter');
              }
            })
            .add({
              combo: 'g m',
              description: 'Go to module search',
              callback: function (event) {
                event.preventDefault();
                $state.go('modules');
              }
            })
            .add({
              combo: 'g w',
              description: 'Go to "Who Am I" page',
              callback: function (event) {
                event.preventDefault();
                $state.go('whoami');
              }
            })
            .add({
              combo: ': q',
              description: 'Logout',
              callback: function (event) {
                event.preventDefault();
                $state.go('logout');
              }
            });
          githubUserData.get()
            .then(function (userData) {
              $scope.name = userData.name;
            });
        };
      } else {
        returnVal.templateUrl = 'templates/menu.html';
      }
      return returnVal;
    }
  ]);

  directives.directive('formattedDate', ['humanReadableDate',
    function (humanReadableDate) {
      return {
        restrict: 'AE',
        template: '<span tooltip-placement="top" tooltip="{{formattedDate}}">{{date}}</span>',
        link: function ($scope, element, attr) {
          $scope.$watch(attr.date, function (value) {
            if (attr.format && attr.format !== '') {
              $scope.formattedDate = humanReadableDate.format(value);
              $scope.date = humanReadableDate.customFormat(value, attr.format);
            } else {
              $scope.formattedDate = humanReadableDate.format(value);
              $scope.date = humanReadableDate.fromNow(value);
            }
          });
        }
      };
    }
  ]);

  directives.directive('commitListPaginator', function () {
    return {
      restrict: 'E',
      templateUrl: 'templates/commitListPaginator.html'
    };
  });

  directives.directive('avatar', function () {
    return {
      restrict: 'E',
      template: '<a href="{{link}}" title="{{name}}" target="_blank"><img height="32px" class="media-object pull-left" ng-src="{{imgLink}}"></a>',
      link: function ($scope, element, attr) {
        $scope.imgLink = 'images/icon-social-github-128.png';
        $scope.$watch(attr.commit, function (value) {
          $scope.name = value.name;
          $scope.imgLink = value.avatar;
          $scope.link = value.committerLink || '#';
        });
      }
    };
  });

  directives.directive('comment', [
    function () {
      return {
        restrict: 'A',
        templateUrl: 'templates/comment.html',
        scope: {
          comment: '=content'
        }
      };
    }
  ]);

  var maxLengthForFirstLine = 100;
  directives.directive('commitMessageTeaser', function () {
    return {
      restrict: 'E',
      link: function ($scope, element, attr) {
        $scope.$watch(attr.message, function (value) {
          var splittedValue = value.split('\n');
          var firstLine = splittedValue[0];
          if (firstLine.length >= maxLengthForFirstLine) {
            firstLine = firstLine.substr(0, maxLengthForFirstLine);
            firstLine = firstLine + '...';
          }
          element.text(firstLine);
        });
      }
    };
  });

  directives.directive('commitHeader', [
    function () {
      var shouldBeCollabsible = false;
      return {
        restrict: 'E',
        templateUrl: function(){
          return shouldBeCollabsible ? 'templates/commitHeaderCollabsible.html' : 'templates/commitHeader.html';
        },
        link: function ($scope, element, attr) {
          $scope.$watch(attr.commit, function (value) {
            var message = value.message;
            var splittedMessage = message.split('\n');
            var firstLine = splittedMessage[0];
            shouldBeCollabsible = splittedMessage.length > 1 || firstLine.length >= maxLengthForFirstLine;
          });
        }
      };
    }
  ]);

  directives.directive('ghreviewCommitList', ['$location', '$state', 'moment', '_', 'hotkeys',
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
            if(existingShaHash !== ''){
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
