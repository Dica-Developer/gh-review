(function (angular) {
  'use strict';

  angular.module('GHReview')
    .controller('WhoAmIController', ['$scope', 'githubUserData',
      function ($scope, githubUserData) {
        githubUserData.get()
          .then(function (userData) {
            $scope.userData = userData;
          });
      }]);

}(angular));
