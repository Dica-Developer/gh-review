/*global define, describe, it, expect, spyOn, waitsFor, runs*/
define(['server', 'githubResponses', 'app', 'userModel'], function(server, githubResponses, app, UserModel){
  'use strict';

  describe('OAuth', function(){

    it('Should be defined', function(){
      expect(UserModel).toBeDefined();
    });

    describe('new UserModel()', function(){

      it('Should not call github api until app triggers ready event', function(){
        var githubUserGetSpy = spyOn(app.github.user, 'get');
        new UserModel();
        expect(githubUserGetSpy).not.toHaveBeenCalled();
      });

      it('Should call github api if app triggers ready event', function(){
        var githubGithubUserSpy = spyOn(app.github.user, 'get');
        new UserModel();
        app.trigger('ready');
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
