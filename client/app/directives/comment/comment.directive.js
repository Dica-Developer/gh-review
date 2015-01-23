(function (angular) {
  'use strict';

  angular.module('GHReview')
    .directive('comment', [
      function () {
        return {
          restrict: 'A',
          templateUrl: 'app/directives/comment/comment.html',
          scope: {
            'comment': '=content',
            'cancel': '&',
            'delete': '&'
          }
        };
      }
    ]);

}(angular));