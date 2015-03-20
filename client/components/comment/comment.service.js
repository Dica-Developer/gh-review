(function (angular) {
  'use strict';
  angular.module('GHReview')
    .factory('Comment', ['$q', '$log', 'ghComments', '_',
      function ($q, $log, ghComments, _) {

        function Comment(options) {
          if (!options.mode) {
            options.mode = 'show';
          }
          _.extend(this, options);
        }

        Comment.prototype.preview = function () {
          var self = this;
          /*jshint camelcase: false*/
          ghComments.renderAsMarkdown(this.edit_text)
            .then(function(comment){
              self.preview_html = comment.data;
              self.mode = 'preview';
            });
        };

        Comment.prototype.createComment = function () {
          var self = this,
            user = this.editInformations.user,
            repo = this.editInformations.repo,
            sha = this.sha,
            callback = function(comment){
              comment.mode = 'show';
              _.extend(self, comment);
            };

          if (_.isNull(this.line) && _.isNull(this.position)) {
            /*jshint camelcase:false*/
            ghComments.addCommitComment(sha, user, repo, this.edit_text)
              .then(callback);
          } else {
            ghComments.addLineComment(sha, user, repo, this.line, this.position, this.path, this.edit_text)
              .then(callback);
          }
        };

        Comment.prototype.remove = function () {
          return ghComments.deleteComment(this.editInformations.user, this.editInformations.repo, this.id);
        };

        Comment.prototype.edit = function () {
          this.mode = 'edit';
          /*jshint camelcase:false*/
          this.edit_text = this.body_text;
        };

        Comment.prototype.continueEditing = function () {
          this.mode = 'edit';
        };

        Comment.prototype.cancelEdit = function () {
          this.mode = 'show';
          /*jshint camelcase:false*/
          this.edit_text = '';
        };

        Comment.prototype.save = function () {
          var self = this,
            user = this.editInformations.user,
            repo = this.editInformations.repo;

          /*jshint camelcase:false*/
          ghComments.updateComment(user, repo, this.id, this.edit_text)
            .then(function(comment){
              comment.mode = 'show';
              _.extend(self, comment);
            });
        };

        Comment.prototype.shouldShowEditButton = function () {
          return this.mode === 'show';
        };

        Comment.prototype.isApproval = function () {
          return this.body && this.body.indexOf('approved with [gh-review](http://gh-review.herokuapp.com/)') > -1;
        };

        Comment.prototype.isNotApproval = function () {
          return !this.isApproval();
        };

        Comment.prototype.getApprover = function () {
          if (this.isNotApproval()) {
            return null;
          }

          var startIndex = this.body.indexOf('```json');
          if (startIndex > -1) {
            var endIndex = this.body.lastIndexOf('```');
            if (endIndex > -1) {
              var commentJson = this.body.substring(7, endIndex),
                commentObj = JSON.parse(commentJson);
              return commentObj.approver;
            }
          }
        };

        return Comment;
      }
    ]);
}(angular));
