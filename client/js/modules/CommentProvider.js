(function (angular) {
  'use strict';

  var commentProviderModule = angular.module('GHReview');

  commentProviderModule.factory('commentProvider', ['$q', '_', 'github', 'commentCollector', 'Comment',
    function ($q, _, github, commentCollector, Comment) {

      var getApproversFromComments = function (comments) {
        var defer = $q.defer();
        commentCollector.getCommitApproved().then(function (commitApproved) {
          var approveComments = commentCollector.getApproveComments();
          var approvers = [];
          comments.forEach(function (comment) {
            /*jshint camelcase:false*/
            if ((true === commitApproved[comment.commit_id]) && (true === approveComments[comment.id])) {
              approvers.push(comment.user.login);
            }
          });
          defer.resolve(approvers);
        });
        return defer.promise;
      };

      var splitInLineAndCommitComments = function (result, user, repo) {
        var lineComments = _.filter(result, function (comment) {
          return !_.isNull(comment.line) || !_.isNull(comment.position);
        });
        var commitComments = _.where(result, {
          line: null,
          position: null
        });

        lineComments = _.map(lineComments, function (comment) {
          comment.editInformations = {
            user: user,
            repo: repo
          };
          return new Comment(comment);
        });

        commitComments = _.map(commitComments, function (comment) {
          comment.editInformations = {
            user: user,
            repo: repo
          };
          return new Comment(comment);
        });

        return {
          lineComments: lineComments,
          commitComments: commitComments
        };
      };

      var getCommentsForCommit = function (stateParams) {
        var defer = $q.defer();
        github.repos.getCommitComments({
          user: stateParams.user,
          repo: stateParams.repo,
          sha: stateParams.sha,
          headers: {
            'Accept': 'application/vnd.github-commitcomment.full+json'
          }
        }, function (error, res) {
          if (error) {
            defer.reject(error);
          } else {
            /*istanbul ignore next*/
            if (res.meta) {
              delete res.meta;
            }
            getApproversFromComments(res).then(function (approvers) {
              var comments = splitInLineAndCommitComments(res, stateParams.user, stateParams.repo);
              var resolveObject = {
                comments: comments,
                approvers: approvers
              };
              defer.resolve(resolveObject);
            });
          }
        });
        return defer.promise;
      };

      function getCommentsForCommitWithoutApprovers(stateParams) {
        var defer = $q.defer();
        github.repos.getCommitComments({
          user: stateParams.user,
          repo: stateParams.repo,
          sha: stateParams.sha,
          headers: {
            'Accept': 'application/vnd.github-commitcomment.full+json'
          }
        }, function (error, res) {
          if (error) {
            defer.reject(error);
          } else {
            /*istanbul ignore next*/
            if (res.meta) {
              delete res.meta;
            }
            if (res.length) {
              var comments = splitInLineAndCommitComments(res, stateParams.user, stateParams.repo);
              defer.resolve(comments);
            } else {
              defer.resolve(false);
            }
          }
        });
        return defer.promise;
      }

      return {
        getCommentsForCommit: getCommentsForCommit,
        getCommentsForCommitWithoutApprovers: getCommentsForCommitWithoutApprovers
      };
    }
  ]);
}(angular));