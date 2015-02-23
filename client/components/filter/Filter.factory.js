(function (angular) {
  'use strict';


  var services = angular.module('GHReview');
  services.factory('Filter', ['$q', '$location', '$log', 'filterUtils', '$injector', function ($q, $location, $log, filterUtils, $injector) {

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
      this.healthCheckError = null;
      this.healthCheck();
    }

    Filter.prototype.healthCheck = function(){
      var _this = this;
      filterUtils.filterHealthCheck(this.options)
        .then(function(){
          _this.healthCheckError = null;
        }, function(error){
          _this.healthCheckError = error;
        });
    };

    Filter.prototype.isHealthy = function(){
      return this.healthCheckError === null;
    };

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

    Filter.prototype.isNew = function(){
      return angular.isDefined(this.options.meta.isNew);
    };

    Filter.prototype.lastEdited = function(){
      return this.options.meta.lastEdited;
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
      var newAuthors = this.options.authors.concat([]);
      if (angular.isArray(author)) {
        newAuthors = author;
      } else {
        newAuthors.push(author);
      }

      this.set('authors', newAuthors);
    };

    Filter.prototype.removeAuthor = function (author) {
      var newAuthors = this.options.authors.concat([]);
      newAuthors.splice(newAuthors.indexOf(author), 1);

      this.set('authors', newAuthors);
    };

    Filter.prototype.unsetAuthors = function () {
      this.set('authors', []);
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
      return (Object.keys(this.options.meta.customFilter).length > 0) || this.getAuthors().length > 1;
    };

    Filter.prototype.handleError = function(error){
      $log.error(error);
    };

    Filter.prototype.getContributorList = function () {
      var defer = $q.defer();
      contributorCollector
        .get(this.getOwner(), this.getRepo())
        .then(defer.resolve, this.handleError);
      return defer.promise;
    };

    Filter.prototype.getBranchList = function () {
      var defer = $q.defer();
      branchCollector
        .get(this.getOwner(), this.getRepo())
        .then(defer.resolve, this.handleError);
      return defer.promise;
    };

    Filter.prototype.getTree = function () {
      var defer = $q.defer();
      treeCollector
        .get(this.getOwner(), this.getRepo(), this.getBranch())
        .then(defer.resolve, this.handleError);
      return defer.promise;
    };

    Filter.prototype.getCurrentPage = function () {
      return this.currentPage;
    };

    Filter.prototype.setCurrentPage = function (page) {
      this.currentPage = page;
      $location.search('page', this.currentPage);
    };

    //TODO move $location dependency out of Filter
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

    Filter.prototype.getCommits = function (forStandup, maxResults) {
      this.maxResults = maxResults || this.maxResults;

      var _this = this,
        getCommitsDefer = $q.defer(),
        githubApiCallOptions = filterUtils.prepareGithubApiCallOptions(this.options, forStandup);


      if(this.isHealthy()){
        this.isFetchingCommits = true;
        commitCollector.get(githubApiCallOptions)
          .then(
          function (commitList) {
            _this._processCustomFilter(commitList)
              .then(function () {
                _this.isFetchingCommits = false;
                getCommitsDefer.resolve(_this.getPage());
              });
          },
          function (err) {
            _this.isFetchingCommits = false;
            getCommitsDefer.reject(err);
          },
          function (uncompleteCommitList) {
            _this._processCustomFilter(uncompleteCommitList)
              .then(function () {
                getCommitsDefer.notify(_this.getPage());
              });
          }
        );
      } else {
        getCommitsDefer.reject();
      }

      return getCommitsDefer.promise;
    };

    Filter.prototype._processCustomFilter = function (commits) {
      var defer = $q.defer(),
        _this = this;
      if (!this._needsPostFiltering()) {
        this.commitList = commits;
        defer.resolve();
      } else {
        var authors = this.getAuthors(),
          processAuthors = authors.length > 1,
          state = this.getState(),
          excludeOwnCommits = this.getExcludeOwnCommits();

        ghUser.get()
          .then(function (result) {
            var userData = result;
            commentCollector.getCommitApproved()
              .then(function (commitApproved) {
                _this.commitList = commits.filter(function (commit) {
                  var selectCommit = true,
                    author = commit.author ? commit.author.login : commit.commit.author.login;

                  //TODO commit.author can be null how to find the login name of an author
                  if (processAuthors && (authors.indexOf(author) === -1)) {
                      selectCommit = false;
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
                  return selectCommit;
                });
                defer.resolve();
              });
          });
      }
      return defer.promise;
    };

    return Filter;
  }]);
}(angular));