(function (angular) {
  'use strict';

  angular.module('GHReview')
    .service('ghRepos', ['$q', 'github',
      function ($q, github) {
        this.getAll = function(){
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
