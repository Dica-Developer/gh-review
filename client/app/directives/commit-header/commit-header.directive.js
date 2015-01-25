(function (angular) {
  'use strict';

  var maxLengthForFirstLine = 100;
  angular.module('GHReview')
    .directive('commitHeader', [
      function () {
        return {
          restrict: 'E',
          templateUrl: 'app/directives/commit-header/commit-header-collabsible.html',
          link: function ($scope, element, attr) {
            $scope.$watch(attr.commit, function (value) {
              var message = value.message;
              var splittedMessage = message.split('\n');
              var firstLine = splittedMessage[0];
              $scope.commitHeaderStatus.shouldCollapse = splittedMessage.length > 1 || firstLine.length >= maxLengthForFirstLine;
            });
          }
        };
      }
    ]);

}(angular));