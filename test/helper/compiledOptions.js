/*global define*/
define([], function(){
  'use strict';
  return {
    github: {
      clientId: '12345',
      apiScope: 'user, repo',
      redirectUri: 'http://dontexist.com',
      accessTokenUrl: 'http://dontexist.com/auth'
    },
    ghReview: {
      version: '0.0.0'
    }
  };
});