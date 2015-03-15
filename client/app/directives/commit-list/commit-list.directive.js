(function (angular) {
  'use strict';
  angular.module('GHReview')
    .directive('ghreviewCommitList', [
      /*istanbul ignore next*/
      //nothing to test with unit tests
      function () {
        return {
          restrict: 'E',
          templateUrl: 'app/directives/commit-list/commit-list.html',
          scope: {
            'commits': '=commitList',
            'filter': '=',
            'newCommits': '='
          },
          controller: 'commitListDirectiveController',
          link: function () {
          }
        };
      }
    ]);
}(angular));