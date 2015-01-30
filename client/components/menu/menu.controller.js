(function (angular) {
  'use strict';

  angular.module('GHReview')
    .controller('MenuController', ['$scope', '$state', 'authenticated', 'githubUserData', 'collectComments', 'hotkeys', function ($scope, $state, authenticated, githubUserData, collectComments, hotkeys) {
      $scope.isAuthenticated = authenticated.get;
      $scope.isCollapsed = true;
      $scope.menu = [
        {
          'title': 'Commits',
          'link': 'listFilter',
          'id': 'menu-commits'
        },
        {
          'title': 'Modules',
          'link': 'modules',
          'id': 'menu-modules'
        }
      ];
      $scope.submenu = [
        {
          'title': 'Who Am I',
          'linkType': 'sref',
          'link': 'whoami',
          'id': 'submenu-whoami'
        },
        {
          'title': 'I found a bug',
          'linkType': 'href',
          'link': 'https://github.com/Dica-Developer/gh-review/issues',
          'id': 'submenu-bug'
        },
        {
          'title': 'I need more',
          'linkType': 'href',
          'link': 'https://github.com/Dica-Developer/gh-review',
          'id': 'submenu-more'
        },
        {
          'title': 'How to use',
          'linkType': 'href',
          'link': 'https://github.com/Dica-Developer/gh-review/wiki',
          'id': 'submenu-howto'
        },
        {
          'title': 'About',
          'linkType': 'sref',
          'link': 'about',
          'id': 'submenu-about'
        },
        {
          'title': 'Logout',
          'linkType': 'sref',
          'link': 'logout',
          'id': 'submenu-logout'
        }
      ];
      if ($scope.isAuthenticated()) {
        collectComments();
        hotkeys.bindTo($scope)
          .add({
            combo: 'g f',
            description: 'Go to filter list',
            callback: function (event) {
              event.preventDefault();
              $state.go('listFilter');
            }
          })
          .add({
            combo: 'g m',
            description: 'Go to module search',
            callback: function (event) {
              event.preventDefault();
              $state.go('modules');
            }
          })
          .add({
            combo: 'g w',
            description: 'Go to "Who Am I" page',
            callback: function (event) {
              event.preventDefault();
              $state.go('whoami');
            }
          })
          .add({
            combo: ': q',
            description: 'Logout',
            callback: function (event) {
              event.preventDefault();
              $state.go('logout');
            }
          });
        githubUserData.get()
          .then(function (userData) {
            $scope.name = userData.name;
          });
      }
    }]);

}(angular));