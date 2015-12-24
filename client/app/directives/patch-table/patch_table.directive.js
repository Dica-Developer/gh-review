(function (angular) {
  'use strict';

  angular.module('GHReview')
    .directive('patchTable', [
      function () {
        return {
          restrict: 'E',
          templateUrl: 'app/directives/patch-table/patch_table.html',
          scope: {
            'file': '=',
            'fileNr': '@'
          },
          controller: 'patchTableDirectiveController',
          link: function () {
          }
        };
      }
    ]);

}(angular));