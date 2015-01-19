(function (angular) {
  'use strict';

  angular.module('GHReview')
    .directive('avatar', function () {
      return {
        restrict: 'E',
        templateUrl: 'app/directives/avatar/avatar.html',
        link: function ($scope, element, attr) {
          $scope.imgLink = 'images/icon-social-github-128.png';
          $scope.$watch(attr.commit, function (value) {
            $scope.name = value.name;
            $scope.imgLink = value.avatar;
            $scope.link = value.committerLink || '#';
          });
        }
      };
    });

}(angular));