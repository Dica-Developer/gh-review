/*global define*/
define([
  'backbone',
  'app',
  'underscore',
  'when',
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
      this.model.getPreviousPage();
      this.renderAllCommits();
//      var _this = this;
//      app.github.getPreviousPage(this.model.get('currentLink'), function (error, commits) {
//        if (!error) {
//          _this.displayCommits(commits);
//        }
//      });
    },
    getNextPage: function () {
      this.model.getNextPage();
      this.renderAllCommits();
//      var _this = this;
//      app.github.getNextPage(this.model.get('currentLink'), function (error, commits) {
//        if (!error) {
//          _this.displayCommits(commits);
//        }
//      });
    },
    getFirstPage: function () {
      this.model.getFirstPage();
      this.renderAllCommits();
//      app.github.getFirstPage(this.model.get('currentLink'), function (error, commits) {
//        if (!error) {
//          _this.displayCommits(commits);
//        }
//      });
    },
    renderOneCommit: function (commit) {
      var view = new CommitListItemView({
        model: commit
      });
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
    renderAllCommits: function () {
      var view = this;
      this.model.getCommits()
        .then(function(commits){
          try{
            console.log(view.model.toJSON());
            view.render();
          }catch(e){
            console.log(e);
          }
          commits.each(function (commit) {
            this.markAsFeatureMerge(commit);
            if (this.isNotAMergeCommit(commit)) {
              this.renderOneCommit(commit);
            }
          }, view);
        });
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