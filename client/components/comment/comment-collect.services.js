(function (angular) {
  'use strict';

  /**
   * @deprecated should handled by worker as well and triggered from another place then menu directive
   */
  angular.module('GHReview')
    .factory('collectComments', ['commentCollector', 'localStorageService', 'filter',
      function (commentCollector, localStorageService, filter) {
        return function () {
          var accessToken = localStorageService.get('accessToken');
          commentCollector.init(accessToken);
          commentCollector.announceRepositories(filter.getAll());
          return true;
        };
      }
    ]);

}(angular));