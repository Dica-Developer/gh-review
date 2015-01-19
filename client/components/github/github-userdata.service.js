(function (angular) {
  'use strict';

  angular.module('GHReview')
    .factory('githubUserData', ['$q', 'github',
      function ($q, github) {
        var userData = null;
        return {
          get: function () {
            var defer = $q.defer();
            if (userData) {
              defer.resolve(userData);
            } else {
              github.user.get({}, function (error, res) {
                if (error) {
                  defer.reject(error);
                } else {
                  userData = res;
                  defer.resolve(res);
                }
              });
            }
            return defer.promise;
          }
        };
      }
    ]);

}(angular));
