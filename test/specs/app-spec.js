/*global define, describe, it, expect, spyOn, localStorage, beforeEach, afterEach, jasmine*/
define(['jquery', 'underscore', 'app', 'GitHub', 'OAuth', 'bootstrap'], function($, _, app, GitHub, OAuth){
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

    describe('.showIndicator', function(){
      var indicator = null, tmpApp = null;

      beforeEach(function(){
        tmpApp = _.extend({}, app);
        indicator = $('<div id="ajaxIndicator" class="modal fade"><div class="modal-dialog">'+
          '<div class="modal-content"><div class="modal-body"><p>Fetching results ... </p>' +
          '</div></div></div></div>');
        tmpApp.ajaxIndicator = indicator.modal({
          backdrop: true,
          show: false,
          keyboard: false
        });
      });

      afterEach(function(){
        indicator.remove();
        tmpApp = null;
      });

      it('Should be hidden per default', function(){
        expect(indicator.is(':visible')).toBeFalsy();
      });

      it('Should be visible after 700ms timeout', function(){
        jasmine.Clock.useMock();
        tmpApp.showIndicator(true);
        expect(indicator.is(':visible')).toBeFalsy();
        jasmine.Clock.tick(500);
        expect(indicator.is(':visible')).toBeFalsy();
        jasmine.Clock.tick(701);
        expect(indicator.is(':visible')).toBeTruthy();
      });

      it('Should be closed if passing "false" and indicator is visible', function(){
        jasmine.Clock.useMock();
        tmpApp.showIndicator(true);
        expect(indicator.is(':visible')).toBeFalsy();
        jasmine.Clock.tick(500);
        expect(indicator.is(':visible')).toBeFalsy();
        jasmine.Clock.tick(701);
        expect(indicator.is(':visible')).toBeTruthy();
        tmpApp.showIndicator(false);
        jasmine.Clock.tick(720);
        expect(indicator.is(':visible')).toBeFalsy();
      });

    });

  });

});
