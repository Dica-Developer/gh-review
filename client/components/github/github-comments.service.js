(function (angular) {
  'use strict';

  angular.module('GHReview')
    .service('comments', ['$q', 'github',
      function ($q, github) {

        this.getForCommit = function (params) {
          var defer = $q.defer();
          github.repos.getCommitComments({
            user: params.user,
            repo: params.repo,
            sha: params.sha,
            headers: {
              'Accept': 'application/vnd.github-commitcomment.full+json'
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

        this.addCommitComment = function (sha, user, repo, comment) {
          var defer = $q.defer();
          github.repos.createCommitComment({
            user: user,
            repo: repo,
            // TODO sha and commit id are the same. Why do we need both?
            sha: sha,
            /*jshint camelcase:false*/
            commit_id: sha,
            body: comment
          }, function (error, comment) {
            if (!error) {
              defer.resolve(comment);
            } else {
              defer.reject(error);
            }
          });
          return defer.promise;
        };
      }
    ]);

}(angular));
