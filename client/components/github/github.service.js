(function (angular) {
  'use strict';

  var github;

  angular.module('GHReview')
    .constant('GitHub', window.Github)
    .service('github', ['GitHub', 'localStorageService',
      function (GitHub, localStorageService) {
        var accessToken = localStorageService.get('accessToken');
        if (!github && accessToken !== null) {
          var message = {
            type: 'oauth',
            token: accessToken
          };
          github = new GitHub({});
          github.authenticate(message);
        }
        return github;
      }
    ]);

}(angular));
