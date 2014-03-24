/*global define*/
define(['backbone', 'underscore', 'when', 'app', 'CommitCollection'], function (Backbone, _, when, app, CommitCollection) {
  'use strict';

  return Backbone.Model.extend({
    defaults: {},
    customFilter: {},
    query: '',
    hasNextPage: false,
    hasPreviousPage: false,
    hasFirstPage: false,
    commitCollection: new CommitCollection(),
    initialize: function () {
      //this can be removed if we start with a new filter model in localStorage
      if (this.get('owner')) {
        this.setOwner(this.get('owner'));
      }
    },
    setOwner: function (owner) {
      this.set('user', owner);
    },
    setRepo: function (repo) {
      this.set('repo', repo);
    },
    setContributor: function (contributor) {
      this.set('contributor', contributor);
    },
    setBranch: function (branch) {
      this.set('branch', branch);
    },
    setSince: function (since) {
      this.set('since', since);
    },
    setSinceObject: function (sinceObject) {
      var since = _.moment().subtract(sinceObject.pattern, sinceObject.amount).toIsoString();
      this.set('since', since);
    },
    setUntil: function (until) {
      this.set('until', until);
    },
    setPath: function (path) {
      this.set('path', path);
    },
    setState: function (state) {
      /**
       * @type {String} possible states approved|reviewed|clean
       */
      this.customFilter.state = state;
    },
    setQuery: function (query) {
      this.query = query;
    },
    getCommits: function () {
      this.getCommitsRefer = when.defer();
      app.github.repos.getCommits(this.toJSON(), this.getCommitsCallback.bind(this));
      return this.getCommitsRefer.promise;
    },
    getCommitsCallback: function (error, commits) {
      if (!error) {
        commits = this.extractMeta(commits);
        this.commitCollection.reset(commits);
        this.getCommitsRefer.resolve(this.commitCollection);
      }
    },
    extractMeta: function (commits) {
      this.hasNextPage = app.github.hasNextPage(commits);
      this.hasPreviousPage = app.github.hasPreviousPage(commits);
      this.hasFirstPage = app.github.hasFirstPage(commits);
      delete commits.meta;
      return commits;
    }
  });
});
