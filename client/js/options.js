(function(angular){
  'use strict';
  angular.module('GHReview')
    .constant('options', {
      github: {
        clientId: '5082108e53d762d90c00',
        apiScope: 'user, repo',
        redirectUri: 'http://localhost:9000/oauth/',
        accessTokenUrl: 'http://gh-review.herokuapp.com/bemdsvdsynggmvweibduvjcbgf',
        rootUrl: 'http://localhost:9000'
      },
      'ghReview': {
        version: '0.6.6'
      }
    });
}(angular));