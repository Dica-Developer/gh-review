(function (angular) {
  'use strict';

  angular.module('GHReview')
    .service('ghRepos', ['$q', 'github',
      function ($q, github) {
        this.getAll = function(options){
          options = options || {};
          var defer = $q.defer();
          github.repos.getAll(options, function (error, res) {
            if (error) {
              defer.reject(error);
            } else {
              defer.resolve(res);
            }
          });
          return defer.promise;
        };

        this.getFromOrg = function(options){
          var defer = $q.defer();
          github.repos.getFromOrg(options, function (err, result) {
            if (!err) {
              defer.resolve(result);
            } else {
              defer.reject(err);
            }
          });
          return defer.promise;
        };
      }
    ]);

}(angular));
