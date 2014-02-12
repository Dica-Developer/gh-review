/*global define, describe, it, expect, spyOn, waitsFor, runs*/
define(['server', 'githubResponses', 'app', 'userModel'], function(server, githubResponses, app, UserModel){
  'use strict';

  describe('OAuth', function(){

    it('Should be defined', function(){
      expect(UserModel).toBeDefined();
    });

    describe('new UserModel()', function(){
      it('Should init user data on init', function(){
        var githubGithubUserSpy = spyOn(app.github.user, 'get');
        new UserModel();
        expect(githubGithubUserSpy).toHaveBeenCalled();
      });

      it('After github api call handleResponse should be called', function(){
        server.githubUserGet();
        var userModel = new UserModel();
        var handleResponseSpy = spyOn(userModel, 'handleResponse');
        userModel.getUserData();

        waitsFor(function(){
          return server.server.requests[0].readyState === 4;
        }, '', 500);

        runs(function(){
          var expectedResponse = githubResponses.userGet;
          expectedResponse.meta = {};
          expect(handleResponseSpy).toHaveBeenCalledWith(null, expectedResponse);
          server.stop();
        });

      });

      it('.handleResponse should store res', function(){
        var userModel = new UserModel();
        var expectedResponse = githubResponses.userGet;
        userModel.handleResponse(null, expectedResponse);
        expect(app.user).toBe(expectedResponse);
        expect(userModel.get('login')).toBe('USER');
      });
    });

  });

});
