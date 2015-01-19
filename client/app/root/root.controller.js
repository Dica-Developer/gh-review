(function (angular) {
  'use strict';

  //FIXME seems to be obsolete
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
    ]);
}(angular));
