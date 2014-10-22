(function (angular) {
  'use strict';

  var app = angular.module('GHReview');

  app.service('notificationsCollector', ['$q', '$interval', 'github', '_', function ($q, $interval, github, _) {
    var q = $q.defer;

    function NotificationsCollector() {
      this.pollInterval = 60 * 1000;
      this.etags = {};
      this.get = _.memoize(function (owner) {
        var _this = this;
        $interval(function(){
          _this.get.cache = {};
        }, _this.pollInterval);
        return _this.getNotificationsFromGithub(owner);
      }, function(owner){
        return owner;
      });
    }

    NotificationsCollector.prototype.getNotificationsFromGithub = function (owner) {
      var _this = this,
        defer = q();

      var githubOptions = {
        user: owner
      };

      github.notifications.getAll(githubOptions,
        function (err, result) {
          if (!err) {
            if(result.meta && result.meta['x-poll-interval']){
              _this.pollInterval = parseInt(result.meta['x-poll-interval'], 10) * 1000;
            }

            defer.resolve(result);
          } else {
            defer.reject(err);
          }
        });
      return defer.promise;
    };
    return new NotificationsCollector();
  }]);
}(angular));

