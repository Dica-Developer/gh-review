(function (angular) {
  'use strict';

  /* Directives */

  var app = angular.module('GHReview');

  app.controller('menuDirectiveController', ['$scope', '$state', 'authenticated', 'githubUserData', 'collectComments', 'hotkeys', function ($scope, $state, authenticated, githubUserData, collectComments, hotkeys) {
    $scope.authenticated = authenticated.get() ? true : false;
    if($scope.authenticated){
      collectComments();
      hotkeys.bindTo($scope)
        .add({
          combo: 'g f',
          description: 'Go to filter list',
          callback: function (event) {
            event.preventDefault();
            $state.go('listFilter');
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
    }
  }]);

  app.directive('menu', [
    function () {
      return {
        restrict: 'A',
        templateUrl: 'templates/menu.html',
        controller: 'menuDirectiveController',
        link: [function () {
        }]
      };
    }
  ]);

  app.directive('formattedDate', ['humanReadableDate',
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

  app.directive('commitListPaginator', function () {
    return {
      restrict: 'E',
      templateUrl: 'templates/commitListPaginator.html'
    };
  });

  app.directive('avatar', function () {
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

  app.directive('comment', [
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
  app.directive('commitMessageTeaser', function () {
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

  app.directive('commitHeader', [
    function () {
      var shouldBeCollabsible = false;
      return {
        restrict: 'E',
        templateUrl: function () {
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


}(angular));
