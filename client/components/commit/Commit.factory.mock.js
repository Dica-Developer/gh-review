(function (angular) {
  'use strict';

  angular.module('CommitMock', [])
    .factory('Commit', function (Comment, _) {

      function splitInLineAndCommitComments(result, user, repo) {
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
      }

      function Commit(options) {
        this.options = options;
        this.prepareComments = function(comments){
          this.comments = splitInLineAndCommitComments(comments);
        };
      }

      Commit.prototype.updateComments = function () {

      };

      Commit.prototype.approve = function () {

      };

      Commit.prototype.unapprove = function () {

      };

      Commit.prototype.getApprover = function () {
        return [];
      };
      

      return Commit;
    });
}(angular));