/*global define*/
define([
  'jquery',
  'backbone',
  'underscore',
  'when',
  'app',
  'text!templates/edit-comment-box.html',
  'text!templates/show-comment-box.html',
  'text!templates/commit-comment-box.html'
], function ($, Backbone, _, when, app, editTemplate, showTemplate, commitCommentTemplate) {
  'use strict';

  var ShowCommentBoxView = Backbone.View.extend({
    template: _.template(showTemplate),
    commitCommentTemplate: _.template(commitCommentTemplate),
    tagName: 'tr',
    attributes: {
      'class': 'comment-row'
    },
    events: {
      'click .remove': 'removeComment',
      'click .edit': 'editComment'
    },
    initialize: function () {
      var path = this.model.get('path');
      var position = this.model.get('position');
      this.position = $('[data-path="' + path + '"][data-line="' + position + '"]');
      this.render();
    },
    render: function () {
      if (this.model.get('commitComment')) {
        this.$el.html(this.commitCommentTemplate(this.model.toJSON()));
        $('.commit-comments').append(this.$el);
      } else {
        this.$el.html(this.template(this.model.toJSON()));
        this.position.after(this.$el);
      }
      return this;
    },
    removeComment: function () {
      var message = {
        id: this.model.get('id'),
        user: app.currentReviewData.user,
        repo: app.currentReviewData.repo
      };
      app.github.repos.deleteCommitComment(message, function (error) {
        if (!error) {
          this.remove();
        }
      }.bind(this));
    },
    editComment: function () {
      var message = {
        owner: app.currentReviewData.user,
        repo: app.currentReviewData.repo,
        id: this.model.get('id')
      };
      app.github.repos.updateCommitComment(message, function (error) {
        if (!error) {
          var commentMessage = this.model.get('commentMessage');
          console.log('commentmessage', commentMessage);
          // TODO show edit comment box instead of show comment box
          // submit only if changed
        }
      }.bind(this));
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
      var comment = this.$el.find('#commentBox > textarea').val();
      if (comment !== '') {
        when(this.model.addLineComment(this.options.fileIndex, this.options.position, comment))
          .then(function () {
            this.remove();
          }.bind(this));
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