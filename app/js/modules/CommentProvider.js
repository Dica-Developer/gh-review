define(['angular', 'lodash'], function (angular, _) {
    'use strict';

    var commentProviderModule = angular.module('GHReview.CommentProvider', []);

    commentProviderModule.factory('commentProvider', ['$q', 'authenticated', 'github', 'commentCollector', function ($q, authenticated, github, commentCollector) {

        var getApproversFromComments = function (result) {
            var commitApproved = commentCollector.getCommitApproved();
            var approveComments = commentCollector.getApproveComments();
            var approvers = [];
            _.each(result, function (comment) {
                /*jshint camelcase:false*/
                if ((true === commitApproved[comment.commit_id]) && (true === approveComments[comment.id])) {
                    approvers.push(comment.user.login);
                }
            });
            return approvers;
        };

        var splitInLineAndCommitComments = function (result) {
            return {
                lineComments: _.filter(result, function (comment) {
                    return !_.isNull(comment.line) && !_.isNull(comment.position);
                }),
                commitComments: _.where(result, {line: null, position: null})
            };
        };


        var getCommentsForCommit = function (stateParams) {
            var defer = $q.defer();
            if (authenticated.get()) {
                github.repos.getCommitComments({
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
                        var approvers = getApproversFromComments(res);
                        var comments = splitInLineAndCommitComments(res);
                        var resolveObject = {comments: comments, approvers: approvers};
                        defer.resolve(resolveObject);
                    }
                });
            } else {
                defer.reject(new Error('Not authenticated'));
            }
            return defer.promise;
        };

        return {
            getCommentsForCommit: getCommentsForCommit
        };
    }]);
});