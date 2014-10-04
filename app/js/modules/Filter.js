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
    'getBranchesForRepo',
    function ($q, $location, _, moment, github, commentCollector, localStorageService, getBranchesForRepo) {

      var tmpCommits = {},
        filterHolder = {},
        generateUUID = function () {
          var d = new Date().getTime();
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
          });
        },
        getCurrentCommitCacheId = function () {
          var commitCacheId = $location.url();
          var urlParameter = $location.search();
          if (urlParameter.page) {
            commitCacheId = commitCacheId + '?page=' + urlParameter.page;
          }

          if (commitCacheId.indexOf('#') > -1) {
            commitCacheId = commitCacheId.substr(0, commitCacheId.indexOf('#'));
          }
          return commitCacheId;
        };


      function Filter(filterId) {
        this.commitCache = {};
        this.branchList = [];
        this.contributorList = {};
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
            customFilter: {},
            id: filterId || null
          }
        };
        this.init();
      }

      Filter.prototype.hasNextPage = false;
      Filter.prototype.hasPreviousPage = false;
      Filter.prototype.hasFirstPage = false;
      Filter.prototype.tmpCommits = [];

      Filter.prototype.init = function () {
        if (!_.isNull(this.options.meta.id)) {
          _.extend(this.options, localStorageService.get('filter-' + this.options.meta.id), true);
          this.getContributorList();
          this.getBranchList();
        } else {
          this.options.meta.id = generateUUID();
          this.options.meta.isNew = true;
        }
      };

      Filter.prototype.save = function () {
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
      };

      Filter.prototype.set = function (key, value) {
        this.commitCache = {};
        if (_.isUndefined(this.options[key])) {
          throw new Error('Unknown filter property');
        } else {
          this.options[key] = value;
          this.options.meta.lastEdited = new Date().getTime();
          this.options.meta.isSaved = false;
        }
      };

      Filter.prototype.setCustomFilter = function (key, value) {
        this.commitCache = {};
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
        this.commitCache = {};
        if (_.isArray(author)) {
          this.options.authors = author;
        } else {
          this.options.authors.push(author);
        }
        this.options.meta.isSaved = false;
      };

      Filter.prototype.removeAuthor = function (author) {
        this.commitCache = {};
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

      Filter.prototype.isSaved = function () {
        return this.options.meta.isSaved;
      };

      Filter.prototype.reset = function () {
        this.commitCache = {};
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
        var defer = $q.defer(),
          repo = this.getRepo(),
          _this = this;
        if (!_.isUndefined(this.contributorList[repo])) {
          defer.resolve(this.contributorList[repo]);
        } else {
          github.repos.getContributors(
            {
              user: this.getOwner(),
              repo: this.getRepo()
            },
            function (err, res) {
              if (!err) {
                _this.contributorList[repo] = res;
                defer.resolve(res);
              } else {
                defer.reject();
              }
            }
          );
        }
        return defer.promise;
      };

      Filter.prototype.getBranchList = function () {
        var defer = $q.defer(),
          repoFullName = this.getOwner() + '/' + this.getRepo();
        if (!_.isUndefined(this.branchList[repoFullName])) {
          defer.resolve(this.branchList[repoFullName]);
        } else {
          getBranchesForRepo(repoFullName)
            .then(function (branches) {
              this.branchList[repoFullName] = branches;
              defer.resolve(branches);
            }.bind(this));
        }
        return defer.promise;
      };

      Filter.prototype.getNextPage = function () {
        var prevPage = 2,
          urlParameter = $location.search();
        if (urlParameter.page) {
          prevPage = urlParameter.page++;
        }
        this.commitCache = {};
        $location.search('page', prevPage);
        if (this._needsPostFiltering()) {
          return this.getCommits(this.firstResult + this.maxResults, this.maxResults);
        } else {
          this.getCommitsRefer = $q.defer();
          github.getNextPage(tmpCommits, this._getCommitsCallback.bind(this));
          return this.getCommitsRefer.promise;
        }
      };

      Filter.prototype.getFirstPage = function () {
        this.commitCache = {};
        $location.search('page', 1);
        if (this._needsPostFiltering()) {
          return this.getCommits(0, this.maxResults);
        } else {
          this.getCommitsRefer = $q.defer();
          github.getFirstPage(tmpCommits, this._getCommitsCallback.bind(this));
          return this.getCommitsRefer.promise;
        }
      };

      Filter.prototype.getPreviousPage = function () {
        var prevPage,
          urlParameter = $location.search();
        if (urlParameter.page) {
          prevPage = urlParameter.page > 2 ? urlParameter.page-- : 1;
        }
        this.commitCache = {};
        $location.search('page', prevPage);
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
        if (!_.isUndefined(this.commitCache[getCurrentCommitCacheId()])) {
          return $q.when(this.commitCache[getCurrentCommitCacheId()]);
        } else {
          this.firstResult = firstResult || 0;
          this.maxResults = maxResults || -1;
          if (this._needsPostFiltering() || this.maxResults === -1) {
            return this._getCommitsPostFiltered();
          } else {
            return this._getCommitsDirect();
          }
        }
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
            this.commitCache[getCurrentCommitCacheId()] = commits;
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
                var author = commit.author ? commit.author.login : commit.commit.author.login;
                if (!_.contains(authors, author)) {
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
            var finalizedCommits;
            if (this.maxResults > -1) {
              finalizedCommits = _.first(_.rest(tmpCommits, this.firstResult), this.maxResults);
            } else {
              finalizedCommits = _.rest(tmpCommits, this.firstResult);
            }
            this.commitCache[getCurrentCommitCacheId()] = finalizedCommits;
            this.getCommitsRefer.resolve(finalizedCommits);
          }.bind(this));
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
        }
      };
    }
  ]);
}(angular));
