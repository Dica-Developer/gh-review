define(['lodash', 'controllers'], function (_, controllers) {
  'use strict';

  controllers
    .controller('CommitController', [
      '$scope',
      '$stateParams',
      'commitsAndComments',
      'Comment',
      'approveCommit',
      'unapproveCommit',
      'loggedInUser',
      'isCommentNotApprovalComment',
      'isCommentApprovalCommentFromUser',
      function ($scope, $stateParams, commitsAndComments, Comment, approveCommit, unapproveCommit, loggedInUser, isCommentNotApprovalComment, isCommentApprovalCommentFromUser) {
        var commit = commitsAndComments[0].commitInfos ? commitsAndComments[0] : commitsAndComments[1],
          comments = commitsAndComments[0].commitInfos ? commitsAndComments[1] : commitsAndComments[0],
          lineWithNewComment = [],
          lineComments = comments.comments.lineComments;

        var removeCommentFromScope = function () {
          _.remove(lineWithNewComment, function (comment) {
            /*jshint camelcase:false*/
            return comment.mode === 'edit' || _.isUndefined(comment.body_html);
          });
        };

        $scope.commitHeaderStatus = {
          open: false
        };
        $scope.commit = commit.commitInfos;
        $scope.files = commit.files;
        $scope.approvers = comments.approvers;
        $scope.comments = comments.comments;
        $scope.loggedInUserIsApprover = _.contains(comments.approvers, loggedInUser.login);
        $scope.isCommentNotApprovalComment = isCommentNotApprovalComment;

        $scope.addComment = function ($event, line /*, file, commit*/ ) {
          removeCommentFromScope();
          line.comments = line.comments || [];
          lineWithNewComment = line.comments;

          line.comments.push(new Comment({
            mode: 'edit',
            position: line.position,
            line: line.lineNrLeft || line.lineNrRight,
            sha: $stateParams.sha,
            path: line.path,
            editInformations: {
              repo: $stateParams.repo,
              user: $stateParams.user
            }
          }));
        };

        $scope.removeComment = function (line, commentToRemove) {
          commentToRemove.remove();
          _.remove(line.comments, function (comment) {
            return comment.id === commentToRemove.id;
          });
        };
        $scope.cancelAddComment = function () {
          removeCommentFromScope();
        };

        $scope.approveCommit = function () {
          approveCommit($stateParams.sha, $stateParams.user, $stateParams.repo).then(function () {
            console.log('ok');
          }).fail(function (error) {
            console.log('to bad: ' + error);
          });
        };

        $scope.unapproveCommit = function () {
          _.each(comments.comments.commitComments, function (comment) {
            if (isCommentApprovalCommentFromUser(comment, loggedInUser)) {
              unapproveCommit(comment.id, $stateParams.sha, $stateParams.user, $stateParams.repo).then(function () {
                console.log('ok');
              }).fail(function (error) {
                console.log('to bad: ' + error);
              });
            }
          });
        };

        _.each(lineComments, function (comment) {
          var path = comment.path;
          var file = _.findWhere(commit.files, {
            name: path
          });
          if (file) {
            var commentPosition = file.lines.lines[comment.position];
            if (!commentPosition.comments) {
              commentPosition.comments = [];
            }
            if (!file.commentCount) {
              file.commentCount = 0;
            }
            commentPosition.comments.push(comment);
            file.commentCount++;
          }
        });
      }
    ]);
});
