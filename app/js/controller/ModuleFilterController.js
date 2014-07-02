define(['controllers'], function (controllers) {
    'use strict';
    controllers
        .controller('ModuleFilterController', ['$scope', 'githubFreeSearch', function ($scope, githubFreeSearch) {
            $scope.searchString = '';
            $scope.doSearch = function () {
                githubFreeSearch($scope.searchString)
                    .then(function (result) {
                        $scope.result = result.items;
                    });
            };
        }]);
});