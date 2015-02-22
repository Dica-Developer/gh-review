(function (angular) {
  'use strict';


  var services = angular.module('GHReview');
  services.factory('Filter', ['$q', '$location', 'filterUtils', '$injector', function ($q, $location, filterUtils, $injector) {

    var ghUser = $injector.get('ghUser'),
      commentCollector = $injector.get('commentCollector'),
      branchCollector = $injector.get('branchCollector'),
      contributorCollector = $injector.get('contributorCollector'),
      commitCollector = $injector.get('commitCollector'),
      treeCollector = $injector.get('treeCollector');

    function Filter(filterId) {
      this.options = filterUtils.getOptions(filterId);
      this.maxResults = 20;
      this.commitList = [];
      this.currentPage = 1;
      this.isFetchingCommits = false;
    }

    Filter.prototype.save = function () {
      if (this.options.meta.isClone) {
        this.options.meta.id = this.options.meta.originalId;
        delete this.options.meta.originalId;
        delete this.options.meta.isClone;
      }

      if (angular.isDefined(this.options.meta.isNew)) {
        delete this.options.meta.isNew;
      }
      this.options.meta.isSaved = true;
      filterUtils.storeFilterToLocalStorage(this.getId(), this.options);
    };

    Filter.prototype.saveAsNew = function () {
      this.options.meta.id = filterUtils.generateUUID();
      this.save();
    };

    Filter.prototype.set = function (key, value) {
      if (!angular.isDefined(this.options[key])) {
        throw new Error('Unknown filter property');
      }

      if (!angular.equals(this.options[key], value)) {
        this.options[key] = value;
        this.options.meta.lastEdited = new Date().getTime();
        this.options.meta.isSaved = false;
      }
    };

    Filter.prototype.setCustomFilter = function (key, value) {
      if (!angular.equals(this.options.meta.customFilter[key], value)) {
        this.options.meta.customFilter[key] = value;
        this.options.meta.lastEdited = new Date().getTime();
        this.options.meta.isSaved = false;
      }
    };
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
      return this.options.authors.indexOf(author) > -1;
    };

    Filter.prototype.addAuthor = function (author) {
      if (angular.isArray(author)) {
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
      if (angular.isObject(since)) {
        this.set('since', since);
      } else {
        throw new Error('Since should be an object but was ' + typeof since);
      }
    };

    Filter.prototype.getSince = function () {
      return this.options.since;
    };

    Filter.prototype.getSinceDate = function () {
      return filterUtils.getSinceDate(this.options);
    };

    Filter.prototype.getSinceDateISO = function () {
      return filterUtils.getSinceDateISO(this.options);
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
      this.options = filterUtils.getOptions(this.getId());
    };

    Filter.prototype._needsPostFiltering = function () {
      return (Object.keys(this.options.meta.customFilter).length > 0);
    };

    Filter.prototype.getContributorList = function () {
      return contributorCollector.get(this.getOwner(), this.getRepo());
    };

    Filter.prototype.getBranchList = function () {
      return branchCollector.get(this.getOwner(), this.getRepo());
    };

    Filter.prototype.getTree = function () {
      return treeCollector.get(this.getOwner(), this.getRepo(), this.getBranch());
    };

    Filter.prototype.getCurrentPage = function () {
      return this.currentPage;
    };

    Filter.prototype.setCurrentPage = function (page) {
      this.currentPage = page;
      $location.search('page', this.currentPage);
    };

    Filter.prototype.getPage = function () {
      if ($location.search().page && $location.search().page !== this.currentPage) {
        this.setCurrentPage($location.search().page);
      }
      var start = (this.currentPage * this.maxResults) - this.maxResults;
      var end = start + this.maxResults;
      return this.commitList.slice(start, end);
    };

    Filter.prototype.getTotalCommitsLength = function () {
      return this.commitList.length;
    };

    Filter.prototype.getCommentsUrl = function () {
      return filterUtils.getCommentsUrl(this.options);
    };

    Filter.prototype.getCommits = function (maxResults) {
      this.isFetchingCommits = true;
      this.maxResults = maxResults || this.maxResults;
      var getCommitsRefer = $q.defer(),
        _this = this;
      commitCollector.get(filterUtils.prepareGithubApiCallOptions(this, false))
        .then(
        function (commitList) {
          _this._processCustomFilter(commitList)
            .then(function () {
              _this.isFetchingCommits = false;
              getCommitsRefer.resolve(_this.getPage());
            });
        },
        function (err) {
          _this.isFetchingCommits = false;
          getCommitsRefer.reject(err);
        },
        function (uncompleteCommitList) {
          _this._processCustomFilter(uncompleteCommitList)
            .then(function () {
              getCommitsRefer.notify(_this.getPage());
            });
        }
      );
      return getCommitsRefer.promise;
    };

    Filter.prototype.getCommitsForStandup = function (maxResults) {
      this.isFetchingCommits = true;
      this.maxResults = maxResults || this.maxResults;
      var getCommitsRefer = $q.defer(),
        _this = this,
        githubCallOptions = filterUtils.prepareGithubApiCallOptions(this, true);

      commitCollector.get(githubCallOptions)
        .then(
        function (commitList) {
          _this._processCustomFilter(commitList)
            .then(function () {
              _this.isFetchingCommits = false;
              getCommitsRefer.resolve(_this.getPage());
            });
        }, function(error){
          _this.isFetchingCommits = false;
          getCommitsRefer.reject(error);
        });
      return getCommitsRefer.promise;
    };

    Filter.prototype._processCustomFilter = function (commits) {
      var defer = $q.defer(),
        _this = this;
      if (!this._needsPostFiltering()) {
        this.commitList = commits;
        defer.resolve();
      } else {
        var tmpCommits = [];
        var customFilter = this.options.meta.customFilter;
        var state = customFilter.state;
        var authors = customFilter.authors;
        var excludeOwnCommits = customFilter.excludeOwnCommits;
        ghUser.get()
          .then(function (result) {
            var userData = result;
            commentCollector.getCommitApproved()
              .then(function (commitApproved) {
                commits.forEach(function (commit) {
                  var selectCommit = true,
                    author = commit.author ? commit.author.login : commit.commit.author.login;
                  if (angular.isDefined(authors)) {
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
                    if (authors.indexOf(author) === -1) {
                      selectCommit = false;
                    }
                  }

                  if (excludeOwnCommits && author === userData.login) {
                    selectCommit = false;
                  }

                  if (angular.isDefined(state)) {
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
                _this.commitList = tmpCommits;
                defer.resolve();
              });
          });
      }
      return defer.promise;
    };

    return Filter;
  }]);
}(angular));