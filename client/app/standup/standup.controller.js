(function (angular) {
  'use strict';

  angular.module('GHReview')
    .controller('StandupController', [
      '$scope',
      '$q',
      '$stateParams',
      'filter',
      function ($scope, $q, $stateParams, filter) {

        $scope.fetchingCommits = true;
        $scope.filter = filter.getById($stateParams.filterId);
        $scope.filter.getCommits(true)
          .then(function(commitList){
            $scope.commits = commitList;
            $scope.fetchingCommits = false;
          });
      }
    ]);
}(angular));
