(function (angular) {
  'use strict';

  var app = angular.module('GHReview');

  app.service('treeCollector', ['$q', '$interval', 'github', '_', function ($q, $interval, github, _) {
    var q = $q.defer;

    function TreeCollector() {
      this.get = _.memoize(function (owner, repo, branch) {
        var _this = this;
        $interval(function () {
          _this.get.cache = {};
        }, (30 * 60 * 1000)); //30min
        return _this.getTreeFromGithub(owner, repo, branch);
      }, function (owner, repo, branch) {
        return owner + '-' + repo + '-' + branch;
      });
    }

    TreeCollector.prototype.getTreeFromGithub = function (owner, repo, branch) {
      var tmpResult = [],
        defer = q();

      var pagination = function (result) {
        tmpResult = tmpResult.concat(result.tree);
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

      github.gitdata.getTree({
          user: owner,
          repo: repo,
          sha: branch,
          recursive: true
        },
        function (err, result) {
          if (!err) {
            if (github.hasNextPage(result)) {
              pagination(result);
            } else {
              defer.resolve(result.tree);
            }
          } else {
            defer.reject();
          }
        });
      return defer.promise;
    };
    return new TreeCollector();
  }]);
}(angular));

