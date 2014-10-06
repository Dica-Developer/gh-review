(function (angular) {
  'use strict';

  angular.module('GHReview', ['LocalStorageModule'])
    .config(['localStorageServiceProvider',
      function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('ghreview');
      }
    ])
    .controller('OauthController', ['$window', '$http', 'localStorageService', 'options', function ($window, $http, localStorageService, options) {
      var token = $window.location.search.replace('?code=', '');
      var url = options.github.accessTokenUrl + '?' +
        'client_id=' + options.github.clientId + '&' +
        'code=' + token + '&' +
        'scope=' + options.github.apiScope;
      $http.post(url)
        .then(function (resp) {
          if (!resp.data.error) {
            /*jshint camelcase:false*/
            localStorageService.set('accessToken', resp.data.access_token);
            var redirectUri = $window.location.origin.indexOf('localhost') ? $window.location.origin : $window.location.origin + $window.location.pathname;
            $window.location.href = redirectUri;
          }
        });
    }]);
}(angular));
