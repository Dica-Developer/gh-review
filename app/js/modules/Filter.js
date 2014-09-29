/*global define*/
define(['angular', 'lodash', 'moment'], function (angular, _, moment) {
  'use strict';

  var generateUUID = function () {
    var d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
  };

  var tmpCommits = {};

  var services = angular.module('GHReview.Filter', []);
  services.factory('Filter', ['$q', 'github', 'commentCollector', 'localStorageService',
    function ($q, github, commentCollector, localStorageService) {
      var Filter = function (filterId) {
        this.options = {
          repo: null,
          user: null,
          sha: 'master',
          since: {},
          until: {},
          path: null,
          authors: [],
          contributor: null,
          meta: {
            isSaved: false,
            lastEdited: null,
            customFilter: {},
            id: filterId || null
          }
        };
        this.init();
      };

      Filter.prototype.hasNextPage = false;
      Filter.prototype.hasPreviousPage = false;
      Filter.prototype.hasFirstPage = false;
      Filter.prototype.tmpCommits = [];

      Filter.prototype.init = function () {
        if (!_.isNull(this.options.meta.id)) {
          _.extend(this.options, localStorageService.get('filter-' + this.options.meta.id), true);
        } else {
          this.options.meta.id = generateUUID();
        }
      };

      Filter.prototype.save = function () {
        this.options.meta.isSaved = true;
        var filterIdsString = localStorageService.get('filter');
        var filterIds = [];
        if (!_.isNull(filterIdsString)) {
          filterIds = filterIdsString.split(',');
        }
        if (!_.contains(filterIds, this.options.meta.id)) {
          filterIds.push(this.options.meta.id);
          localStorageService.set('filter', filterIds.join(','));
        }
        localStorageService.set('filter-' + this.options.meta.id, JSON.stringify(this.options));
      };

      Filter.prototype.set = function (key, value) {
        if (_.isUndefined(this.options[key])) {
          throw new Error('Unknown filter property');
        } else {
          this.options[key] = value;
          this.options.meta.lastEdited = new Date().getTime();
          this.options.meta.isSaved = false;
        }
      };

      Filter.prototype.setCustomFilter = function (key, value) {
        this.options.meta.customFilter[key] = value;
        this.options.meta.lastEdited = new Date().getTime();
        this.options.meta.isSaved = false;
      };

      Filter.prototype.getId = function () {
        return this.options.meta.id;
      };

      Filter.prototype.setOwner = function (owner) {
        this.set('user', owner);
      };

      Filter.prototype.getOwner = function () {
        return this.options.user;
      };

      Filter.prototype.setRepo = function (repo) {
        this.set('repo', repo);
      };

      Filter.prototype.getRepo = function () {
        return this.options.repo;
      };

      Filter.prototype.hasAuthor = function (author) {
        return _.contains(this.options.authors, author);
      };

      Filter.prototype.addAuthor = function (author) {
        if(_.isArray(author)){
          this.options.authors = author;
        } else {
          this.options.authors.push(author);
        }
      };

      Filter.prototype.removeAuthor = function (author) {
        this.options.authors.pop(author);
      };

      Filter.prototype.getAuthors = function () {
        return this.options.authors;
      };

      Filter.prototype.setContributor = function (contributor) {
        this.options.contributor = contributor;
      };

      Filter.prototype.setBranch = function (branch) {
        this.set('sha', branch);
      };

      Filter.prototype.getBranch = function () {
        return this.options.sha;
      };

      Filter.prototype.setSince = function (since) {
        if (_.isObject(since)) {
          this.set('since', since);
        } else {
          throw new Error('Since should be an object but was ' + typeof since);
        }
      };

      Filter.prototype.getSince = function () {
        return this.options.since;
      };

      Filter.prototype.getSinceDate = function () {
        var sinceDate = null;
        if (!_.isUndefined(this.options.since) && _.size(this.options.since) === 2) {
          sinceDate = moment().startOf('minute').subtract(this.options.since.pattern, this.options.since.amount).toISOString();
        }
        return sinceDate;
      };

      Filter.prototype.getSinceDateISO = function () {
        var sinceDate = null;
        if (!_.isUndefined(this.options.since) && _.size(this.options.since) === 2) {
          sinceDate = moment().subtract(this.options.since.pattern, this.options.since.amount).toISOString();
        }
        return sinceDate;
      };

      Filter.prototype.unsetSince = function () {
        this.set('since', {});
      };

      Filter.prototype.setUntil = function (until) {
        this.set('until', until);
      };

      Filter.prototype.unsetUntil = function () {
        this.set('until', {});
      };

      Filter.prototype.setPath = function (path) {
        this.set('path', path);
      };

      Filter.prototype.unsetPath = function () {
        this.set('path', null);
      };

      Filter.prototype.setState = function (state) {
        this.setCustomFilter('state', state);
      };

      Filter.prototype.getState = function () {
        return this.options.meta.customFilter.state;
      };

      Filter.prototype._needsPostFiltering = function () {
        return (_.size(this.options.meta.customFilter) > 0);
      };

      Filter.prototype.getNextPage = function () {
        if (this._needsPostFiltering()) {
          return this.getCommits(this.firstResult + this.maxResults, this.maxResults);
        } else {
          this.getCommitsRefer = $q.defer();
          github.getNextPage(tmpCommits, this._getCommitsCallback.bind(this));
          return this.getCommitsRefer.promise;
        }
      };

      Filter.prototype.getFirstPage = function () {
        if (this._needsPostFiltering()) {
          return this.getCommits(0, this.maxResults);
        } else {
          this.getCommitsRefer = $q.defer();
          github.getFirstPage(tmpCommits, this._getCommitsCallback.bind(this));
          return this.getCommitsRefer.promise;
        }
      };

      Filter.prototype.getPreviousPage = function () {
        if (this._needsPostFiltering()) {
          return this.getCommits(Math.max(0, this.firstResult - this.maxResults), this.maxResults);
        } else {
          this.getCommitsRefer = $q.defer();
          github.getPreviousPage(tmpCommits, this._getCommitsCallback.bind(this));
          return this.getCommitsRefer.promise;
        }
      };

      Filter.prototype.getCommentsUrl = function () {
        var repo = this.getRepo();
        var owner = this.getOwner();
        var url = 'https://api.github.com/repos/';
        if (owner && !_.str.isBlank(owner)) {
          url += owner + '/';
        }
        url += repo + '/comments';
        return url;
      };

      Filter.prototype._getCommitsDirect = function () {
        this.getCommitsRefer = $q.defer();
        var githubApiCallOptions = this.prepareGithubApiCallOptions();
        github.repos.getCommits(githubApiCallOptions, this._getCommitsCallback.bind(this));
        return this.getCommitsRefer.promise;
      };

      Filter.prototype.prepareGithubApiCallOptions = function () {
        var preparedGithubOptions = {};
        _.each(this.options, function (value, key) {
          if ('authors' === key) {
            if (value.length === 1) {
              preparedGithubOptions.author = value[0];
            } else if (value.length > 1) {
              this.options.meta.customFilter.authors = value;
            }
          } else if (key === 'since' && value !== null) {
            preparedGithubOptions.since = this.getSinceDateISO();
          } else if (key === 'until' && value !== null) {
            //TODO set correct until value
          } else if ('meta' !== key && value !== null) {
            preparedGithubOptions[key] = value;
          }
        }, this);
        return preparedGithubOptions;
      };

      Filter.prototype._getCommitsPostFiltered = function (link) {
        var githubMsg = this.prepareGithubApiCallOptions();
        var callback = function (error, resp) {
          if (!error) {
            var link = resp.meta.link;
            var hasNext = github.hasNextPage(link);
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
          this.getCommitsRefer = $q.defer();
          github.repos.getCommits(githubMsg, callback);
        } else {
          github.getNextPage(link, callback);
        }
        return this.getCommitsRefer.promise;
      };

      Filter.prototype.getCommits = function (firstResult, maxResults) {
        this.firstResult = firstResult || 0;
        this.maxResults = maxResults || -1;
        if (this._needsPostFiltering() || this.maxResults === -1) {
          return this._getCommitsPostFiltered();
        } else {
          return this._getCommitsDirect();
        }
      };

      Filter.prototype.getAllCommitsFromBranch = function () {
        var githubMsg = this.prepareGithubApiCallOptions();
        delete githubMsg.customFilter;
        if (githubMsg.author) {
          delete githubMsg.author;
        }
        return this.getCommits(null, githubMsg);
      };

      Filter.prototype._getCommitsCallback = function (error, commits) {
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
            this.getCommitsRefer.resolve(commits);
          }
        }
      };

      Filter.prototype._extractMetaPostFilter = function (commits) {
        tmpCommits = _.extend({}, commits);
        if (this.maxResults > -1) {
          this.hasNextPage = (this.maxResults + this.firstResult) < commits.length;
        } else {
          this.hasNextPage = false;
        }
        this.hasPreviousPage = this.firstResult > 0;
        this.hasFirstPage = true;
        if (!_.isUndefined(commits.meta)) {
          delete commits.meta;
        }
      };

      Filter.prototype._extractMeta = function (commits) {
        tmpCommits = _.extend({}, commits);
        this.hasNextPage = github.hasNextPage(commits);
        this.hasPreviousPage = github.hasPreviousPage(commits);
        this.hasFirstPage = github.hasFirstPage(commits);
        delete commits.meta;
        return commits;
      };

      Filter.prototype._processCustomFilter = function (commits) {
        var tmpCommits = [];
        var customFilter = this.options.meta.customFilter;
        var state = customFilter.state;
        var authors = customFilter.authors;
        commentCollector.getCommitApproved()
          .then(function (commitApproved) {
            _.each(commits, function (commit) {
              var selectCommit = true;
              if (!_.isUndefined(authors)) {
                if (!_.contains(authors, commit.author.login)) {
                  selectCommit = false;
                }
              }
              if (!_.isUndefined(state)) {
                switch (state) {
                case 'approved':
                  if (!commitApproved[commit.sha]) {
                    selectCommit = false;
                  }
                  break;
                case 'reviewed':
                  /*jshint camelcase:false*/
                  if (!(!commitApproved[commit.sha] && commit.commit.comment_count > 0)) {
                    selectCommit = false;
                  }
                  break;
                case 'unseen':
                  /*jshint camelcase:false*/
                  if (commit.commit.comment_count !== 0) {
                    selectCommit = false;
                  }
                  break;
                }
              }
              if (selectCommit) {
                tmpCommits.push(commit);
              }
            });
            if (this.maxResults > -1) {
              this.getCommitsRefer.resolve(_.first(_.rest(tmpCommits, this.firstResult), this.maxResults));
            } else {
              this.getCommitsRefer.resolve(_.rest(tmpCommits, this.firstResult));
            }
          }.bind(this));
      };

      return Filter;
    }
  ]);
});
