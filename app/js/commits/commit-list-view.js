/*global define*/
define([
  'backbone',
  'app',
  'underscore',
  'when',
  'CommitCollection',
  'commitListItemView',
  'text!templates/commit-list.html'
], function (Backbone, app, _, when, CommitListItemView, template) {
  'use strict';

  return Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    getCommitsRefer: null,
    featureMergeEnd: null,
    events: {
      'click .previous': 'getPreviousPage',
      'click .next': 'getNextPage',
      'click .first': 'getFirstPage'
    },
    initialize: function () {},
    getPreviousPage: function () {
      this.model.getPreviousPage()
      .then(this.renderAllCommits.bind(this));
    },
    getNextPage: function () {
      this.model.getNextPage()
        .then(this.renderAllCommits.bind(this));
    },
    getFirstPage: function () {
      this.model.getFirstPage()
        .then(this.renderAllCommits.bind(this));
    },
    renderOneCommit: function (commit) {
      var view = new CommitListItemView({
        model: commit
      });
      view.filter = this.model;
      this.$('#commitList').append(view.render());
    },
    markAsFeatureMerge: function (commit) {
      if (commit.get('parents').length > 1) {
        this.featureMergeEnd = commit.get('parents')[0].sha;
      } else {
        if (commit.id === this.featureMergeEnd) {
          this.featureMergeEnd = null;
        }
      }
      if (!_.isNull(this.featureMergeEnd)) {
        commit.set('featureCommit', true);
      } else {
        commit.set('featureCommit', false);
      }
    },
    isNotAMergeCommit: function (commit) {
      return (1 === commit.get('parents').length);
    },
    renderAllCommits: function(commits){
      this.render();
      commits.each(function (commit) {
        this.markAsFeatureMerge(commit);
        if (this.isNotAMergeCommit(commit)) {
          this.renderOneCommit(commit);
        }
      }, this);
    },
    getAllCommits: function () {
      this.model.getCommits()
        .then(this.renderAllCommits.bind(this));
    },
    serialize: function(){
      return {
        model: this.model.toJSON(),
        hasFirstPage: this.model.hasFirstPage,
        hasPreviousPage: this.model.hasPreviousPage,
        hasNextPage: this.model.hasNextPage
      };
    },
    render: function () {
      this.$el.html(this.template(this.serialize()));
    }
  });
});