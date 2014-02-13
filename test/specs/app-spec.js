/*global define, describe, it, expect, localStorage, beforeEach, afterEach, jasmine*/
define(['jquery', 'underscore', 'app', 'Router', 'bootstrap'], function ($, _, app, Router) {
  'use strict';

  afterEach(function(){
    localStorage.clear();
    app.authenticated = false;
  });

  describe('#GH-Review', function () {

    it('Should be defined', function () {
      expect(app).toBeDefined();
    });

    describe('.showIndicator', function () {
      var indicator = null,
        tmpApp = null;

      beforeEach(function () {
        tmpApp = _.extend({}, app);
        indicator = $('<div id="ajaxIndicator" class="modal"> <div class="modal-dialog"> <div id="spinner" class="spinner">Loading ...</div> </div> </div>');
        tmpApp.ajaxIndicator = indicator.modal({
          backdrop: true,
          show: false,
          keyboard: false
        });
      });

      afterEach(function () {
        indicator.remove();
        tmpApp = null;
      });

      it('Should be hidden per default', function () {
        expect(indicator.is(':visible')).toBeFalsy();
      });

      it('Should be visible after 200ms timeout', function () {
        jasmine.Clock.useMock();
        tmpApp.showIndicator(true);
        expect(indicator.is(':visible')).toBeFalsy();
        jasmine.Clock.tick(100);
        expect(indicator.is(':visible')).toBeFalsy();
        jasmine.Clock.tick(250);
        expect(indicator.is(':visible')).toBeTruthy();
      });

      it('Should be closed if passing "false" and indicator is visible', function () {
        jasmine.Clock.useMock();
        tmpApp.showIndicator(true);
        expect(indicator.is(':visible')).toBeFalsy();
        jasmine.Clock.tick(100);
        expect(indicator.is(':visible')).toBeFalsy();
        jasmine.Clock.tick(250);
        expect(indicator.is(':visible')).toBeTruthy();
        tmpApp.showIndicator(false);
        jasmine.Clock.tick(300);
        expect(indicator.is(':visible')).toBeFalsy();
      });
    });

    describe('.init', function () {
      var tmpApp = null, router = null;

      beforeEach(function () {
        var TmpRouter = Router.extend({initialize: function(){}});
        router = new TmpRouter();
        tmpApp = _.extend({}, app);
      });

      afterEach(function () {
        tmpApp = null;
      });

      describe('existing access token', function(){
        it('authenticated', function () {
          tmpApp.router = router;
          localStorage.accessToken = 'fdgdfgDFG';
          tmpApp.init();
          expect(tmpApp.authenticated).toBeTruthy();
        });
      });

      describe('no access token', function(){
        it('not authenticated', function () {
          tmpApp.router = router;
          tmpApp.init();
          expect(tmpApp.authenticated).toBeFalsy();
        });
      });
    });
  });
});