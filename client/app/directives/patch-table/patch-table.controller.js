(function (angular) {
  'use strict';
  angular.module('GHReview')
    .controller('patchTableDirectiveController', [
      '$scope',
      function ($scope) {
        $scope.fileNr = parseInt($scope.fileNr, 10);
        $scope.isClosed = ($scope.fileNr >= 5 || $scope.file.status === 'removed' || $scope.file.changes === 0);
        $scope.toggleFileView = function(){
          $scope.isClosed = !$scope.isClosed;
        };
      }
    ]);
}(angular));
