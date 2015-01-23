(function (angular) {
  'use strict';

  angular.module('GHReview')
    .controller('LoginController', ['$scope', '$window', 'options',
      function ($scope, $window, options) {
        var url = 'https://github.com/login/oauth/authorize?' +
          'client_id=' + options.github.clientId + '&' +
          'redirect_uri=' + options.github.redirectUri + '&' +
          'scope=' + options.github.apiScope;

        $window.location.href = url;
      }
    ]);

}(angular));
