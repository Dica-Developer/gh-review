(function (angular) {
  'use strict';

  angular.module('GHReview')
    .factory('approveCommit', ['$q', 'github', 'options', 'githubUserData', 'commentCollector',
      function ($q, github, options, githubUserData, commentCollector) {
        return function (sha, user, repo) {
          var defer = $q.defer();

          githubUserData.get()
            .then(function (userData) {
              var commitState = {
                version: options.ghReview.version,
                approved: true,
                approver: userData.login,
                approvalDate: Date.now()
              };
              var comment = '```json\n' + JSON.stringify(commitState, null, 2) + '\n```\napproved with [gh-review](http://gh-review.herokuapp.com/)';
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
                  commentCollector.addApprovalComment(sha, comment.id);
                  defer.resolve();
                } else {
                  defer.reject(error);
                }
              });
            });
          return defer.promise;
        };
      }
    ]);

}(angular));
