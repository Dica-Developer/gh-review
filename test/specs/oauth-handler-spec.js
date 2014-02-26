/*global define, describe, it, expect, beforeEach, afterEach, spyOn, localStorage*/
define(['app', 'OauthHandler', 'OAuth'], function (app, oauthHandler, OAuth) {
  'use strict';

  afterEach(function () {
    localStorage.clear();
    app.authenticated = false;
  });

  describe('#oauthHandler', function () {

    it('Should be defined', function () {
      expect(oauthHandler).toBeDefined();
    });

    it('.getAccessToken should call #OAuth.startAuthentication', function () {
      var oauthSpy = spyOn(OAuth.prototype, 'startAuthentication');
      oauthHandler.getAccessToken();
      expect(oauthSpy).toHaveBeenCalled();
    });

    it('.callback should call #OAuth.finishAuthentication', function () {
      var oauthSpy = spyOn(OAuth.prototype, 'finishAuthentication');
      oauthHandler.callback();
      expect(oauthSpy).toHaveBeenCalled();
    });

    describe('.accessTokenReceived', function () {
      /*jshint camelcase:false*/
      var fakeResponse = {
        access_token: '123test45'
      }, githubApiSpy = null, redirectSpy = null;

      beforeEach(function () {
        githubApiSpy = spyOn(app.github, 'authenticate');
        redirectSpy = spyOn(oauthHandler, 'redirectToRoot');
      });

      afterEach(function () {
        githubApiSpy = null;
        redirectSpy = null;
      });

      it('Should write accessToken to localStorage', function () {
        expect(localStorage.accessToken).not.toBeDefined();
        oauthHandler.accessTokenReceived(fakeResponse);
        expect(localStorage.accessToken).toBe('123test45');
      });

      it('Should set app.authenticated to true', function () {
        expect(app.authenticated).toBeFalsy();
        oauthHandler.accessTokenReceived(fakeResponse);
        expect(app.authenticated).toBeTruthy();
      });

      it('Should call github.authenticate', function () {
        oauthHandler.accessTokenReceived(fakeResponse);
        expect(githubApiSpy).toHaveBeenCalledWith({ type: 'token', token: '123test45' });
      });

      it('Should call .redirectToRoot', function () {
        oauthHandler.accessTokenReceived(fakeResponse);
        expect(redirectSpy).toHaveBeenCalled();
      });

    });

  });

});
