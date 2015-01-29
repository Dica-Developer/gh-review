(function (angular) {
  'use strict';

  /* Services */

  var services = angular.module('GHReview');

  services.factory('getCommitApproved', ['commentCollector',
    function (commentCollector) {
      return commentCollector.getCommitApproved();
    }
  ]);

  services.factory('commentProviderService', ['commentProvider',
    function (commentProvider) {
      return commentProvider;
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
