/*global define*/
define([
  'backbone',
  'app',
  'underscore',
  'when',
  'CommitCollection',
  'commitListItemView',
  'text!templates/commit-list.html'
], function (Backbone, app, _, when, CommitCollection, CommitListItemView, template) {
  'use strict';

  return Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    commitCollection: new CommitCollection(),
    getCommitsRefer: null,
    featureMergeEnd: null,
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
        this.commitCollection.reset(commits);
        this.getCommitsRefer.resolve();
      }
    },
    displayCommits: function (commits) {
      this.storeMetaToModel(commits);
      this.commitCollection.reset(commits);
      this.render();
      this.renderAllCommits();
    },
    getPreviousPage: function () {
      var _this = this;
      app.github.getPreviousPage(this.model.get('currentLink'), function (error, commits) {
        if (!error) {
          _this.displayCommits(commits);
        }
      });
    },
    getNextPage: function () {
      var _this = this;
      app.github.getNextPage(this.model.get('currentLink'), function (error, commits) {
        if (!error) {
          _this.displayCommits(commits);
        }
      });
    },
    getFirstPage: function () {
      var _this = this;
      app.github.getFirstPage(this.model.get('currentLink'), function (error, commits) {
        if (!error) {
          _this.displayCommits(commits);
        }
      });
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
      this.commitCollection.each(function (commit) {
        this.markAsFeatureMerge(commit);
        if (this.isNotAMergeCommit(commit)) {
          this.renderOneCommit(commit);
        }
      }, this);
      app.showIndicator(false);
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
    }
  });
});