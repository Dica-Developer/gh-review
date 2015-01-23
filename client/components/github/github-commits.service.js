(function (angular) {
  'use strict';

  angular.module('GHReview')
    .factory('commits', ['$q', 'github', 'localStorageService',
      function ($q, github, localStorageService) {
        return {
          bySha: function (params) {
            var defer = $q.defer();
            github.repos.getCommit({
              user: params.user,
              repo: params.repo,
              sha: params.sha
            }, function (error, res) {
              if (error) {
                defer.reject(error);
              } else {
                defer.resolve(res);
              }
            });
            return defer.promise;
          },
          byPath: /*istanbul ignore next*/ function (options) {
            var defer = $q.defer();
            var commitsPerFileWorker = new Worker('worker/commitsOfFile.js');
            commitsPerFileWorker.onmessage = function (event) {
              if ('commits' === event.data.type) {
                commitsPerFileWorker.terminate();
                defer.resolve(event.data.commits.concat([]));
              }
            };
            options.type = 'getCommits';
            options.token = localStorageService.get('accessToken');
            commitsPerFileWorker.postMessage(options);
            return defer.promise;
          }
        };
      }
    ]);

}(angular));
