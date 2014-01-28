/*global define*/
define([
  'backbone',
  'underscore',
  'text!../templates/commit-list-item.html'
], function (Backbone, _, template) {
  'use strict';
  var CommitListView = Backbone.View.extend({
    template: _.template(template),
    initialize: function () {
      this.render();
    },
    serialize: function () {
      var commit = this.model.get('commit');
      return {
        message: this.model.commitMessage(),
        authorDate: commit.author.date,
        authorName: commit.author.name,
        /*jshint camelcase:false*/
        authorAvatar: this.model.get('author').avatar_url,
        commentCount: commit.comment_count,
        sha: this.model.get('sha')
      };
    },
    render: function () {
      return this.template(this.serialize());
    }
  });

  return CommitListView;
});