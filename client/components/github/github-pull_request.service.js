(function (angular) {
  'use strict';

  angular.module('GHReview')
    .service('ghPullRequest', ['$q', 'github', 'pullRequestCollector',
      function ($q, github, pullRequestCollector) {

        this.getAll = function (options) {
          return pullRequestCollector.get(options.user, options.repo);
        };

        this.get = function (options) {
          var defer = $q.defer();
          github.pullRequests.get(options, function (error, res) {
            if (error) {
              defer.reject(error);
            } else {
              defer.resolve(res);
            }
          });
          return defer.promise;
        };

        this.getFiles = function (options) {
          var defer = $q.defer();
          github.pullRequests.getFiles(options, function (error, res) {
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
