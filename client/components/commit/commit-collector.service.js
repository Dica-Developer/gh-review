(function (angular) {
  'use strict';

  angular.module('GHReview')
    .service('commitCollector', ['$q', '$timeout', 'github', '_', function ($q, $timeout, github, _) {
      var q = $q.defer;

      function getCacheKey(options) {
        return _.values(options).join('-');
      }

      function CommitCollector() {
        this.get = _.memoize(function (githubOptions) {
          var _this = this,
            cacheKey = getCacheKey(githubOptions);
          $timeout(function () {
            _this.get.cache.delete(cacheKey);
          }, (10 * 60 * 1000)); //10min
          return _this.getCommitsFromGithub(githubOptions);
        }, getCacheKey);
      }

      CommitCollector.prototype.getCommitsFromGithub = function (githubOptions) {
        var tmpResult = [],
          defer = q();

        var pagination = function (result) {
          github.getNextPage(result, function (err, paginationResult) {
            if (!err) {
              tmpResult = tmpResult.concat(paginationResult);
              /* istanbul ignore if */
              //no need to test this twice
              if (github.hasNextPage(paginationResult)) {
                defer.notify(tmpResult);
                pagination(paginationResult);
              } else {
                defer.resolve(tmpResult);
              }
            } else {
              defer.reject();
            }
          });
        };

        /*jshint camelcase:false*/
        githubOptions.per_page = 100;
        github.repos.getCommits(githubOptions,
          function (err, result) {
            if (!err) {
              if (github.hasNextPage(result)) {
                tmpResult = result;
                pagination(result);
              } else {
                defer.resolve(result);
              }
            } else {
              defer.reject();
            }
          });
        return defer.promise;
      };
      return new CommitCollector();
    }]);
}(angular));

