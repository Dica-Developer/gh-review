/*global define*/
define(
  [
    'backbone',
    'app',
    'CommentModel',
    'commentBox'
  ],
  function (Backbone, app, CommentModel, CommentBoxes) {
    'use strict';

    var ShowCommentBoxView = CommentBoxes.show;

    var CommentCollection = Backbone.Collection.extend({
      model: CommentModel,
      initialize: function () {},
      addComments: function () {
        this.each(function (model) {
          if ((true !== app.commitApproved[model.get('commit_id')]) || (true !== app.approveComments[model.get('id')])) {
            new ShowCommentBoxView({
              model: model
            });
          }
        });
      }
    });

    return CommentCollection;
  }
);