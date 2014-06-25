define(['angular', 'lodash'], function (angular, _) {
    'use strict';


    var oneTimeCallback = null;
    var commentCollectorModule = angular.module('GHReview.CommentCollector', []);

    commentCollectorModule.provider('commentCollector', function () {

        this.$get = ['$q', function ($q) {
            var worker = void 0;
            var comments = void 0;
            var commitApproved = void 0;
            var approveComments = void 0;
            var init = function (accessToken) {
                worker = new Worker('js/worker/collector.js');
                worker.onmessage = function (event) {
                    if ('commentsCollected' === event.data.type) {
                        comments = event.data.commentsForRepo;
                        commitApproved = event.data.commitApproved;
                        approveComments = event.data.approveComments;
                        if(_.isFunction(oneTimeCallback)){
                            oneTimeCallback();
                        }
                    }
                };
                var message = {
                    type: 'accessToken',
                    accessToken: accessToken
                };
                worker.postMessage(message);
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
                worker.postMessage({
                    type: 'start'
                });
            };

            var announceRepository = function(filter){
                var url = filter.getCommentsUrl();
                worker.postMessage({
                    type: 'repository',
                    repository: url
                });
                worker.postMessage({
                    type: 'start'
                });
            };

            var announceRepositoryAndWaitForFinish = function(filter){
                var defer = $q.defer();
                oneTimeCallback = function(){
                    defer.resolve();
                    oneTimeCallback = null;
                };
                var url = filter.getCommentsUrl();
                worker.postMessage({
                    type: 'repository',
                    repository: url
                });
                worker.postMessage({
                    type: 'start'
                });
                return defer.promise;
            };

            return {
                init: init,
                announceRepositories: announceRepositories,
                announceRepositoriy: announceRepository,
                announceRepositoryAndWaitForFinish: announceRepositoryAndWaitForFinish,
                getCommitApproved: getCommitApproved,
                getApproveComments: getApproveComments
            };
        }];
    });
});