define(['angular', 'lodash'], function (angular, _) {
    'use strict';

    var commitProviderModule = angular.module('GHReview.CommitProvider', []);

    commitProviderModule.factory('commitProvider', ['$q', '$timeout', 'authenticated', 'github', 'Chunk', function ($q, $timeout, authenticated, github, Chunk) {
        var computeChunk = function (resp) {
            var defer = $q.defer();
            var files = [];
            var filesLength = 0;
            var addFile = function (file, fileIndex) {
                var lines = _.str.lines(file.patch);
                /*jshint camelcase: false*/
                var start = file.blob_url.indexOf('blob/') + 'blob/'.length;
                var shaAndPath = file.blob_url.substr(start);
                var end = shaAndPath.indexOf('/');
                var blobSha = shaAndPath.substr(0, end);
                files[fileIndex] = {
                    lines: new Chunk(lines, file.filename),
                    name: file.filename,
                    blobSha: blobSha,
                    additions: file.additions,
                    deletions: file.deletions,
                    changes: file.changes
                };
                if (fileIndex === (filesLength - 1)) {
                    defer.resolve({files: files, commit: resp});
                }
            };

            filesLength = resp.files.length;
            _.forEach(resp.files, addFile, this);
            return defer.promise;
        };

        var getCommitBySha = function (stateParams) {
            var defer = $q.defer();
            if (authenticated.get()) {
                github.repos.getCommit({
                    user: stateParams.user,
                    repo: stateParams.repo,
                    sha: stateParams.sha,
                    headers: {
                        'Accept': 'application/vnd.github-commitcomment.html+json'
                    }
                }, function (error, res) {
                    if (error) {
                        defer.reject(error);
                    } else {
                        if (res.meta) {
                            delete res.meta;
                        }
                        defer.resolve(res);
                    }
                });
            } else {
                defer.reject(new Error('Not authenticated'));
            }
            return defer.promise;
        };

        var getPreparedCommit = function (stateParams) {
            var defer = $q.defer();
            getCommitBySha(stateParams)
                .then(computeChunk)
                .then(function (arg) {
                    /* jshint camelcase:false */
                    var commit = arg.commit;
                    var splittedUrl = commit.html_url.split('/');
                    var repository = splittedUrl[4];
                    var owner = splittedUrl[3];
                    var committer = commit.committer;
                    /*jshint camelcase:false*/
                    var avatar = committer ? committer.avatar_url : null;
                    var committerLink = committer.html_url;
                    var commitInfos = {
                        sha: commit.sha,
                        additions: commit.stats.additions,
                        deletions: commit.stats.deletions,
                        changes: commit.stats.total,
                        message: commit.commit.message,
                        date: commit.commit.committer.date,
                        repository: repository,
                        owner: owner,
                        committer: {
                            name: commit.commit.committer.name,
                            email: commit.commit.committer.email,
                            avatar: avatar,
                            committerLink: committerLink
                        }
                    };
                    defer.resolve({commitInfos: commitInfos, files: arg.files});
                });
            return defer.promise;
        };

        return {
            getCommitBySha: getCommitBySha,
            getPreparedCommit: getPreparedCommit
        };
    }]);
});