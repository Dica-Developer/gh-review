/*global define*/
define(['backbone', 'underscore', 'when', 'app', 'CommitCollection', 'underscore.string'], function (Backbone, _, when, app, CommitCollection) {
  'use strict';
  var tmpCommits = {};
  return Backbone.Model.extend({
    defaults: {
      customFilter: {}
    },
    hasNextPage: false,
    hasPreviousPage: false,
    hasFirstPage: false,
    commitCollection: null,
    tmpCommits: [],
    initialize: function () {
      this.commitCollection = new CommitCollection();
    },
    setOwner: function (owner) {
      this.set('user', owner);
    },
    getOwner: function () {
      return this.get('user');
    },
    setRepo: function (repo) {
      this.set('repo', repo);
    },
    getRepo: function(){
      return this.get('repo');
    },
    setAuthor: function (author) {
      this.set('author', author);
    },
    setContributor: function (contributor) {
      this.set('contributor', contributor);
    },
    setBranch: function (branch) {
      this.set('sha', branch);
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
      var customFilter = this.get('customFilter');
      customFilter.state = state;
      this.set('customFilter', customFilter);
    },
//    setSHA: function (sha) {
//      this.set('sha', sha);
//    },
    getCommentsUrl: function(){
      var repo = this.getRepo();
      var owner = this.getOwner();
      var url = 'https://api.github.com/repos/';
      if(owner && !_.str.isBlank(owner)){
        url += owner + '/';
      }
      url += repo + '/comments';
      return url;
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
    getAllCommits: function (link) {
      var callback = function (error, resp) {
        if (!error) {
          var link = resp.meta.link;
          var hasNext = app.github.hasNextPage(link);
          delete resp.meta;
          this.tmpCommits = this.tmpCommits.concat(resp);
          if (hasNext) {
            this.getAllCommits(link);
          } else {
            this.getCommitsCallback(error, this.tmpCommits);
          }
        }
      }.bind(this);

      if (!link) {
        this.tmpCommits = [];
        this.getCommitsRefer = when.defer();
        app.github.repos.getCommits(this.toJSON(), callback);
      } else {
        app.github.getNextPage(link, callback);
      }
      return this.getCommitsRefer.promise;
    },
    getCollection: function () {
      return this.commitCollection;
    },
//    setHeader: function (header, value) {
//      var headers = this.get('headers');
//      if (!headers) {
//        headers = {};
//      }
//      headers[header] = value;
//      this.set('headers', headers);
//    },
    getCommitsCallback: function (error, commits) {
//      this.setHeader('If-Modified-Since', commits.meta['last-modified']);
      if (!error) {
        if (!_.isUndefined(commits.meta)) {
          commits = this.extractMeta(commits);
        }
        //indicates that this is a getAll request in that case we dont need to if there is a pagination option
        if (!_.isUndefined(this.tmpCommits)) {
          delete this.tmpCommits;
        }
        if (_.size(this.get('customFilter')) > 0) {
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
    getAllComments: function(link){
      link = link || null;
      var callback = function (error, resp) {
        if (!error) {
          var link = resp.meta.link;
          var hasNext = app.github.hasNextPage(link);
          delete resp.meta;
          _.each(resp, function(value){
            app.sortOutApproveComments(value);
          });
          if (hasNext) {
            this.getAllComments(link);
          } else {
            this.getCommentsRefer.resolve();
          }
        }
      }.bind(this);

      if (!link) {
        this.getCommentsRefer = when.defer();
        app.github.repos.getAllCommitComments(this.toJSON(), callback);
      } else {
        app.github.getNextPage(link, callback);
      }
      return this.getCommentsRefer.promise;
    },
    processCustomFilter: function (commits) {
      var tmpCommits = [];
      var customFilter = this.get('customFilter');
      var state = customFilter.state;
      if (!_.isUndefined(state)) {
        _.each(commits, function (commit) {
          switch (state) {
          case 'approved':
            if (app.commitApproved[commit.sha]) {
              tmpCommits.push(commit);
            }
            break;
          case 'reviewed':
            /*jshint camelcase:false*/
            if (!app.commitApproved[commit.sha] && commit.commit.comment_count > 0) {
              tmpCommits.push(commit);
            }
            break;
          case 'unseen':
            /*jshint camelcase:false*/
            if (commit.commit.comment_count === 0) {
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
