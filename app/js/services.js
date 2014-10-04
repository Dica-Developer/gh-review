(function (angular) {
//TODO options
  'use strict';

  /* Services */

  var services = angular.module('GHReview');

  services.value('githubOptions', {
    clientId: '5082108e53d762d90c00',
    apiScope: 'user, repo',
    redirectUri: 'http://localhost:9000',
    accessTokenUrl: 'http://gh-review.herokuapp.com/bemdsvdsynggmvweibduvjcbgf'
  });

  services.factory('authenticated', ['localStorageService',
    function (localStorageService) {
      return {
        get: function () {
          return localStorageService.get('accessToken') !== null;
        },
        set: function (value) {
          /*jshint camelcase:false*/
          localStorageService.set('accessToken', value.access_token);
        }
      };
    }
  ]);

  var github = false;
  services.factory('github', ['GitHub', 'localStorageService',
    function (GitHub, localStorageService) {
      if (!github) {
        var message = {
          type: 'oauth',
          token: localStorageService.get('accessToken')
        };
        github = new GitHub({});
        github.authenticate(message);
      }
      return github;
    }
  ]);

  services.factory('githubUserData', ['$q', 'github',
    function ($q, github) {
      var userData = null;
      return {
        get: function () {
          var defer = $q.defer();
          if (userData) {
            defer.resolve(userData);
          } else {
            github.user.get({}, function (error, res) {
              if (error) {
                defer.reject(error);
              } else {
                userData = res;
                defer.resolve(res);
              }
            });
          }
          return defer.promise;
        }
      };
    }
  ]);

  services.factory('commits', ['$q', 'github', 'localStorageService',
    function ($q, github, localStorageService) {
      return {
        bySha: function (params) {
          var defer = $q.defer();
          github.repos.getCommit({
            user: params.user,
            repo: params.repo,
            sha: params.sha
          }, function (error, res) {
            if (error) {
              defer.reject(error);
            } else {
              defer.resolve(res);
            }
          });
          return defer.promise;
        },
        byPath: function (options) {
          var defer = $q.defer();
          var commitsPerFileWorker = new Worker('js/worker/commitsOfFile.js');
          commitsPerFileWorker.onmessage = function (event) {
            if ('commits' === event.data.type) {
              commitsPerFileWorker.terminate();
              defer.resolve(event.data.commits.concat([]));
            }
          };
          options.type = 'getCommits';
          options.token = localStorageService.get('accessToken');
          commitsPerFileWorker.postMessage(options);
          return defer.promise;
        }
      };
    }
  ]);

  services.factory('filter', ['_', 'localStorageService', 'filterProvider',
    function (_, localStorageService, filterProvider) {

      var getAll = function () {
        var filter = [];
        var filterIds = localStorageService.get('filter');
        if (filterIds !== null) {
          filterIds.split(',').forEach(function (id) {
            filter.push(filterProvider.get(id));
          });
        }
        return filter;
      };

      var getById = function (filterId) {
        return filterProvider.get(filterId);
      };

      var remove = function (filterId) {
        localStorageService.remove('filter-' + filterId);
        var filterList = localStorageService.get('filter').split(',');
        _.remove(filterList, function (value) {
          return value === filterId;
        });
        localStorageService.set('filter', filterList.join(','));
      };

      return {
        getAll: getAll,
        getById: getById,
        remove: remove
      };

    }
  ]);

  services.factory('humanReadableDate', ['moment', function (moment) {
    return {
      fromNow: function (date) {
        var retVal = null;
        if (date) {
          retVal = moment(date).fromNow();
        }
        return retVal;
      },
      format: function (date) {
        var retVal = null;
        if (date) {
          retVal = moment(date).format('llll');
        }
        return retVal;
      },
      customFormat: function (date, formatPattern) {
        var retVal = null;
        if (date) {
          retVal = moment(date).format(formatPattern);
        }
        return retVal;
      }
    };
  }]);

  /**
   * @deprecated should handled by worker as well and triggered from another place then menu directive
   */
  services.factory('collectComments', ['commentCollector', 'authenticated', 'localStorageService', 'filter',
    function (commentCollector, authenticated, localStorageService, filter) {
      return function () {
        var retVal = false;
        if (authenticated.get()) {
          var accessToken = localStorageService.get('accessToken');
          commentCollector.init(accessToken);
          commentCollector.announceRepositories(filter.getAll());
          retVal = true;
        }
        return retVal;
      };
    }
  ]);

  services.factory('getCommitApproved', ['commentCollector',
    function (commentCollector) {
      return commentCollector.getCommitApproved();
    }
  ]);

  services.factory('getAllAvailableRepos', ['$q', 'authenticated', 'githubUserData', 'github',
    function ($q, authenticated, githubUserData, github) {
      return function () {
        var defer = $q.defer();
        if (authenticated.get()) {
          github.repos.getAll({}, function (error, res) {
            if (error) {
              defer.reject(error);
            } else {
              defer.resolve(res);
            }
          });
        } else {
          defer.reject(new Error('Not authenticated yet'));
        }
        return defer.promise;
      };
    }
  ]);

  services.factory('githubFreeSearch', ['$q', 'github',
    function ($q, github) {
      return function (searchValue) {
        var defer = $q.defer();
        github.search.code({
          q: searchValue
        }, function (error, res) {
          if (error) {
            defer.reject(error);
          } else {
            defer.resolve(res);
          }
        });
        return defer.promise;
      };
    }
  ]);

  services.factory('getFileContent', ['$q', '_', 'github',
    function ($q, _, github) {
      return function (options) {
        if (_.isUndefined(options.ref) || _.isNull(options.ref)) {
          delete options.ref;
        } else {
          delete options.sha;
        }
        var defer = $q.defer();
        options.headers = {
          'accept': 'application/vnd.github.v3.raw'
        };
        github.repos.getContent(options, function (error, result) {
          if (!error) {
            defer.resolve(result.data);
          } else {
            defer.reject(error);
          }
        });
        return defer.promise;
      };
    }
  ]);

  services.factory('getAllReposAndBranches', ['$q', 'githubUserData', 'localStorageService',
    function ($q, githubUserData, localStorageService) {
      return function () {
        var defer = $q.defer();
        var getReposWorker = new Worker('js/worker/getAllReposAndBranches.js');
        var accessToken = localStorageService.get('accessToken');
        getReposWorker.onmessage = function (event) {
          defer.resolve(event.data.repos);
          getReposWorker.terminate();
        };

        githubUserData.get()
          .then(function (userData) {
            getReposWorker.postMessage({
              type: 'getReposAndBranches',
              user: userData.login,
              accessToken: accessToken
            });
          });
        return defer.promise;
      };
    }
  ]);

  services.factory('getAllRepos', ['$q', '$interval', 'githubUserData', 'localStorageService',
    function ($q, $interval, githubUserData, localStorageService) {
      var repositoriesCache = [];
      $interval(function clearRepoCache(){
        repositoriesCache = [];
      }, 1800000); //1800000 = 1/2 hour

      return function () {
        var defer = $q.defer();
        if (repositoriesCache.length > 0) {
          defer.resolve(repositoriesCache);
        } else {
          var getReposWorker = new Worker('js/worker/getAllReposAndBranches.js');
          var accessToken = localStorageService.get('accessToken');
          getReposWorker.onmessage = function (event) {
            repositoriesCache = event.data.repos;
            defer.resolve(event.data.repos);
            getReposWorker.terminate();
          };

          githubUserData.get()
            .then(function (userData) {
              getReposWorker.postMessage({
                type: 'getAllRepos',
                user: userData.login,
                accessToken: accessToken
              });
            });
        }
        return defer.promise;
      };
    }
  ]);

  services.factory('getBranchesForRepo', ['$q', '$interval', 'localStorageService',
    function ($q, $interval, localStorageService) {
      var branchesCache = {};
      $interval(function updateBranchesCache(){
        Object.keys(branchesCache).forEach(function(repoFullName){
          getBranchesForRepo(repoFullName);
        });
        branchesCache = {};
      }, 600000); //600000 = 10min

      function getBranchesForRepo(repoFullName) {
        var defer = $q.defer(),
          getReposWorker = new Worker('js/worker/getAllReposAndBranches.js'),
          accessToken = localStorageService.get('accessToken');
        getReposWorker.onmessage = function (event) {
          branchesCache[repoFullName] = event.data.branches;
          defer.resolve(event.data.branches);
          getReposWorker.terminate();
        };

        getReposWorker.postMessage({
          type: 'getBranchesForRepo',
          accessToken: accessToken,
          repo: repoFullName
        });
        return defer.promise;
      }

      return function (repoFullName) {
        if(branchesCache[repoFullName]){
          return $q.when(branchesCache[repoFullName]);
        } else {
          return getBranchesForRepo(repoFullName);
        }
      };
    }
  ]);

  services.factory('getTreeData', ['$q', 'github',
    function ($q, github) {
      return function (user, repo, sha) {
        var defer = $q.defer();

        github.gitdata.getTree({
          user: user,
          repo: repo,
          sha: sha,
          recursive: true
        }, function (error, treeData) {
          if (error) {
            defer.reject(error);
          } else {
            defer.resolve(treeData);
          }
        });
        return defer.promise;
      };
    }
  ]);

  services.factory('commentProviderService', ['commentProvider',
    function (commentProvider) {
      return commentProvider;
    }
  ]);

  services.factory('commitProviderService', ['commitProvider',
    function (commitProvider) {
      return commitProvider;
    }
  ]);

  services.factory('approveCommit', ['$q', '_', 'github', 'options', 'authenticated', 'githubUserData', 'commentCollector',
    function ($q, _, github, options, authenticated, githubUserData, commentCollector) {
      return function (sha, user, repo) {
        var defer = $q.defer();

        if (authenticated.get()) {
          githubUserData.get()
            .then(function (userData) {
              var commitState = {
                version: options.ghReview.version,
                approved: true,
                approver: userData.login,
                approvalDate: Date.now()
              };
              var comment = '```json\n' + JSON.stringify(commitState, null, 2) + '\n```\napproved with [gh-review](http://gh-review.herokuapp.com/)';
              github.repos.createCommitComment({
                user: user,
                repo: repo,
                // TODO sha and commit id are the same. Why do we need both?
                sha: sha,
                /*jshint camelcase:false*/
                commit_id: sha,
                body: comment
              }, function (error, comment) {
                if (!error) {
                  commentCollector.addApprovalComment(sha, comment.id);
                  defer.resolve();
                } else {
                  defer.reject(error);
                }
              });
            }).catch(function (error) {
              defer.reject(error);
            });
        } else {
          defer.reject(new Error('Not authenticated'));
        }
        return defer.promise;
      };
    }
  ]);

  services.factory('unapproveCommit', ['$q', 'github', 'authenticated', 'githubUserData', 'commentCollector',
    function ($q, github, authenticated, githubUserData, commentCollector) {
      return function (commentId, sha, user, repo) {
        var defer = $q.defer();
        if (authenticated.get()) {
          github.repos.deleteCommitComment({
            user: user,
            repo: repo,
            id: commentId
          }, function (error) {
            if (!error) {
              commentCollector.removeApprovalComment(sha);
              defer.resolve();
            } else {
              defer.reject(error);
            }
          });
        } else {
          defer.reject(new Error('Not authenticated'));
        }
        return defer.promise;
      };
    }
  ]);

  services.factory('isCommentNotApprovalComment', ['commentCollector',
    function (commentCollector) {
      return function (commentId) {
        return (true !== commentCollector.getApproveComments()[commentId]);
      };
    }
  ]);

  services.factory('isCommentApprovalCommentFromUser', ['commentCollector',
    function (commentCollector) {
      return function (comment, loggedInUser) {
        return (true === commentCollector.getApproveComments()[comment.id]) && comment.user.login === loggedInUser.login;
      };
    }
  ]);
}(angular));
