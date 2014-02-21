/*global define*/
define([
  'jquery',
  'backbone',
  'underscore',
  'when',
  'app',
  'text!templates/edit-comment-box.html',
  'text!templates/show-comment-box.html'
], function ($, Backbone, _, when, app, editTemplate, showTemplate) {
  'use strict';

  var ShowCommentBoxView = Backbone.View.extend({
    template: _.template(showTemplate),
    tagName: 'tr',
    events: {
      'click .remove': 'removeComment'
    },
    initialize: function () {
      var path = this.model.get('path');
      var position = this.model.get('position');
      if (position) {
        this.position = $('[data-path="' + path + '"][data-line="' + position + '"]');
      } else {
        this.position = $('.approveCommit').parent().prev();
      }
      this.render();
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      this.position.after(this.$el);
      return this;
    },
    removeComment: function () {
      var _this = this;
      var message = {
        id: this.model.get('id'),
        user: app.currentReviewData.user,
        repo: app.currentReviewData.repo
      };
      app.github.repos.deleteCommitComment(message, function (error) {
        if (!error) {
          _this.remove();
        }
      });
    }
  });

  var EditCommentBoxView = Backbone.View.extend({
    template: _.template(editTemplate),
    tagName: 'tr',
    events: {
      'click #submitLineComment': 'submitLineComment',
      'click #cancelComment': 'cancelCommenting'
    },
    initialize: function () {
      this.render();
    },
    render: function () {
      this.$el.html(this.template());
      this.options.tr.after(this.$el);
      return this;
    },
    submitLineComment: function () {
      var _this = this;
      var comment = this.$el.find('#commentBox > textarea').val();
      if (comment !== '') {
        when(this.model.addLineComment(this.options.fileIndex, this.options.position, comment))
          .then(function () {
            _this.remove();
          });
      }
    },
    cancelCommenting: function () {
      this.remove();
    }
  });

  return {
    edit: EditCommentBoxView,
    show: ShowCommentBoxView
  };
});