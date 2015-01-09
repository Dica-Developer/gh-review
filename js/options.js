(function(angular){
  'use strict';
  angular.module('GHReview')
    .constant('options', {
      github: {
        clientId: '833c028df47be8e881d9',
        apiScope: 'user, repo',
        redirectUri: 'https://dica-developer.github.io/gh-review/oauth/',
        accessTokenUrl: 'https://gh-review.herokuapp.com/login/oauth/access_token',
        rootUrl: 'https://dica-developer.github.io/gh-review'
      },
      'ghReview': {
        version: '0.6.13'
      }
    });
}(angular));