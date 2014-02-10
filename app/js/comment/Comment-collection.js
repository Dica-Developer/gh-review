/*global define*/
define(['backbone', 'CommentModel', 'commentBox'], function (Backbone, CommentModel, CommentBoxes) {
  'use strict';

  var ShowCommentBoxView = CommentBoxes.show;

  var CommentCollection = Backbone.Collection.extend({
    model: CommentModel,
    initialize: function () {},
    addComments: function () {
      this.each(function (model) {
        new ShowCommentBoxView({model: model});
      });
    }
  });


  return CommentCollection;
});
