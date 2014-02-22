/*global define, describe, it, expect, spyOn, waitsFor, runs, afterEach, localStorage*/
define(['server', 'githubResponses', 'app', 'UserModel'], function(server, githubResponses, app, UserModel){
  'use strict';

  afterEach(function(){
    localStorage.clear();
    app.authenticated = false;
  });

  describe('OAuth', function(){

    it('Should be defined', function(){
      expect(UserModel).toBeDefined();
    });

    describe('new UserModel()', function(){
      it('.getUserData should request user data from github', function(){
        var githubGithubUserSpy = spyOn(app.github.user, 'get');
        var userModel = new UserModel();
        userModel.getUserData();
        expect(githubGithubUserSpy).toHaveBeenCalled();
      });

      it('After github api call handleResponse should be called', function(){
        server.githubUserGet();
        var userModel = new UserModel();
        userModel.getUserData();
        var handleResponseSpy = spyOn(userModel, 'handleResponse');
        userModel.getUserData();

        waitsFor(function(){
          return server.server.requests[0].readyState === 4;
        }, '', 500);

        runs(function(){
          var expectedResponse = githubResponses.userGet;
          expectedResponse.meta = {};
          expect(handleResponseSpy).toHaveBeenCalledWith(expectedResponse);
          server.stop();
        });

      });

      it('.handleResponse should store res', function(){
        var userModel = new UserModel();
        var expectedResponse = githubResponses.userGet;
        userModel.handleResponse(expectedResponse);
        expect(userModel.toJSON()).toEqual(expectedResponse);
        expect(userModel.get('login')).toBe('USER');
      });
    });

  });

});
