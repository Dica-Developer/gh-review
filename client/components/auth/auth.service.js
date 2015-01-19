(function (angular) {
  'use strict';

  var github;

  angular.module('GHReview')
    .factory('authenticated', ['localStorageService',
      function (localStorageService) {
        return {
          get: function () {
            return localStorageService.get('accessToken') !== null;
          },
          set: function (value) {
            /*jshint camelcase:false*/
            localStorageService.set('accessToken', value.access_token);
          }
        };
      }
    ]);

}(angular));
