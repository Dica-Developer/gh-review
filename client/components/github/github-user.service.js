(function (angular) {
  'use strict';

  angular.module('GHReview')
    .service('ghUser', ['$q', 'github',
      function ($q, github) {
        var userData = null;
        this.get = function () {
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
        };

        this.getOrgs = function (options) {
          options = options || {};
          var defer = $q.defer();
          github.user.getOrgs(options, function (err, result) {
            if (!err) {
              defer.resolve(result);
            } else {
              defer.reject();
            }
          });
          return defer.promise;
        };
      }
    ]);
}(angular));
