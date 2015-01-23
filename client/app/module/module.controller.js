(function (angular) {
  'use strict';
  angular.module('GHReview')
    .controller('ModuleFilterController', ['$scope', 'githubFreeSearch',
      function ($scope, githubFreeSearch) {
        $scope.searchString = '';
        $scope.doSearch = function () {
          githubFreeSearch($scope.searchString)
            .then(function (result) {
              $scope.result = result.items;
            });
        };
      }
    ]);
}(angular));