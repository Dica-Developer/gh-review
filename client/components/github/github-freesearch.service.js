(function (angular) {
  'use strict';

  angular.module('GHReview')
    .factory('githubFreeSearch', ['$q', 'github',
      function ($q, github) {
        return function (searchValue) {
          var defer = $q.defer();
          github.search.code({
            q: searchValue
          }, function (error, res) {
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
