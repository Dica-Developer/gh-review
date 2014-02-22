/*global define*/
define([
  'backbone',
  'app',
  'underscore',
  'when',
  'commitCollection',
  'commitListItemView',
  'text!templates/review-detail.html'
], function (Backbone, app, _, when, commitCollection, CommitListItemView, template) {
  'use strict';
  var ReviewDetailView = Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    getCommitsRefer: null,
    events: {
      'click .previous': 'getPreviousPage',
      'click .next': 'getNextPage',
      'click .first': 'getFirstPage'
    },
    initialize: function () {
      var attributes = this.model.toJSON();
      app.currentReviewData = {};
      if (!_.isEmpty(attributes.owner)) {
        app.currentReviewData.user = attributes.owner;
      }
      if (!_.isEmpty(attributes.repo)) {
        app.currentReviewData.repo = attributes.repo;
      }
      if (!_.isEmpty(attributes.branch)) {
        app.currentReviewData.sha = attributes.branch;
      }
      if (!_.isEmpty(attributes.contributor)) {
        app.currentReviewData.author = attributes.contributor;
      }
      if (!_.isEmpty(attributes.since.pattern)) {
        app.currentReviewData.since = _.moment().subtract(attributes.since.pattern, attributes.since.amount).toISOString();
      }
      if (!_.isEmpty(attributes.until)) {
        app.currentReviewData.until = attributes.until;
      }
      if (!_.isEmpty(attributes.path)) {
        app.currentReviewData.path = attributes.path;
      }
    },
    storeMetaToModel: function (commits) {
      this.model.set('hasNext', app.github.hasNextPage(commits.meta.link));
      this.model.set('hasPrevious', app.github.hasPreviousPage(commits.meta.link));
      this.model.set('hasFirst', app.github.hasFirstPage(commits.meta.link));
      this.model.set('currentLink', commits.meta.link);
    },
    getCommits: function () {
      this.getCommitsRefer = when.defer();
      app.github.repos.getCommits(app.currentReviewData, this.getCommitsCallback.bind(this));
      return this.getCommitsRefer.promise;
    },
    getCommitsCallback: function (error, commits) {
      if (!error) {
        this.storeMetaToModel(commits);
        commitCollection.reset(commits);
        this.getCommitsRefer.resolve();
      }
    },
    getPreviousPage: function () {
      var _this = this;
      app.github.getPreviousPage(this.model.get('currentLink'), function (error, commits) {
        if (!error) {
          _this.storeMetaToModel(commits);
          commitCollection.reset(commits);
          _this.render();
          _this.renderAllCommits();
        }
      });
    },
    getNextPage: function () {
      var _this = this;
      app.github.getNextPage(this.model.get('currentLink'), function (error, commits) {
        if (!error) {
          _this.storeMetaToModel(commits);
          commitCollection.reset(commits);
          _this.render();
          _this.renderAllCommits();
        }
      });
    },
    getFirstPage: function () {
      var _this = this;
      app.github.getFirstPage(this.model.get('currentLink'), function (error, commits) {
        if (!error) {
          _this.storeMetaToModel(commits);
          commitCollection.reset(commits);
          _this.render();
          _this.renderAllCommits();
        }
      });
    },
    renderOneCommit: function (commit) {
      var view = new CommitListItemView({
        model: commit
      });
      this.$('#commitList').append(view.render());
    },
    renderAllCommits: function () {
      commitCollection.each(function (commit) {
        this.renderOneCommit(commit);
      }, this);
      app.showIndicator(false);
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
    }
  });

  return ReviewDetailView;
});