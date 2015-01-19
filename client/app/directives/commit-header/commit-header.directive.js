(function (angular) {
  'use strict';

  var maxLengthForFirstLine = 100;
  angular.module('GHReview')
    .directive('commitHeader', [
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