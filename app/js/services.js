define(['angular', 'githubjs', 'moment', 'lodash'], function (angular, GitHub, moment, _) {
    'use strict';

    /* Services */

    var services = angular.module('GHReview.services', []);

    services.factory('authenticated', ['localStorageService', function (localStorageService) {
        return {
            get: function () {
                return localStorageService.get('accessToken') !== null;
            },
            set: function (value) {
                /*jshint camelcase:false*/
                localStorageService.set('accessToken', value.access_token);
            }
        };
    }]);

    var github = false;
    services.factory('github', ['localStorageService', function (localStorageService) {
        if (!github) {
            var message = {
                type: 'token',
                token: localStorageService.get('accessToken')
            };
            github = new GitHub({});
            github.authenticate(message);
        }
        return github;
    }]);

    services.factory('githubUserData', ['$q', 'github', function ($q, github) {
        return {
            get: function () {
                var defer = $q.defer();
                github.user.get({}, function (error, res) {
                    if (error) {
                        defer.reject(error);
                    } else {
                        defer.resolve(res);
                    }
                });
                return defer.promise;
            }
        };
    }]);

    services.factory('commits', ['$q', 'github', 'localStorageService', function ($q, github, localStorageService) {
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
    }]);


    services.factory('filter', ['localStorageService', 'Filter', function (localStorageService, Filter) {

        var getAll = function () {
            var filter = [];
            var filterIds = localStorageService.get('filter');
            if (filterIds !== null) {
                filterIds.split(',').forEach(function (id) {
                    filter.push(new Filter(id));
                });
            }
            return filter;
        };

        var getById = function (filterId) {
            return new Filter(filterId);
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

    }]);

    services.factory('humanReadableDate', function () {
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
            }
        };
    });

    /**
     * @deprecated should handled by worker as well and triggered from another place then menu directive
     */
    services.factory('collectComments', ['commentCollector', 'authenticated', 'localStorageService', 'filter', function (commentCollector, authenticated, localStorageService, filter) {
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
    }]);

    services.factory('getCommitApproved', ['commentCollector', function (commentCollector) {
        return commentCollector.getCommitApproved();
    }]);

    services.factory('getAllAvailableRepos', ['$q', 'authenticated', 'githubUserData', 'github', function ($q, authenticated, githubUserData, github) {
        return function () {
            var defer = $q.defer();
            if (authenticated.get()) {
                githubUserData.get()
                    .then(function (userData) {
                        github.repos.getAll({
                            user: userData.login
                        }, function (error, res) {
                            if (error) {
                                defer.reject(error);
                            } else {
                                defer.resolve(res);
                            }
                        });
                    });
            } else {
                defer.reject(new Error('Not authenticated yet'));
            }
            return defer.promise;
        };
    }]);

    services.factory('githubFreeSearch', ['$q', 'github', function ($q, github) {
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
    }]);

    services.factory('getFileContent', ['$q', 'github', function ($q, github) {
        return function (options) {
            if (_.isNull(options.ref)) {
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
    }]);

    services.factory('getAllReposAndBranches', ['$q', 'githubUserData', 'localStorageService', function ($q, githubUserData, localStorageService) {
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
    }]);

    services.factory('getTreeData', ['$q', 'github', function ($q, github) {
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
    }]);

});
