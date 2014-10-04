(function (angular) {
  'use strict';

  /* Controllers */

  angular.module('GHReview')
    .controller('RootController', [
      '$state',
      'filter',
      function ($state, filter) {
        if (filter.getAll().length > 0) {
          $state.go('filter');
        } else {
          $state.go('addFilter');
        }
      }
    ])

    .controller('LoginController', ['$scope', '$window', 'options',
      function ($scope, $window, options) {
        var url = 'https://github.com/login/oauth/authorize?' +
          'client_id=' + options.github.clientId + '&' +
          'redirect_uri=' + options.github.redirectUri + '&' +
          'scope=' + options.github.apiScope;

        $window.location.href = url;
      }
    ])

    .controller('LogoutController', [
      '$state',
      'localStorageService',
      function ($state, localStorageService) {
        localStorageService.remove('accessToken');
        $state.go('welcome');
      }
    ])

    .controller('WelcomeController', [
      function () {
      }
    ])

    .controller('WhoAmIController', ['$scope', 'githubUserData',
      function ($scope, githubUserData) {
        githubUserData.get()
          .then(function (userData) {
            $scope.userData = userData;
          });
      }
    ]);
}(angular));
