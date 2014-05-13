/*global define*/
define(['backbone', 'underscore', 'when', 'app', 'CommitCollection', 'underscore.string'], function (Backbone, _, when, app, CommitCollection) {
  'use strict';
  var tmpCommits = {};
  return Backbone.Model.extend(
    /**
     * @lends FilterModel.prototype
     */
    {
      /**
       * @class FilterModel
       * @augments Backbone.Model
       * @contructs FilterModel object
       */
      initialize: function () {
        this.commitCollection = new CommitCollection();
      },
      defaults: function () {
        this.setBranch('master');
        this.set('customFilter', {});
      },
      hasNextPage: false,
      hasPreviousPage: false,
      hasFirstPage: false,
      commitCollection: null,
      tmpCommits: [],
      /**
       * Sets the owner of a repo to fetch
       * @param {String} owner
       */
      setOwner: function (owner) {
        this.set('user', owner);
      },
      /**
       * Returns the current owner set in filter
       * @returns {String}
       */
      getOwner: function () {
        return this.get('user');
      },
      /**
       * Repo to get commits from
       * @param {String} repo
       */
      setRepo: function (repo) {
        this.set('repo', repo);
      },
      /**
       * Returns current repo set in filter
       * @returns {String}
       */
      getRepo: function () {
        return this.get('repo');
      },
      /**
       * GitHub login or email address by which to filter by commit author.
       * @param {String} author
       */
      setAuthor: function (author) {
        this.set('author', author);
      },
      /**
       * Sets the contributor to the filter
       * @param {String} contributor
       */
      setContributor: function (contributor) {
        this.set('contributor', contributor);
      },
      /**
       * SHA or branch to start listing commits from.
       * @param {String} branch
       */
      setBranch: function (branch) {
        this.set('sha', branch);
      },
      /**
       *
       * @returns {String}
       */
      getBranch: function () {
        return this.get('sha');
      },
      /**
       * Only commits after this date will be returned. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.
       * @param {String} since format YYYY-MM-DDTHH:MM:SSZ
       */
      setSince: function (since) {
        this.set('since', since);
      },
      /**
       * Deletes the since filter
       */
      unsetSince: function () {
        this.unset('since');
      },
      /**
       * Converts a since object to a proper time string
       * @param {Object} sinceObject
       * @param {String} sinceObject.pattern the patter to compute the date possible values
       * are days|weeks|years
       * @param {Number} sinceObject.amount the amount to compute the date
       */
      setSinceObject: function (sinceObject) {
        var since = _.moment().subtract(sinceObject.pattern, sinceObject.amount).toISOString();
        this.set('since', since);
      },
      /**
       * Only commits before this date will be returned. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.
       * @param {String} until
       */
      setUntil: function (until) {
        this.set('until', until);
      },
      /**
       * Deletes the until filter
       */
      unsetUntil: function () {
        this.unset('until');
      },
      /**
       * Only commits containing this file path will be returned.
       * @param path
       */
      setPath: function (path) {
        this.set('path', path);
      },
      /**
       * Deletes the path filter
       */
      unsetPath: function () {
        this.unset('path');
      },
      /**
       * Sets the review state as custom filter possible values are approved|reviewed|unseen
       * @param {String} state
       */
      setState: function (state) {
        var customFilter = this.get('customFilter');
        customFilter.state = state;
        this.set('customFilter', customFilter);
      },
      _needsPostFiltering: function() {
        return (_.size(this.get('customFilter')) > 0);
      },
      /**
       * Fetches the next page of commit list
       * @returns {promise}
       */
      getNextPage: function () {
        return this.getCommits(this.firstResult + this.maxResults, this.maxResults);
      },
      /**
       * Fetches the first page of commit list
       * @returns {promise}
       */
      getFirstPage: function () {
        return this.getCommits(0, this.maxResults);
      },
      getPreviousPage: function () {
        return this.getCommits(Math.max(0, this.firstResult - this.maxResults), this.maxResults);
      },
      /**
       * Return the github url to get the comment of the current filtered commits
       * @returns {String}
       */
      getCommentsUrl: function () {
        var repo = this.getRepo();
        var owner = this.getOwner();
        var url = 'https://api.github.com/repos/';
        if (owner && !_.str.isBlank(owner)) {
          url += owner + '/';
        }
        url += repo + '/comments';
        return url;
      },
      /**
       * Get the first results of the filtered commits.
       * Do the result list is bigger then one page use {@link FilterModel#getNextPage} or {@link FilterModel#getFirstPage}
       * to navigate through results
       * @returns {promise}
       */
      _getCommitsDirect: function () {
        this.getCommitsRefer = when.defer();
        app.github.repos.getCommits(this.toJSON(), this._getCommitsCallback.bind(this));
        return this.getCommitsRefer.promise;
      },
      /**
       * Fetches all filter results by going through all available pages at ones.
       * @param {null | String} link
       * @param {Object} githubMsg
       * @returns {promise}
       */
      _getCommitsPostFiltered: function (link, githubMsg) {
        githubMsg = githubMsg || this.toJSON();
        var callback = function (error, resp) {
          if (!error) {
            var link = resp.meta.link;
            var hasNext = app.github.hasNextPage(link);
            delete resp.meta;
            this.tmpCommits = this.tmpCommits.concat(resp);
            if (hasNext) {
              this._getCommitsPostFiltered(link);
            } else {
              this._getCommitsCallback(error, this.tmpCommits);
            }
          }
        }.bind(this);

        if (!link) {
          this.tmpCommits = [];
          this.getCommitsRefer = when.defer();
          app.github.repos.getCommits(githubMsg, callback);
        } else {
          app.github.getNextPage(link, callback);
        }
        return this.getCommitsRefer.promise;
      },
      getCommits: function (firstResult, maxResults) {
        this.firstResult = firstResult || 0;
        this.maxResults = maxResults || 30;
        if (this._needsPostFiltering()) {
          return this._getCommitsPostFiltered();
        } else {
          return this._getCommitsDirect();
        }
      },
      getAllCommitsFromBranch: function () {
        var githubMsg = this.toJSON();
        delete githubMsg.customFilter;
        if (githubMsg.author) {
          delete githubMsg.author;
        }
        return this.getAllCommits(null, githubMsg);
      },
      /**
       * Returns the commits as collection.
       * @returns {CommitCollection}
       */
      getCollection: function () {
        return this.commitCollection;
      },
      /**
       * @private
       * @param {Error} error
       * @param {Object} commits
       */
      _getCommitsCallback: function (error, commits) {
        if (!error) {
          //indicates that this is a getAll request in that case we dont need to if there is a pagination option
          if (!_.isUndefined(this.tmpCommits)) {
            delete this.tmpCommits;
          }
          if (this._needsPostFiltering()) {
            this._extractMetaPostFilter(commits);
            this._processCustomFilter(commits);
          } else {
            if (!_.isUndefined(commits.meta)) {
              commits = this._extractMeta(commits);
            }
            this.commitCollection.reset(commits);
            this.getCommitsRefer.resolve(this.commitCollection);
          }
        }
      },
      _extractMetaPostFilter: function (commits) {
        tmpCommits = _.extend({}, commits);
        this.hasNextPage = (this.maxResults + this.firstResult) < commits.length;
        this.hasPreviousPage = this.firstResult > 0;
        this.hasFirstPage = true;
        if (!_.isUndefined(commits.meta)) {
          delete commits.meta;
        }
      },
      /**
       * @private
       * @param {Object} commits
       * @returns {Object}
       */
      _extractMeta: function (commits) {
        tmpCommits = _.extend({}, commits);
        this.hasNextPage = app.github.hasNextPage(commits);
        this.hasPreviousPage = app.github.hasPreviousPage(commits);
        this.hasFirstPage = app.github.hasFirstPage(commits);
        delete commits.meta;
        return commits;
      },
      /**
       * Fetches all comments of the filterd commits by going through all available pages at ones.
       * @param {null|String} link
       * @returns {When.Deferred.Promise}
       */
      getAllComments: function (link) {
        link = link || null;
        var callback = function (error, resp) {
          if (!error) {
            var link = resp.meta.link;
            var hasNext = app.github.hasNextPage(link);
            delete resp.meta;
            _.each(resp, function (value) {
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
      /**
       * @private
       * @param {Object} commits
       */
      _processCustomFilter: function (commits) {
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
        this.commitCollection.reset(_.first(_.rest(tmpCommits, this.firstResult), this.maxResults));
        this.getCommitsRefer.resolve(this.commitCollection);
      }
    });
});
