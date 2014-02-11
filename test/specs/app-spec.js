/*global define, describe, it, expect, spyOn, localStorage, beforeEach, afterEach, jasmine*/
define(['jquery', 'underscore', 'app', 'bootstrap'], function ($, _, app) {
  'use strict';

  describe('#GH-Review', function () {

    it('Should be defined', function () {
      expect(app).toBeDefined();
    });

    it('Should call #GH-Review.authenticate if localStorage "inAuthorizationProcess" is present', function () {
      var tmpApp = _.extend({}, app);
      var authenticateSpy = spyOn(tmpApp, 'authenticate');
      localStorage.inAuthorizationProcess = true;
      tmpApp.init();
      localStorage.removeItem('inAuthorizationProcess');
      expect(authenticateSpy).toHaveBeenCalled();
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

      it('Should be visible after 700ms timeout', function () {
        jasmine.Clock.useMock();
        tmpApp.showIndicator(true);
        expect(indicator.is(':visible')).toBeFalsy();
        jasmine.Clock.tick(500);
        expect(indicator.is(':visible')).toBeFalsy();
        jasmine.Clock.tick(701);
        expect(indicator.is(':visible')).toBeTruthy();
      });

      it('Should be closed if passing "false" and indicator is visible', function () {
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