(function (angular) {
  'use strict';

  /* Services */

  var services = angular.module('GHReview');

  services.factory('filter', ['_', 'localStorageService', 'filterProvider',
    function (_, localStorageService, filterProvider) {

      var getAll = function () {
        var filter = [];
        var filterIds = localStorageService.get('filter');
        if (filterIds !== null) {
          filterIds.split(',').forEach(function (id) {
            filter.push(filterProvider.get(id));
          });
        }
        return filter;
      };

      var getById = function (filterId) {
        return filterProvider.get(filterId);
      };

      var remove = function (filterId) {
        localStorageService.remove('filter-' + filterId);
        var filterList = localStorageService.get('filter').split(',');
        _.remove(filterList, function (value) {
          return value === filterId;
        });
        localStorageService.set('filter', filterList.join(','));
      };

      return {
        getAll: getAll,
        getById: getById,
        remove: remove
      };

    }
  ]);

  /**
   * @deprecated should handled by worker as well and triggered from another place then menu directive
   */
  services.factory('collectComments', ['commentCollector', 'localStorageService', 'filter',
    function (commentCollector, localStorageService, filter) {
      return function () {
        var accessToken = localStorageService.get('accessToken');
        commentCollector.init(accessToken);
        commentCollector.announceRepositories(filter.getAll());
        return true;
      };
    }
  ]);

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
