/*global define, describe, it, expect, beforeEach, spyOn, afterEach, waitsFor, runs, jasmine, localStorage*/
define(['underscore', 'server', 'OAuth'], function (_, server, OAuth2) {
  'use strict';

  var oauthConfig = {
    clientId: '5082108e53d762d90c00',
    apiScope: 'user, repo',
    redirectUri: 'http://localhost:9000',
    accessTokenUrl: 'http://gh-review.herokuapp.com/bemdsvdsynggmvweibduvjcbgf'
  };

  afterEach(function () {
    localStorage.clear();
  });

  describe('OAuth', function () {
    var oauth = null, doRedirectSpy = null;

    //Need to setup this spy's every time to avoid page reloads while test running
    beforeEach(function () {
      oauth = new OAuth2(oauthConfig);
      doRedirectSpy = spyOn(OAuth2.prototype, 'doRedirect');
    });

    afterEach(function () {
      oauth = null;
    });

    it('Should be defined', function () {
      expect(OAuth2).toBeDefined();
    });

    it('Given options should be assigned to public member', function () {
      _.each(oauthConfig, function (value, key) {
        expect(oauth[key]).toBe(value);
      });
    });

    it('.startAuthentication should call .doRedirect', function () {
      oauth.startAuthentication();
      expect(doRedirectSpy).toHaveBeenCalledWith('https://github.com/login/oauth/authorize?client_id=5082108e53d762d90c00&redirect_uri=http://localhost:9000&scope=user, repo');
    });

    it('.authorizationCodeUrl should return correct url', function () {
      expect(oauth.authorizationCodeURL()).toBe('https://github.com/login/oauth/authorize?client_id=5082108e53d762d90c00&redirect_uri=http://localhost:9000&scope=user, repo');
    });

    it('.getAccessTokenUrl should return correct url', function () {
      expect(oauth.getAccessTokenURL()).toBe('http://gh-review.herokuapp.com/bemdsvdsynggmvweibduvjcbgf?client_id=5082108e53d762d90c00&code=undefined&scope=user, repo');
    });

    it('.parseAuthorizationCode should throw error if url has parameter "error"', function () {
      expect(function () {
        oauth.parseAuthorizationCode('http://nodomain.no?error=nodomain');
      }).toThrow(new Error('Error getting authorization code: nodomain'));
    });

    it('.parseAuthorizationCode should return correct code if url has "code" parameter', function () {
      expect(oauth.parseAuthorizationCode('http://nodomain.no?code=12test345')).toBe('12test345');
    });

    it('.finishAuthorization should do post call', function () {
      var callbackSpy = jasmine.createSpy();
      server.oauthTokenRequest();
      oauth.finishAuthentication(callbackSpy);

      waitsFor(function () {
        return server.server.requests[0].readyState === 4;
      });

      runs(function () {
        expect(server.server.requests[0].status).toBe(200);
        server.stop();
      });
    });

    it('.finishAuthorization should call callback if xhr.status === 200', function () {
      var callbackSpy = jasmine.createSpy();
      server.oauthTokenRequest();
      oauth.finishAuthentication(callbackSpy);

      waitsFor(function () {
        return server.server.requests[0].readyState === 4;
      });

      runs(function () {
        expect(server.server.requests[0].status).toBe(200);
        /*jshint camelcase:false*/
        expect(callbackSpy).toHaveBeenCalledWith({ access_token: 'e72e16c7e42f292c6912e7710c838347ae178b4a', scope: 'repo,gist', token_type: 'bearer' }, null);
        server.stop();
      });
    });

    it('.finishAuthorization should call callback with error if xhr.status !== 200', function () {
      var callbackSpy = jasmine.createSpy();
      server.oauthTokenRequestWithError();
      oauth.finishAuthentication(callbackSpy);

      waitsFor(function () {
        return server.server.requests[0].readyState === 4;
      });

      runs(function () {
        expect(server.server.requests[0].status).toBe(404);
        expect(callbackSpy).toHaveBeenCalledWith(null, { status: 404, message: 'Not found' });
        server.stop();
      });
    });

  });

});
