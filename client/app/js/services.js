(function (angular) {
  'use strict';

  /* Services */

  var services = angular.module('GHReview');

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
      var accessToken = localStorageService.get('accessToken');
      if (!github && accessToken !== null) {
        var message = {
          type: 'oauth',
          token: accessToken
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
        byPath: /*istanbul ignore next*/ function (options) {
          var defer = $q.defer();
          var commitsPerFileWorker = new Worker('worker/commitsOfFile.js');
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
  services.factory('collectComments', ['commentCollector', 'localStorageService', 'filter',
    function (commentCollector, localStorageService, filter) {
      return function () {
        var accessToken = localStorageService.get('accessToken');
        commentCollector.init(accessToken);
        commentCollector.announceRepositories(filter.getAll());
        return true;
      };
    }
  ]);

  services.factory('getCommitApproved', ['commentCollector',
    function (commentCollector) {
      return commentCollector.getCommitApproved();
    }
  ]);

  services.factory('getAllAvailableRepos', ['$q', 'github',
    function ($q, github) {
      return function () {
        var defer = $q.defer();
        github.repos.getAll({}, function (error, res) {
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

  services.factory('getFileContent', ['$q', 'github',
    function ($q, github) {
      return function (options) {
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

  services.factory('approveCommit', ['$q', 'github', 'options', 'githubUserData', 'commentCollector',
    function ($q, github, options, githubUserData, commentCollector) {
      return function (sha, user, repo) {
        var defer = $q.defer();

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
          });
        return defer.promise;
      };
    }
  ]);

  services.factory('unapproveCommit', ['$q', 'github', 'commentCollector',
    function ($q, github, commentCollector) {
      return function (commentId, sha, user, repo) {
        var defer = $q.defer();
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
