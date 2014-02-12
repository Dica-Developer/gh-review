/*global define, describe, it, expect, localStorage, beforeEach, afterEach, jasmine*/
define(['jquery', 'underscore', 'app', 'Router', 'bootstrap'], function ($, _, app, Router) {
  'use strict';

  describe('#GH-Review', function () {

    it('Should be defined', function () {
      expect(app).toBeDefined();
    });

    describe('.showIndicator', function () {
      var indicator = null,
        tmpApp = null;

      beforeEach(function () {
        tmpApp = _.extend({}, app);
        indicator = $('<div id="ajaxIndicator" class="modal fade"><div class="modal-dialog">' +
          '<div class="modal-content"><div class="modal-body"><p>Fetching results ... </p>' +
          '</div></div></div></div>');
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
      var tmpApp;
      var router = new Router();

      beforeEach(function () {
        tmpApp = _.extend({}, app);
      });

      afterEach(function () {
        tmpApp = null;
      });

      it('authenticate with already existing access token', function () {
        tmpApp.router = router;
        localStorage.accessToken = 'fdgdfgDFG';
        tmpApp.init();
        expect(tmpApp.authenticated).toBeTruthy();
      });

      it('not authenticated if no already existing access token', function () {
        tmpApp.router = router;
        localStorage.removeItem('accessToken');
        tmpApp.init();
        expect(tmpApp.authenticated).toBeFalsy();
      });
    });
  });
});