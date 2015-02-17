(function(angular){
  'use strict';
  angular
    .module('GHReview')
    .directive('fileChange', ['$parse', function ($parse) {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
          var attrHandler = $parse(attrs.fileChange);
          var handler = function (event) {
            $scope.$apply(function () {
              attrHandler($scope, {$event: event, files: event.target.files});
            });
          };
          element[0].addEventListener('change', handler, false);
        }
      };
    }]);
}(angular));