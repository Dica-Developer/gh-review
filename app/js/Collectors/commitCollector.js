(function (angular) {
  'use strict';

  var app = angular.module('GHReview');

  app.service('commitCollector', ['$q', '$interval', 'github', '_', function ($q, $interval, github, _) {
    var q = $q.defer;

    function CommitCollector() {
      this.get = _.memoize(function (githubOptions) {
        var _this = this;
        $interval(function(){
          _this.get.cache = {};
        }, (10 * 60 * 1000)); //10min
        return _this.getCommitsFromGithub(githubOptions);
      }, function(githubOptions){
        return _.values(githubOptions).join('-');
      });
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

