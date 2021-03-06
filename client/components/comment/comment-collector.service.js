(function (angular) {
  'use strict';

  var oneTimeCallback = null;
  angular.module('GHReview')
    .provider('commentCollector', function () {

      this.$get = ['$q', '_',
        function ($q, _) {
          var worker = void 0;
          var comments = void 0;
          var commitApproved = void 0;
          var approveComments = void 0;
          var fetchedUrls = [];
          var init = function (accessToken) {
            worker = new Worker('worker/collector.js');
            worker.onmessage = function (event) {
              if ('commentsCollected' === event.data.type) {
                comments = event.data.commentsForRepo;
                commitApproved = event.data.commitApproved;
                approveComments = event.data.approveComments;
                if (_.isFunction(oneTimeCallback)) {
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

          var addApprovalComment = function (commitIdToApprove, commentIdThatApproved) {
            commitApproved[commitIdToApprove] = true;
            approveComments[commentIdThatApproved] = true;
          };

          var removeApprovalComment = function (commitIdToUnapprove) {
            commitApproved[commitIdToUnapprove] = false;
          };

          var getCommitApproved = function () {
            var defer = $q.defer();
            if (!_.isUndefined(commitApproved)) {
              defer.resolve(commitApproved);
            } else {
              oneTimeCallback = function () {
                defer.resolve(commitApproved);
              };
            }
            return defer.promise;
          };

          var getApproveComments = function () {
            return approveComments;
          };

          var announceRepositories = function (filters) {
            var repositories = [];
            _.each(filters, function (filter) {
              var url = filter.getCommentsUrl();
              fetchedUrls.push(url);
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

          var announceRepository = function (filter) {
            var url = filter.getCommentsUrl();
            fetchedUrls.push(url);
            worker.postMessage({
              type: 'repository',
              repository: url
            });
            worker.postMessage({
              type: 'start'
            });
          };

          var announceRepositoryAndWaitForFinish = function (filter) {
            var defer = $q.defer();
            oneTimeCallback = function () {
              defer.resolve();
              oneTimeCallback = null;
            };
            var url = filter.getCommentsUrl();
            fetchedUrls.push(url);
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
            getApproveComments: getApproveComments,
            addApprovalComment: addApprovalComment,
            removeApprovalComment: removeApprovalComment
          };
        }
      ];
    });
}(angular));
