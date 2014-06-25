define([], function () {
    'use strict';
    return [
        '$scope',
        '$stateParams',
        'getFilterById',
        'Filter',
        'commentCollector',
        function ($scope, $stateParams, getFilterById, Filter, commentCollector) {
            var approvedCommits = commentCollector.getCommitApproved();
            $scope.hasNext = false;
            $scope.hasPrevious = false;
            $scope.hasFirst = false;

            var filterOptions = getFilterById($stateParams.filterId);
            var filter = new Filter(filterOptions);

            $scope.user = filter.getOwner();
            $scope.repo = filter.getRepo();
            $scope.commitApproved = function (sha) {
                return (true === approvedCommits[sha]);
            };

            var setButtonStates = function () {
                $scope.hasNext = filter.hasNextPage;
                $scope.hasPrevious = filter.hasPreviousPage;
                $scope.hasFirst = filter.hasFirstPage;
            };

            filter.getCommits(0, 20).then(function (commits) {
                $scope.commits = commits;
                setButtonStates();
            });

            $scope.getNextPage = function () {
                filter.getNextPage().then(function (commits) {
                    $scope.commits = commits;
                    setButtonStates();
                });
            };

            $scope.getPreviousPage = function () {
                filter.getPreviousPage().then(function (commits) {
                    $scope.commits = commits;
                    setButtonStates();
                });
            };

            $scope.getFirstPage = function () {
                filter.getFirstPage().then(function (commits) {
                    $scope.commits = commits;
                    setButtonStates();
                });
            };
            $scope.$apply();
        }
    ];
});