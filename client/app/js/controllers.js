(function (angular) {
  'use strict';

  /* Controllers */

  angular.module('GHReview')
    .controller('RootController', [
      '$state',
      'filter',
      function ($state, filter) {
        if (filter.getAll().length > 0) {
          $state.go('listFilter');
        } else {
          $state.go('addFilter');
        }
      }
    ])

    .controller('WelcomeController', [
      /* istanbul ignore next */
      function () {
      }
    ]);
}(angular));
