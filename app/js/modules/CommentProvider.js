define(['angular', 'lodash'], function (angular, _) {
  'use strict';

  var commentProviderModule = angular.module('GHReview.CommentProvider', []);

  commentProviderModule.factory('commentProvider', ['$q', 'authenticated', 'github', 'commentCollector', 'Comment',
    function ($q, authenticated, github, commentCollector, Comment) {

      var getApproversFromComments = function (result) {
        var defer = $q.defer();
        commentCollector.getCommitApproved().then(function (commitApproved) {
          var approveComments = commentCollector.getApproveComments();
          var approvers = [];
          _.each(result, function (comment) {
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
        if (authenticated.get()) {
          github.repos.getCommitComments({
            user: stateParams.user,
            repo: stateParams.repo,
            sha: stateParams.sha,
            headers: {
              'Accept': 'application/vnd.github-commitcomment.html+json'
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
        } else {
          defer.reject(new Error('Not authenticated'));
        }
        return defer.promise;
      };

      return {
        getCommentsForCommit: getCommentsForCommit
      };
    }
  ]);
});
