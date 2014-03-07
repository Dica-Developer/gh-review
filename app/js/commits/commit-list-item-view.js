/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'text!templates/commit-list-item.html'
], function (Backbone, _, app, template) {
  'use strict';

  return Backbone.View.extend({
    template: _.template(template),
    initialize: function () {
      this.render();
    },
    serialize: function () {
      var commit = this.model.get('commit');
      var approved = (true === app.commitApproved[this.model.get('sha')]);
      return {
        message: this.model.commitMessage(),
        authorDate: commit.author.date,
        authorName: commit.author.name,
        /*jshint camelcase:false*/
        authorAvatar: this.model.get('author').avatar_url,
        commentCount: commit.comment_count,
        sha: this.model.get('sha'),
        approved: approved,
        isFeatureCommit: this.model.get('featureCommit')
      };
    },
    render: function () {
      app.showIndicator(false);
      return this.template(this.serialize());
    }
  });
});