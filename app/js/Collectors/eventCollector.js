(function (angular) {
  'use strict';

  var app = angular.module('GHReview');

  app.service('eventCollector', ['$q', '$interval', 'github', '_', function ($q, $interval, github, _) {
    var q = $q.defer;

    function EventCollector() {
      this.pollInterval = 60 * 1000;
      this.etags = {};
      this.get = _.memoize(function (owner, repo) {
        var _this = this;
        $interval(function(){
          _this.get.cache = {};
        }, _this.pollInterval);
        return _this.getEventsFromGithub(owner, repo);
      }, function(owner, repo){
        return owner +'-'+ repo;
      });
    }

    EventCollector.prototype.getEventsFromGithub = function (owner, repo) {
      var _this = this,
        defer = q();

      var githubOptions = {
        user: owner,
        repo: repo
      };

      if(this.etags[owner +'/'+ repo]){
        githubOptions.headers = {
          'If-None-Match': this.etags[owner +'/'+ repo]
        };
      }

      github.events.getFromRepo(githubOptions,
        function (err, result) {
          if (!err) {
            if(result.meta && result.meta.etag){
              _this.etags[owner +'/'+ repo] = result.meta.etag;
            }

            if(result.meta && result.meta['x-poll-interval']){
              _this.pollInterval = parseInt(result.meta['x-poll-interval'], 10) * 1000;
            }

            defer.resolve(result);
          } else {
            defer.reject();
          }
        });
      return defer.promise;
    };
    return new EventCollector();
  }]);
}(angular));

