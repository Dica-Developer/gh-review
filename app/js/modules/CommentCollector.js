define(['angular', 'lodash'], function (angular, _) {
    'use strict';

    var commentCollectorModule = angular.module('GHReview.CommentCollector', []);

    commentCollectorModule.provider('commentCollector', function () {

        this.$get = ['$rootScope', function ($rootScope) {
            var worker = void 0;
            var commitApproved = {};
            var approveComments = {};
            var init = function (accessToken) {
                worker = new Worker('js/worker/collector.js');
                worker.onmessage = function (event) {
                    if ('comments' === event.data.type) {
                        sortOutApproveComments(event.data.comments);
                    }
                };
                var message = {
                    type: 'token',
                    token: accessToken
                };
                worker.postMessage(message);
            };

            var sortOutApproveComments = function (comments) {
                var approveCommit = function (comment) {
                    /*jshint camelcase:false*/
                    if (true !== commitApproved[comment.commit_id]) {
                        commitApproved[comment.commit_id] = true;
                    }
                    if (true !== approveComments[comment.id]) {
                        approveComments[comment.id] = true;
                    }
                };

                _.each(comments, function (comment) {
                    var commentBody = comment.body;
                    if (commentBody) {
                        if (commentBody.indexOf('```json') > -1) {
                            commentBody = commentBody.substring(7, (commentBody.length - 3));
                            commentBody = JSON.parse(commentBody);
                            if (true === commentBody.approved) {
                                approveCommit(comment);
                            }
                        }
                    }
                });

                //TODO find a way to only trigger if data has changed
                $rootScope.$broadcast('commentCollector.notification.newData');
            };

            var getCommitApproved = function () {
                return commitApproved;
            };

            var getApproveComments = function () {
                return approveComments;
            };

            var announceRepositories = function (filters) {
                var repositories = [];
                _.each(filters, function (filter) {
                    var url = filter.getCommentsUrl();
                    repositories.push(url);
                });
                worker.postMessage({
                    type: 'repositories',
                    repositories: repositories
                });
            };

            return {
                init: init,
                announceRepositories: announceRepositories,
                getCommitApproved: getCommitApproved,
                getApproveComments: getApproveComments
            };
        }];
    });
});