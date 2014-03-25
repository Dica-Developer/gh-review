/*global define*/
define(['backbone', 'underscore', 'when', 'app', 'CommitCollection'], function (Backbone, _, when, app, CommitCollection) {
  'use strict';
  var tmpCommits = {};
  return Backbone.Model.extend({
    defaults: {},
    customFilter: {},
    hasNextPage: false,
    hasPreviousPage: false,
    hasFirstPage: false,
    commitCollection: new CommitCollection(),
    initialize: function () {
      //this can be removed if we start with a new filter model in localStorage
      if (this.get('owner')) {
        this.setOwner(this.get('owner'));
      }
      var since = this.get('since');
      if (since && _.isObject(since)) {
        if (since.amount > 0) {
          this.setSinceObject(since);
        } else {
          this.unset('since');
        }
      }

      var until = this.get('until');
      if (!_.isNull(until) && _.str.isBlank(until)) {
        this.unset('until');
      }

      var path = this.get('path');
      if (!_.isNull(path) && _.str.isBlank(path)) {
        this.unset('path');
      }
    },
    setOwner: function (owner) {
      this.set('user', owner);
    },
    setRepo: function (repo) {
      this.set('repo', repo);
    },
    setAuthor: function (author) {
      this.set('author', author);
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
    unsetSince: function () {
      this.unset('since');
    },
    setSinceObject: function (sinceObject) {
      var since = _.moment().subtract(sinceObject.pattern, sinceObject.amount).toISOString();
      this.set('since', since);
    },
    setUntil: function (until) {
      this.set('until', until);
    },
    unsetUntil: function () {
      this.unset('until');
    },
    setPath: function (path) {
      this.set('path', path);
    },
    unsetPath: function () {
      this.unset('path');
    },
    setState: function (state) {
      /**
       * @type {String} possible states approved|reviewed|clean
       */
      this.customFilter.state = state;
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
    getCollection: function () {
      return this.commitCollection;
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
//      this.setHeader('If-Modified-Since', commits.meta['last-modified']);
      if (!error) {
        commits = this.extractMeta(commits);
        if (_.size(this.customFilter) > 0) {
          this.processCustomFilter(commits);
        } else {
          this.commitCollection.reset(commits);
          this.getCommitsRefer.resolve(this.commitCollection);
        }
      }
    },
    extractMeta: function (commits) {
      tmpCommits = _.extend({}, commits);
      this.hasNextPage = app.github.hasNextPage(commits);
      this.hasPreviousPage = app.github.hasPreviousPage(commits);
      this.hasFirstPage = app.github.hasFirstPage(commits);
      delete commits.meta;
      return commits;
    },
    processCustomFilter: function (commits) {
      var tmpCommits = [];
      var state = this.customFilter.state;
      if (!_.isUndefined(state)) {
        _.each(commits, function (commit) {
          switch (state) {
          case 'approved':
            if(app.commitApproved[commit.sha]){
              tmpCommits.push(commit);
            }
            break;
          case 'reviewed':
            /*jshint camelcase:false*/
            if(!app.commitApproved[commit.sha] && commit.commit.comment_count > 0){
              tmpCommits.push(commit);
            }
            break;
          case 'unseen':
            /*jshint camelcase:false*/
            if(commit.commit.comment_count === 0){
              tmpCommits.push(commit);
            }
            break;
          }
        });
      }
      this.commitCollection.reset(tmpCommits);
      this.getCommitsRefer.resolve(this.commitCollection);
    }
  });
});
