(function (angular) {
  'use strict';

  angular.module('GHReview')
    .directive('avatar', function () {
      return {
        restrict: 'E',
        templateUrl: 'app/directives/avatar/avatar.html',
        link: function ($scope, element, attr) {
          $scope.$watch(attr.commit, function (value) {
            $scope.name = value.name;
            $scope.imgLink = value.avatar;
            $scope.link = value.committerLink || '#';
          $scope.imgLink = 'assets/images/icon-social-github-128.png';
          });
        }
      };
    });

}(angular));