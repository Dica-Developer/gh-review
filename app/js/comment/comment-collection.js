/*global define*/
define(['backbone', 'commentModel', 'commentBox'], function (Backbone, CommentModel, CommentBoxes) {
  'use strict';

  var ShowCommentBoxView = CommentBoxes.show;

  var CommentCollection = Backbone.Collection.extend({
    model: CommentModel,
    initialize: function () {
      this.on('reset', this.addComments, this);
    },
    addComments: function () {
      this.each(function (model) {
        new ShowCommentBoxView({model: model});
      });
    }
  });


  return new CommentCollection();
});
