(function (angular) {
  'use strict';
  var maxLengthForFirstLine = 100;
  angular.module('GHReview')
    .directive('commitMessageTeaser', function () {
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

}(angular));