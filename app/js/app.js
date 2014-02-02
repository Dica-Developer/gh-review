/*global define*/
define(['Logger', 'GitHub'], function(Logger, GitHub){
  'use strict';

  var logger = new Logger('app');

  logger.trace('It work\'s');
  console.log(logger);

  var github = new GitHub({
      clientId:'5082108e53d762d90c00',
      clientSecret:'178651f3705d7952413ff82447004171712f1950',
      apiScope: 'user, repo',
      redirectUri: 'http://localhost:9000/githubCallback.html'
    });
  console.log(github);
  github.user(function(error, response){
    console.log(response);
    console.log(this);
  });

  function GHReview(){}

  return new GHReview();
});
