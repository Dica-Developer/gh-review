/*global define*/
define(
  [
    'backbone',
    'underscore',
    'app',
    'CommentModel',
    'commentBox'
  ],
  function (Backbone, _, app, CommentModel, CommentBoxes) {
    'use strict';

    var ShowCommentBoxView = CommentBoxes.show;

    var CommentCollection = Backbone.Collection.extend({
      model: CommentModel,
      initialize: function () {},
      addComments: function () {
        this.each(function (model) {
          var comment = app.commitApproved[model.get('commit_id')];
          if (_.isNull(comment) || _.isUndefined(comment) || (comment.id !== model.get('id'))) {
            new ShowCommentBoxView({
              model: model
            });
          }
        });
      }
    });

    return CommentCollection;
  });