(function (angular) {
  'use strict';

  angular.module('GHReview')
    .controller('WhoAmIController', ['$scope', 'ghUser',
      function ($scope, ghUser) {
        ghUser.get()
          .then(function (userData) {
            $scope.userData = userData;
          });
      }]);

}(angular));
