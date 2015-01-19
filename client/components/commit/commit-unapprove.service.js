(function (angular) {
  'use strict';

  angular.module('GHReview')
    .factory('unapproveCommit', ['$q', 'github', 'commentCollector',
      function ($q, github, commentCollector) {
        return function (commentId, sha, user, repo) {
          var defer = $q.defer();
          github.repos.deleteCommitComment({
            user: user,
            repo: repo,
            id: commentId
          }, function (error) {
            if (!error) {
              commentCollector.removeApprovalComment(sha);
              defer.resolve();
            } else {
              defer.reject(error);
            }
          });
          return defer.promise;
        };
      }
    ]);

}(angular));
