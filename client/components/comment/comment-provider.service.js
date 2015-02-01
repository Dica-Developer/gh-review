(function (angular) {
  'use strict';

  angular.module('GHReview')
    .service('commentProvider', ['$q', '_', 'ghComments', 'commentCollector', 'Comment',
      function ($q, _, ghComments, commentCollector, Comment) {

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

        this.getCommentsForCommit = function (stateParams) {
          var defer = $q.defer();
          ghComments.getForCommit(stateParams)
            .then(function (comments) {
              getApproversFromComments(comments)
                .then(function (approvers) {
                  var resolveObject = {
                    comments: splitInLineAndCommitComments(comments, stateParams.user, stateParams.repo),
                    approvers: approvers
                  };
                  defer.resolve(resolveObject);
                }, defer.reject);
            }, defer.reject);
          return defer.promise;
        };

        this.getCommentsForCommitWithoutApprovers = function (stateParams) {
          var defer = $q.defer();
          ghComments.getForCommit(stateParams)
            .then(function (comments) {
              if (comments.length) {
                var resolveObject = splitInLineAndCommitComments(comments, stateParams.user, stateParams.repo);
                defer.resolve(resolveObject);
              } else {
                defer.resolve(false);
              }
            }, defer.reject);
          return defer.promise;
        };
      }]);
}(angular));