(function (angular) {
  'use strict';

  angular.module('GHReview')
    .directive('avatar', function () {
      return {
        restrict: 'E',
        templateUrl: 'app/directives/avatar/avatar.html',
        link: function ($scope, element, attr) {
          $scope.imgLink = 'assets/images/icon-social-github-128.png';
          $scope.$watch(attr.commit, function (commitResponse) {
            if(commitResponse){
              $scope.name = commitResponse.commit.committer.name;
              /*jshint camelcase:false*/
              $scope.imgLink = commitResponse.committer.avatar_url;
              $scope.link = commitResponse.committer.html_url || '#';
            }
          });
        }
      };
    });

}(angular));