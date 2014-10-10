(function (angular) {
  'use strict';

  var app = angular.module('GHReview');

  app.service('contributorCollector', ['$q', '$interval', 'github', '_', function ($q, $interval, github, _) {
    var q = $q.defer;

    function ContributorCollector() {
      this.get = _.memoize(function (owner, repo) {
        var _this = this;
        $interval(function(){
          _this.get.cache = {};
        }, (2 * 60 * 60 * 1000)); //2h
        return _this.getContributorFromGithub(repo, owner);
      }, function(owner, repo){
        return owner +'-'+ repo;
      });
    }

    ContributorCollector.prototype.getContributorFromGithub = function (repo, owner) {
      var tmpResult = [],
        defer = q();

      var pagination = function (result) {
        tmpResult = tmpResult.concat(result);
        github.getNextPage(result, function (err, paginationResult) {
          if (!err) {
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

      github.repos.getContributors({
          repo: repo,
          user: owner,
          'per_page': 100
        },
        function (err, result) {
          if (!err) {
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
    return new ContributorCollector();
  }]);
}(angular));

