(function (angular) {
  'use strict';

  angular.module('GHReview')
    .directive('formattedDate', ['humanReadableDate',
      function (humanReadableDate) {
        return {
          restrict: 'AE',
          templateUrl: 'app/directives/formatted-date/formatted-date.html',
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

}(angular));