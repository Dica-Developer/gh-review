(function (angular) {
  'use strict';

  /* Controllers */

  return angular.module('GHReview')
    .controller('RootController', [
      '$scope',
      '$location',
      '$http',
      '$window',
      'authenticated',
      'options',
      function ($scope, $location, $http, $window, authenticated, options) {
        var absUrl = $location.absUrl();
        var codeIndex = absUrl.indexOf('code');
        var equalIndex = absUrl.indexOf('=');
        var hashIndex = absUrl.indexOf('#');
        if (codeIndex > -1) {
          var authCode = absUrl.slice(equalIndex + 1, hashIndex);
          var url = options.github.accessTokenUrl + '?' +
            'client_id=' + options.github.clientId + '&' +
            'code=' + authCode + '&' +
            'scope=' + options.github.apiScope;
          $http.post(url)
            .then(function (resp) {
              if (!resp.data.error) {
                authenticated.set(resp.data);
              }
              $window.location.href = $window.location.origin + $window.location.pathname;
            });
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
      '$window',
      'localStorageService',
      function ($window, localStorageService) {
        localStorageService.remove('accessToken');
        $window.location.replace($window.location.origin + $window.location.pathname);
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
