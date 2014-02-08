/*global define, describe, it, expect, spyOn, localStorage, beforeEach, afterEach*/
define(['underscore', 'app', 'GitHub', 'OAuth'], function(_, app, GitHub, OAuth){
  'use strict';

  describe('#GH-Review', function(){

    it('Should be defined', function(){
      expect(app).toBeDefined();
    });

    it('Should call #GH-Review.authenticate if localStorage "inAuthorizationProcess" is present', function(){
      var tmpApp = _.extend({}, app);
      var authenticateSpy = spyOn(tmpApp, 'authenticate');
      localStorage.inAuthorizationProcess = true;
      tmpApp.init();
      localStorage.removeItem('inAuthorizationProcess');
      expect(authenticateSpy).toHaveBeenCalled();
    });

    describe('‘GH-Review.authenticate', function(){

      var tmpApp = null;

      beforeEach(function(){
        tmpApp = _.extend({}, app);
      });

      afterEach(function(){
        tmpApp = null;
      });

      it('Should request oauth token', function(){
        var doRedirectSpy = spyOn(OAuth.prototype, 'doRedirect');
        tmpApp.authenticate();
        expect(doRedirectSpy).toHaveBeenCalled();
      });

      it('Should override .onAccessTokenReceived', function(){
        spyOn(OAuth.prototype, 'doRedirect');
        tmpApp.authenticate();
        expect(tmpApp.oauth.onAccessTokenReceived).not.toEqual(OAuth.prototype.onAccessTokenReceived);
      });

      it('#GH-Review.ouath should be instance of OAuth', function(){
        spyOn(OAuth.prototype, 'doRedirect');
        tmpApp.authenticate();
        expect(tmpApp.oauth instanceof OAuth).toBeTruthy();
      });

      describe('#OAuth.onAccessTokenReceived', function(){

        var tmpApp = null;

        beforeEach(function(){
          tmpApp = _.extend({}, app);
        });

        afterEach(function(){
          tmpApp = null;
        });

        it('Should call #GitHub.authenticate', function(){
          var authenticateSpy = spyOn(GitHub.prototype, 'authenticate');
          spyOn(OAuth.prototype, 'doRedirect');
          tmpApp.authenticate();
          tmpApp.oauth.accessToken = 'testToken';
          tmpApp.oauth.onAccessTokenReceived();
          expect(authenticateSpy).toHaveBeenCalledWith({ type : 'token', token : 'testToken' });
        });

        it('Should set #GH-Review.authenticated to true', function(){
          spyOn(GitHub.prototype, 'authenticate');
          spyOn(OAuth.prototype, 'doRedirect');
          tmpApp.authenticate();
          tmpApp.oauth.onAccessTokenReceived();
          expect(tmpApp.authenticated).toBeTruthy();
        });

      });

    });

  });

});
