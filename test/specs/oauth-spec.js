/*global define, describe, it, expect, beforeEach, spyOn, waitsFor, runs, sinon, localStorage, jasmine*/
define(['underscore', 'server', 'OAuth'], function(_, server, OAuth2){
  'use strict';

  var oauthConfig = {
    clientId: '5082108e53d762d90c00',
    apiScope: 'user, repo',
    redirectUri: 'http://localhost:9000',
    accessTokenUrl: 'http://gh-review.herokuapp.com/bemdsvdsynggmvweibduvjcbgf'
  };

  describe('OAuth', function(){
    var getAuthorizationCodeSpy = null, setAccessTokenSpy = null;

    //Need to setup this spy's every time to avoid page reloads while test running
    beforeEach(function(){
      getAuthorizationCodeSpy = spyOn(OAuth2.prototype, 'getAuthorizationCode');
      setAccessTokenSpy = spyOn(OAuth2.prototype, 'setAccessToken');
    });

    it('Should be defined', function(){
      expect(OAuth2).toBeDefined();
    });

    it('Given options should be assigned to public member', function(){
      var oauth = new OAuth2(oauthConfig);
      _.each(oauthConfig, function(value, key){
        expect(oauth[key]).toBe(value);
      });
    });

    it('.parseAuthorizationCode should be called on initialization', function(){
      var parseAuthorizationCodeSpy = spyOn(OAuth2.prototype, 'parseAuthorizationCode');
      new OAuth2(oauthConfig);
      expect(parseAuthorizationCodeSpy).toHaveBeenCalled();
    });

    it('If no access token is present and no "code" string in url .getAuthorizationCode should be called', function(){
      new OAuth2(oauthConfig);
      expect(getAuthorizationCodeSpy).toHaveBeenCalled();
    });

    it('If no access token is present but a "code" string in url .finishAuthorization should be called', function(){
      spyOn(OAuth2.prototype, 'parseAuthorizationCode').andReturn('123test45');
      var finishAuthorizationSpy = spyOn(OAuth2.prototype, 'finishAuthorization');
      new OAuth2(oauthConfig);
      expect(finishAuthorizationSpy).toHaveBeenCalled();
    });

    it('.getAccessTokenURL should return correct url', function(){
      spyOn(OAuth2.prototype, 'parseAuthorizationCode').andReturn('123test45');
      spyOn(OAuth2.prototype, 'finishAuthorization');
      var oauth = new OAuth2(oauthConfig);
      expect(oauth.getAccessTokenURL('123test45')).toBe('http://gh-review.herokuapp.com/bemdsvdsynggmvweibduvjcbgf?client_id=5082108e53d762d90c00&code=123test45&scope=user, repo');
    });

    it('.authorizationCodeURL should return correct url', function(){
      spyOn(OAuth2.prototype, 'parseAuthorizationCode').andReturn('123test45');
      spyOn(OAuth2.prototype, 'finishAuthorization');
      var oauth = new OAuth2(oauthConfig);
      expect(oauth.authorizationCodeURL()).toBe('https://github.com/login/oauth/authorize?client_id=5082108e53d762d90c00&redirect_uri=http://localhost:9000&scope=user, repo');
    });

    it('.parseAuthorizationCode should throw error if url parameter "error" is present', function(){
      var tmpSpy = sinon.stub(OAuth2.prototype, 'parseAuthorizationCode');
      tmpSpy.returns('123test45');
      spyOn(OAuth2.prototype, 'finishAuthorization');
      var oauth = new OAuth2(oauthConfig);
      tmpSpy.restore();
      var thrown = function(){
        return oauth.parseAuthorizationCode('http://fake.de/fake?error=123test45');
      };
      expect(thrown).toThrow();
    });

    it('.parseAuthorizationCode should return correct code if url parameter "code" is present', function(){
      var tmpSpy = sinon.stub(OAuth2.prototype, 'parseAuthorizationCode');
      tmpSpy.returns('123test45');
      spyOn(OAuth2.prototype, 'finishAuthorization');
      var oauth = new OAuth2(oauthConfig);
      tmpSpy.restore();
      expect(oauth.parseAuthorizationCode('http://fake.de/fake?code=123test45')).toBe('123test45');
    });

    it('.finishAuthorization should make ajax request to get token', function(){
      server.oauthTokenRequest();
      spyOn(OAuth2.prototype, 'parseAuthorizationCode').andReturn('123test45');
      new OAuth2(oauthConfig);
      var request = server.server.requests;
      expect(request.length).toBe(1);
      expect(request[0].url).toMatch(server.urls.oauthTokenRequestUrl());
      server.stop();
    });

    it('.finishAuthorization should call .setAccessToken after successfully request', function(){
      server.oauthTokenRequest();
      spyOn(OAuth2.prototype, 'parseAuthorizationCode').andReturn('123test45');
      new OAuth2(oauthConfig);

      waitsFor(function(){
        return server.server.requests[0].readyState === 4;
      }, '', 50);

      runs(function(){
        expect(setAccessTokenSpy).toHaveBeenCalled();
        server.stop();
      });

    });

    it('.onAccessTokenReceived should called if access token is present', function(){
      jasmine.Clock.useMock();
      localStorage.ghreviewAccessToken = '123test45';
      var oauth = new OAuth2(oauthConfig);
      var onAccessTokenReceivedSpy = spyOn(oauth, 'onAccessTokenReceived');

      expect(onAccessTokenReceivedSpy).not.toHaveBeenCalled();
      jasmine.Clock.tick(501);
      expect(onAccessTokenReceivedSpy).toHaveBeenCalled();

    });
  });

});
