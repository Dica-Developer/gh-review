(function(angular){
  'use strict';

  angular.module('commentCollectorMock', [])
    .factory('commentCollector', [function () {

      return {
        init: angular.noop,
        announceRepositories: angular.noop,
        announceRepositoriy: angular.noop,
        announceRepositoryAndWaitForFinish: angular.noop,
        getCommitApproved: angular.noop,
        getApproveComments: angular.noop,
        addApprovalComment: angular.noop,
        removeApprovalComment: angular.noop
      };
    }]);

}(angular));
