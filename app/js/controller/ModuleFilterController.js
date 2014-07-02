define(['controllers'], function (controllers) {
    'use strict';
    controllers
        .controller('ModuleFilterController', ['$scope', 'allRepos', 'githubFreeSearch', function ($scope, allRepos, githubFreeSearch) {
            $scope.searchString = '';
            $scope.doSearch = function () {
                githubFreeSearch($scope.searchString)
                    .then(function (result) {
                        $scope.result = result.items;
                    });
            };
        }]);
});