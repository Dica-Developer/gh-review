(function () {
  'use strict';

  angular.module('GHReview')
    .controller('LogoutController', [
      '$state',
      'localStorageService',
      function ($state, localStorageService) {
        localStorageService.remove('accessToken');
        $state.go('welcome');
      }
    ]);

}());
