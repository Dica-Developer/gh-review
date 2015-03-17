(function (angular) {
  'use strict';

  angular.module('GHReview')
    .service('eventCollector', ['$q', '$timeout', 'github', '_', function ($q, $timeout, github, _) {

      function getCacheKey (options) {
        return options.user +'/'+ options.repo;
      }

      function EventCollector() {
        this.pollInterval = 60 * 1000;
        this.get = _.memoize(function (options) {
          var _this = this,
            cacheKey = getCacheKey(options);
          $timeout(function () {
            _this.get.cache.delete(cacheKey);
          }, _this.pollInterval);
          return _this.getEvents(options);
        }, getCacheKey);
      }

      EventCollector.prototype.getEvents = function (options) {
        var _this = this,
          defer = $q.defer(),
          etag = options.etag;

        if (etag) {
          options.headers = {
            'If-None-Match': etag
          };
        }

        github.events.getFromRepo(options,
          function (err, result) {
            if (!err) {

              if (result.meta && result.meta.etag) {
                etag = result.meta.etag;
              }

              if (result.meta && result.meta['x-poll-interval']) {
                _this.pollInterval = parseInt(result.meta['x-poll-interval'], 10) * 1000;
              }

              delete result.meta;
              defer.resolve({result: result, etag: etag});
            } else {
              defer.reject();
            }
          });
        return defer.promise;
      };
      return new EventCollector();
    }]);
}(angular));

