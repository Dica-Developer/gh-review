/*global define*/
define(
  [
    'backbone',
    'when',
    'app',
    'CommentModel',
    'commentBox'
  ],
  function (Backbone, when, app, CommentModel, CommentBoxes) {
    'use strict';

    var ShowCommentBoxView = CommentBoxes.show;

    var CommentCollection = Backbone.Collection.extend({
      model: CommentModel,
      initialize: function () {
      },
      renderComments: function () {
        this.each(function (model) {
          if ((true !== app.commitApproved[model.get('commit_id')]) || (true !== app.approveComments[model.get('id')])) {
            new ShowCommentBoxView({
              model: model
            });
          }
        });
      },
      getApprovers: function () {
        var approvers = [];
        this.each(function (model) {
          if ((true === app.commitApproved[model.get('commit_id')]) && (true === app.approveComments[model.get('id')])) {
            approvers.push(model.get('user').login);
          }
        });
        return approvers;
      },
      getApproveCommentId: function (login) {
        var approveCommentId = null;
        this.each(function (model) {
          if ((true === app.commitApproved[model.get('commit_id')]) && (true === app.approveComments[model.get('id')])) {
            if (model.get('user').login === login) {
              approveCommentId = model.get('id');
            }
          }
        });
        return approveCommentId;
      },
      removeComment: function (commentId) {
        var defer = when.defer();
        var message = {
          id: commentId,
          user: app.currentReviewData.user,
          repo: app.currentReviewData.repo
        };
        app.github.repos.deleteCommitComment(message, function (error) {
          if (!error) {
            var model = this.findWhere({
              id: commentId
            });
            defer.resolve(model);
          } else {
            defer.reject(error);
          }
        }.bind(this));
        return defer.promise;
      }
    });

    return CommentCollection;
  }
);