(function (angular) {
  'use strict';

  angular.module('GHReview')
    .factory('getFileContent', ['$q', 'github',
      function ($q, github) {
        return function (options) {
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
