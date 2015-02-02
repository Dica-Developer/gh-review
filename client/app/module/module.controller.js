(function (angular) {
  'use strict';
  angular.module('GHReview')
    .controller('ModuleFilterController', ['$scope', 'ghSearch',
      function ($scope, ghSearch) {
        $scope.searchString = '';
        $scope.doSearch = function () {
          ghSearch.query($scope.searchString)
            .then(function (result) {
              $scope.result = result.items;
            });
        };
      }
    ]);
}(angular));