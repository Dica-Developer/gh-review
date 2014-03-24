/*global define*/
define(['backbone', 'underscore', 'when', 'app', 'CommitCollection'], function (Backbone, _, when, app, CommitCollection) {
  'use strict';
  var tmpCommits = {};
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
    setSHA: function (sha) {
      this.set('sha', sha);
    },
    getNextPage: function () {
      this.getCommitsRefer = when.defer();
      app.github.getNextPage(tmpCommits, this.getCommitsCallback.bind(this));
      return this.getCommitsRefer.promise;
    },
    getFirstPage: function () {
      this.getCommitsRefer = when.defer();
      app.github.getFirstPage(tmpCommits, this.getCommitsCallback.bind(this));
      return this.getCommitsRefer.promise;
    },
    getCommits: function () {
      this.getCommitsRefer = when.defer();
      app.github.repos.getCommits(this.toJSON(), this.getCommitsCallback.bind(this));
      return this.getCommitsRefer.promise;
    },
    setHeader: function (header, value) {
      var headers = this.get('headers');
      if (!headers) {
        headers = {};
      }
      headers[header] = value;
      this.set('headers', headers);
    },
    getCommitsCallback: function (error, commits) {
      /*jshint camelcase:false*/
      this.setHeader('If-Modified-Since', commits.meta['last-modified']);
      if (!error) {
        commits = this.extractMeta(commits);
        this.commitCollection.reset(commits);
        this.getCommitsRefer.resolve(this.commitCollection);
      }
    },
    extractMeta: function (commits) {
      tmpCommits = _.extend({}, commits);
      this.hasNextPage = app.github.hasNextPage(commits);
      this.hasPreviousPage = app.github.hasPreviousPage(commits);
      this.hasFirstPage = app.github.hasFirstPage(commits);
      delete commits.meta;
      return commits;
    }
  });
});
