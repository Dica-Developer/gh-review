define([], function () {
    'use strict';
    return ['$scope', 'allRepos', 'githubFreeSearch', function ($scope, allRepos, githubFreeSearch) {
        $scope.searchString = '';
//        $scope.autoSuggest = function(){
//            var searchStringSplit = $scope.searchString.split(':');
//            if(searchStringSplit.length > 1){
//                console.log(searchStringSplit);
//            }
//            console.log($scope.searchString);
//        };

        $scope.doSearch = function () {
            githubFreeSearch($scope.searchString)
                .then(function (result) {
                    $scope.result = result.items;
                });
        };
        $scope.$apply();
    }];
});