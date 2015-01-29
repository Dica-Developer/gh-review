(function (angular) {
  'use strict';

  angular.module('GHReview')
    .controller('CommitController', ['$injector', '$scope', '$stateParams', function ($injector, $scope, $stateParams) {

      var _ = $injector.get('_'),
        Comment = $injector.get('Comment'),
        Commit = $injector.get('Commit'),
        githubUserData = $injector.get('githubUserData'),
        events = $injector.get('events'),
        addLineCommentsToLines, getComments, lineWithNewComment, removeCommentFromScope;

      githubUserData.get()
        .then(function (user) {
          $scope.loggedInUser = user;
        });

      $scope.commit = new Commit($stateParams);
      $scope.commit.getCommit($stateParams)
        .then(function (commitResponse) {
          $scope.commitResponse = commitResponse;
          //TODO add test
          /*jshint camelcase: false*/
          var splittedUrl = commitResponse.html_url.split('/');
          $scope.commitRepo = splittedUrl[4];
          $scope.repoOwner = splittedUrl[3];
          events.removeNewCommit(commitResponse.commit.sha);
        });

      $scope.commit.getFiles()
        .then(function (files) {
          $scope.files = files;
          getComments();
        });

      getComments = function () {
        $scope.commit.getComments()
          .then(function (commentsResponse) {
            $scope.commitComments = commentsResponse.commitComments;
            addLineCommentsToLines(commentsResponse.lineComments);
            $scope.approvers = $scope.commit.getApprover();
          });
      };

      $scope.addLineComment = function (line) {
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
          sha: $stateParams.sha,
          path: null,
          editInformations: {
            repo: $stateParams.repo,
            user: $stateParams.user
          },
          user: $scope.loggedInUser
        }));
      };

      $scope.removeComment = function (line, commentToRemove) {
        commentToRemove.remove()
          .then(getComments);
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
        $scope.commit.approve($scope.loggedInUser)
          .then(getComments);
      };

      $scope.unapproveCommit = function () {
        $scope.commit.unapprove($scope.loggedInUser)
          .then(getComments);
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

      addLineCommentsToLines = function (lineComments) {
        lineComments.forEach(function (comment) {
          var path = comment.path,
            file = _.findWhere($scope.files, {
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
      };
    }]);
}(angular));