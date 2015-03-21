(function (angular) {
  'use strict';

  angular.module('GHReview')
    .controller('CommitController', ['$injector', '$scope', 'preparedCommit', function ($injector, $scope, preparedCommit) {

      var _ = $injector.get('_'),
        Comment = $injector.get('Comment'),
        ghUser = $injector.get('ghUser'),
        lineWithNewComment, removeCommentFromScope,
        updateComments = function(){
          preparedCommit.updateComments()
            .then(function(){
              $scope.approvers = preparedCommit.getApprover();
              $scope.commitComments = preparedCommit.comments;
            });
        };

      ghUser.get()
        .then(function (user) {
          $scope.loggedInUser = user;
        });

      $scope.commit = preparedCommit;
      $scope.commitResponse = preparedCommit.commitData;
      $scope.commitRepo = preparedCommit.options.repo;
      $scope.repoOwner = preparedCommit.options.user;
      $scope.files = preparedCommit.files;
      $scope.commitComments = preparedCommit.comments;
      $scope.approvers = preparedCommit.getApprover();

      $scope.addLineComment = function (line) {
        removeCommentFromScope();
        line.comments = line.comments || [];
        lineWithNewComment = line.comments;

        line.comments.push(new Comment({
          mode: 'edit',
          position: line.position,
          line: line.lineNrLeft || line.lineNrRight,
          sha: preparedCommit.options.sha,
          path: line.path,
          editInformations: {
            repo: preparedCommit.options.repo,
            user: preparedCommit.options.user
          },
          user: $scope.loggedInUser
        }));
      };


      $scope.addCommitComment = function () {
        removeCommentFromScope();
        $scope.commitComments.push(new Comment({
          mode: 'edit',
          position: null,
          line: null,
          sha: preparedCommit.options.sha,
          path: null,
          editInformations: {
            repo: preparedCommit.options.repo,
            user: preparedCommit.options.user
          },
          user: $scope.loggedInUser
        }));
      };

      $scope.removeComment = function (line, commentToRemove) {
        commentToRemove.remove()
          .then(updateComments);
        if (line) {
          _.remove(line.comments, function (comment) {
            return comment.id === commentToRemove.id;
          });
        }
      };

      $scope.cancelCreateComment = function () {
        removeCommentFromScope();
      };

      $scope.approveCommit = function () {
        preparedCommit.approve($scope.loggedInUser)
          .then(updateComments);
      };

      $scope.unapproveCommit = function () {
        preparedCommit.unapprove($scope.loggedInUser)
          .then(updateComments);
      };

      removeCommentFromScope = function () {
        _.remove(lineWithNewComment, function (comment) {
          /*jshint camelcase:false*/
          return comment.mode === 'edit' || _.isUndefined(comment.body_html);
        });
        _.remove($scope.commitComments, function (comment) {
          /*jshint camelcase:false*/
          return comment.mode === 'edit' || _.isUndefined(comment.body_html);
        });
      };
    }]);
}(angular));