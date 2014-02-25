/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'text!templates/commit-list-item.html'
], function (Backbone, _, app, template) {
  'use strict';
  var CommitListView = Backbone.View.extend({
    template: _.template(template),
    initialize: function () {
      this.render();
    },
    serialize: function () {
      var commit = this.model.get('commit');
      var approved = (!_.isUndefined(app.commitApproved[this.model.get('sha')]) && !_.isNull(app.commitApproved[this.model.get('sha')]));
      return {
        message: this.model.commitMessage(),
        authorDate: commit.author.date,
        authorName: commit.author.name,
        /*jshint camelcase:false*/
        authorAvatar: this.model.get('author').avatar_url,
        commentCount: commit.comment_count,
        sha: this.model.get('sha'),
        approved: approved
      };
    },
    render: function () {
      app.showIndicator(false);
      return this.template(this.serialize());
    }
  });

  return CommitListView;
});