(function (angular) {
  'use strict';


  var services = angular.module('GHReview');
  services.factory('filterProvider', [
    '$q',
    '$location',
    '_',
    'moment',
    'github',
    'commentCollector',
    'localStorageService',
    'githubUserData',
    'branchCollector',
    'contributorCollector',
    'commitCollector',
    'treeCollector',
    function ($q, $location, _, moment, github, commentCollector, localStorageService, githubUserData, branchCollector, contributorCollector, commitCollector, treeCollector) {

      var filterHolder = {},
        generateUUID = function () {
          var d = new Date().getTime();
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
          });
        };


      function Filter(filterId) {
        this.options = {
          repo: null,
          user: null,
          sha: 'master',
          since: {},
          until: {},
          path: null,
          authors: [],
          meta: {
            isSaved: false,
            lastEdited: null,
            customFilter: {
              excludeOwnCommits: false
            },
            id: filterId || null
          }
        };
        this.init();
      }

      Filter.prototype.maxResults = 20;
      Filter.prototype.commitList = [];
      Filter.prototype.currentPage = 1;

      Filter.prototype.init = function () {
        if (!_.isNull(this.options.meta.id)) {
          _.extend(this.options, localStorageService.get('filter-' + this.options.meta.id), true);
          this.getContributorList();
          this.getBranchList();
          this.getTree();
        } else {
          this.options.meta.id = generateUUID();
          this.options.meta.isNew = true;
        }
      };

      Filter.prototype.save = function () {
        if (this.options.meta.isClone) {
          var originalfilter = filterHolder[this.options.meta.idOriginal];
          originalfilter.options = _.cloneDeep(this.options);
          originalfilter.options.meta.id = originalfilter.options.meta.idOriginal;
          delete originalfilter.options.meta.idOriginal;
          delete originalfilter.options.meta.isClone;
          originalfilter.save();
        } else {
          if (!_.isUndefined(this.options.meta.isNew)) {
            delete this.options.meta.isNew;
          }
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
        }
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
        if (_.isArray(author)) {
          this.options.authors = author;
        } else {
          this.options.authors.push(author);
        }
        this.options.meta.isSaved = false;
      };

      Filter.prototype.removeAuthor = function (author) {
        this.options.authors.pop(author);
        this.options.meta.isSaved = false;
      };

      Filter.prototype.getAuthors = function () {
        return this.options.authors;
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
          sinceDate = moment().subtract(this.options.since.pattern, this.options.since.amount).startOf('day').toISOString();
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

      Filter.prototype.getPath = function () {
        return this.options.path;
      };

      Filter.prototype.setState = function (state) {
        this.setCustomFilter('state', state);
      };

      Filter.prototype.getState = function () {
        return this.options.meta.customFilter.state;
      };

      Filter.prototype.setExcludeOwnCommits = function (state) {
        this.setCustomFilter('excludeOwnCommits', state);
      };

      Filter.prototype.getExcludeOwnCommits = function () {
        return this.options.meta.customFilter.excludeOwnCommits;
      };

      Filter.prototype.isSaved = function () {
        return this.options.meta.isSaved;
      };

      Filter.prototype.reset = function () {
        this.tree = [];
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
            id: null
          }
        };
        this.init();
      };

      Filter.prototype._needsPostFiltering = function () {
        return (_.size(this.options.meta.customFilter) > 0);
      };

      Filter.prototype.getContributorList = function () {
        return contributorCollector.get(this.getOwner(), this.getRepo());
      };

      Filter.prototype.getBranchList = function () {
        return branchCollector.get(this.getOwner(), this.getRepo());
      };

      Filter.prototype.getTree = function(){
        return treeCollector.get(this.getOwner(), this.getRepo(), this.getBranch());
      };

      Filter.prototype.getCurrentPage = function(){
        return this.currentPage;
      };

      Filter.prototype.setCurrentPage = function(page){
        this.currentPage = page;
        $location.search('page', this.currentPage);
      };

      Filter.prototype.getPage = function(){
        if($location.search().page && $location.search().page !== this.currentPage){
          this.setCurrentPage($location.search().page);
        }
        var start = (this.currentPage * this.maxResults) - this.maxResults;
        var end = start + this.maxResults;
        return this.commitList.slice(start, end);
      };

      Filter.prototype.getTotalCommitsLength = function(){
        return this.commitList.length;
      };

      Filter.prototype.getCommentsUrl = function () {
        var repo = this.getRepo();
        var owner = this.getOwner();
        var url = 'https://api.github.com/repos/';
        if (owner && !(/^\s*$/).test(owner)) {
          url += owner + '/';
        }
        url += repo + '/comments';
        url += '?per_page=100';
        return url;
      };

      Filter.prototype.prepareGithubApiCallOptions = function () {
        var preparedGithubOptions = {};
        _.each(this.options, function (value, key) {
          if ('authors' === key) {
            if (value.length === 1) {
              preparedGithubOptions.author = value[0];
            } else if (value.length > 1) {
              this.setCustomFilter('authors', value);
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

      Filter.prototype.getCommits = function (maxResults) {
        this.maxResults = maxResults || this.maxResults;
        var getCommitsRefer = $q.defer(),
          _this = this;
        commitCollector.get(this.prepareGithubApiCallOptions())
          .then(
          function (commitList) {
            _this._processCustomFilter(commitList)
              .then(function(){
                getCommitsRefer.resolve(_this.getPage());
              });
          },
          function (err) {
            getCommitsRefer.reject(err);
          },
          function (uncompleteCommitList) {
            _this._processCustomFilter(uncompleteCommitList)
              .then(function(){
                getCommitsRefer.notify(_this.getPage());
              });
          }
        );
        return getCommitsRefer.promise;
      };

      Filter.prototype._processCustomFilter = function (commits) {
        var defer = $q.defer();
        if (!this._needsPostFiltering()) {
          this.commitList = commits;
          defer.resolve();
        } else {
          var tmpCommits = [];
          var customFilter = this.options.meta.customFilter;
          var state = customFilter.state;
          var authors = customFilter.authors;
          var excludeOwnCommits = customFilter.excludeOwnCommits;
          githubUserData.get()
            .then(function(result){
              var userData = result;
              commentCollector.getCommitApproved()
                .then(function (commitApproved) {
                  _.each(commits, function (commit) {
                    var selectCommit = true,
                      author = commit.author ? commit.author.login : commit.commit.author.login;
                    if (!_.isUndefined(authors)) {
                      /*
                       TODO commit.author can be null how to find the login name of an author
                       example commit object without author:
                       {
                       author: null
                       comments_url: "https://api.github.com/repos/Datameer-Inc/dap/commits/67ccc56e848911d7f3ac0b56e5c3f821b35dbb1b/comments"
                       commit: {
                       author: {
                       date: "2014-09-26T07:00:52Z"
                       email: "author@email.com"
                       name: "Author Name"
                       }
                       comment_count: 0
                       committer: {
                       date: "2014-09-26T07:00:52Z"
                       email: "author@email.com"
                       name: "Author Name"
                       }
                       message: "added id's for workbook filter dialog plus/minus icons to ensure new ui-tests"
                       tree: {sha:0bf402614436f1f9bc7326b77b7815b3a6bcafe6,…}
                       url: "https://api.github.com/repos/Datameer-Inc/dap/git/commits/67ccc56e848911d7f3ac0b56e5c3f821b35dbb1b"
                       }
                       committer: null
                       html_url: "https://github.com/Datameer-Inc/dap/commit/67ccc56e848911d7f3ac0b56e5c3f821b35dbb1b"
                       parents: [{sha:960d78b69fab212d608d78ad86364162460f5654,…}]
                       sha: "67ccc56e848911d7f3ac0b56e5c3f821b35dbb1b"
                       url: "https://api.github.com/repos/Datameer-Inc/dap/commits/67ccc56e848911d7f3ac0b56e5c3f821b35dbb1b"
                       }
                       */
                      if (!_.contains(authors, author)) {
                        selectCommit = false;
                      }
                    }

                    if(excludeOwnCommits && author === userData.login){
                      selectCommit = false;
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
                  this.commitList = tmpCommits;
                  defer.resolve();
                }.bind(this));
            }.bind(this));
        }
        return defer.promise;
      };

      return {
        get: function (id) {
          if (!filterHolder[id]) {
            filterHolder[id] = new Filter(id);
          }
          return filterHolder[id];
        },
        getNew: function () {
          var newFilter = new Filter();
          filterHolder[newFilter.getId()] = newFilter;
          return newFilter;
        },
        getCloneOf: function(filter){
          if(filter instanceof Filter){
            var clonedFilter = new Filter();
            clonedFilter.options = _.cloneDeep(filter.options);
            clonedFilter.options.meta.idOriginal = clonedFilter.options.meta.id;
            clonedFilter.options.meta.id = clonedFilter.options.meta.id + '_clone';
            clonedFilter.options.meta.isClone = true;
            return clonedFilter;
          } else {
            console.error('No Filter');
          }
        }
      };
    }
  ]);
}(angular));