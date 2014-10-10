(function (angular) {
  'use strict';

  var chunkModule = angular.module('GHReview');

  chunkModule.service('branchCollector', ['$q', '$interval', 'github', '_', function ($q, $interval, github, _) {
    var q = $q.defer;

    function BranchCollector() {
      this.get = _.memoize(function (owner, repo) {
        var _this = this;
        $interval(function(){
          _this.get.cache = {};
        }, (15 * 60 * 1000)); //15min
        return _this.getBranchesFromGithub(repo, owner);
      }, function(owner, repo){
        return owner +'-'+ repo;
      });
    }

    BranchCollector.prototype.getBranchesFromGithub = function (repo, owner) {
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

      github.repos.getBranches({
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
    return new BranchCollector();
  }]);
}(angular));

