(function (angular) {
  'use strict';

  angular.module('GHReview')
    .factory('getAllAvailableRepos', ['$q', 'github',
      function ($q, github) {
        return function () {
          var defer = $q.defer();
          github.repos.getAll({}, function (error, res) {
            if (error) {
              defer.reject(error);
            } else {
              defer.resolve(res);
            }
          });
          return defer.promise;
        };
      }
    ]);

}(angular));
