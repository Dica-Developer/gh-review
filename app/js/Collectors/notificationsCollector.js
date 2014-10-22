(function (angular) {
  'use strict';

  var app = angular.module('GHReview');

  app.service('notificationsCollector', ['$q', '$interval', 'github', '_', function ($q, $interval, github, _) {
    var q = $q.defer;

    function NotificationsCollector() {
      var _this = this;
      this.pollInterval = 60 * 1000;
      this.etags = {};
      this.get = _.memoize(function (owner) {
        return _this.getNotificationsFromGithub(owner);
      }, function(owner){
        return owner;
      });

      this.cacheInvalidationTimer = $interval(function () {
        _this.get.cache = {};
      }, this.pollInterval);
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
              $interval.cancel(_this.cacheInvalidationTimer);
              _this.cacheInvalidationTimer = $interval(function () {
                _this.get.cache = {};
              }, _this.pollInterval);
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

