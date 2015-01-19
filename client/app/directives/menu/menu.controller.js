(function (angular) {
  'use strict';

  angular.module('GHReview')
    .controller('menuDirectiveController', ['$scope', '$state', 'authenticated', 'githubUserData', 'collectComments', 'hotkeys', function ($scope, $state, authenticated, githubUserData, collectComments, hotkeys) {
      $scope.authenticated = authenticated.get() ? true : false;
      if ($scope.authenticated) {
        collectComments();
        hotkeys.bindTo($scope)
          .add({
            combo: 'g f',
            description: 'Go to filter list',
            callback: function (event) {
              event.preventDefault();
              $state.go('listFilter');
            }
          })
          .add({
            combo: 'g m',
            description: 'Go to module search',
            callback: function (event) {
              event.preventDefault();
              $state.go('modules');
            }
          })
          .add({
            combo: 'g w',
            description: 'Go to "Who Am I" page',
            callback: function (event) {
              event.preventDefault();
              $state.go('whoami');
            }
          })
          .add({
            combo: ': q',
            description: 'Logout',
            callback: function (event) {
              event.preventDefault();
              $state.go('logout');
            }
          });
        githubUserData.get()
          .then(function (userData) {
            $scope.name = userData.name;
          });
      }
    }]);

}(angular));