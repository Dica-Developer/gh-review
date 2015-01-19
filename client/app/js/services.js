(function (angular) {
  'use strict';

  /* Services */

  var services = angular.module('GHReview');

  services.factory('getCommitApproved', ['commentCollector',
    function (commentCollector) {
      return commentCollector.getCommitApproved();
    }
  ]);

  services.factory('commentProviderService', ['commentProvider',
    function (commentProvider) {
      return commentProvider;
    }
  ]);

  services.factory('commitProviderService', ['commitProvider',
    function (commitProvider) {
      return commitProvider;
    }
  ]);

  services.factory('approveCommit', ['$q', 'github', 'options', 'githubUserData', 'commentCollector',
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

  services.factory('unapproveCommit', ['$q', 'github', 'commentCollector',
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

  services.factory('isCommentNotApprovalComment', ['commentCollector',
    function (commentCollector) {
      return function (commentId) {
        return (true !== commentCollector.getApproveComments()[commentId]);
      };
    }
  ]);

  services.factory('isCommentApprovalCommentFromUser', ['commentCollector',
    function (commentCollector) {
      return function (comment, loggedInUser) {
        return (true === commentCollector.getApproveComments()[comment.id]) && comment.user.login === loggedInUser.login;
      };
    }
  ]);
}(angular));
