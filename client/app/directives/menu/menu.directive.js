(function (angular) {
  'use strict';

  angular.module('GHReview')
    .directive('menu', [
      function () {
        return {
          restrict: 'A',
          templateUrl: 'app/directives/menu/menu.html',
          controller: 'menuDirectiveController',
          link: [
            /* istanbul ignore next */
            function () {
            }
          ]
        };
      }
    ]);

}(angular));