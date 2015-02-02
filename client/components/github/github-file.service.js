(function (angular) {
  'use strict';

  angular.module('GHReview')
    .service('ghFile', ['$q', 'github',
      function ($q, github) {
        this.getContent = function (options) {
          var defer = $q.defer();
          options.headers = {
            'accept': 'application/vnd.github.v3.raw'
          };
          github.repos.getContent(options, function (error, result) {
            if (!error) {
              defer.resolve(result.data);
            } else {
              defer.reject(error);
            }
          });
          return defer.promise;
        };
      }
    ]);

}(angular));
