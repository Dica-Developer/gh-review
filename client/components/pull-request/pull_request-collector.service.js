(function (angular) {
  'use strict';

  angular.module('GHReview')
    .service('pullRequestCollector', ['$q', '$timeout', 'github', '_', function ($q, $timeout, github, _) {
      var q = $q.defer;

      function PullRequestCollector() {
        this.get = _.memoize(function (owner, repo) {
          var _this = this;
          $timeout(function () {
            _this.get.cache.delete(owner + '-' + repo);
          }, (15 * 60 * 1000)); //15min
          return _this.getPullRequestList(repo, owner);
        }, function (owner, repo) {
          return owner + '-' + repo;
        });
      }

      PullRequestCollector.prototype.getPullRequestList = function (repo, owner) {
        var tmpResult = [],
          defer = q();

        var pagination = function (result) {
          github.getNextPage(result, function (err, paginationResult) {
            if (!err) {
              tmpResult = tmpResult.concat(paginationResult);
              /* istanbul ignore if */
              //no need to test this twice
              if (github.hasNextPage(paginationResult)) {
                pagination(paginationResult);
              } else {
                defer.resolve(tmpResult);
              }
            } else {
              defer.reject();
            }
          });
        };

        github.pullRequests.getAll({
            repo: repo,
            user: owner,
            'per_page': 100
          },
          function (err, result) {
            if (!err) {
              tmpResult = result;
              if (github.hasNextPage(result)) {
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
      return new PullRequestCollector();
    }]);
}(angular));