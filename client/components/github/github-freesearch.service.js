(function (angular) {
  'use strict';

  angular.module('GHReview')
    .service('ghSearch', ['$q', 'github',
      function ($q, github) {
        this.query = function (searchValue) {
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
