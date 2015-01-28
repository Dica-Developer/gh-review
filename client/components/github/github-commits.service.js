(function (angular) {
  'use strict';

  angular.module('GHReview')
    .service('commits', ['$q', 'github', 'localStorageService',
      function ($q, github, localStorageService) {
        this.bySha = function (params) {
          var defer = $q.defer();
          github.repos.getCommit({
            user: params.user,
            repo: params.repo,
            sha: params.sha,
            headers: {
              'Accept': 'application/vnd.github-commitcomment.html+json'
            }
          }, function (error, res) {
            if (error) {
              defer.reject(error);
            } else {
              if (res.meta) {
                delete res.meta;
              }
              defer.resolve(res);
            }
          });
          return defer.promise;
        };

        /*istanbul ignore next*/
        this.byPath = function (options) {
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
        };
      }
    ]);

}(angular));
