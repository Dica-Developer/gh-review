/*global define, describe, it, expect, spyOn, localStorage, afterEach*/
define(['app', 'Router', 'loginLogout'], function (app, Router, loginLogout) {
  'use strict';

  afterEach(function () {
    localStorage.clear();
    app.authenticated = false;
  });

  describe('#loginLogout', function () {

    it('#loginLogout should be defined', function () {
      expect(loginLogout).toBeDefined();
    });

    it('.login should navigate to ‘/oauth/accesstoken', function () {
      var TmpRouter = Router.extend({initialize: function () {
      }});
      app.router = new TmpRouter();
      var routerSpy = spyOn(app.router, 'navigate');
      loginLogout.login();
      expect(routerSpy).toHaveBeenCalledWith('#oauth/accesstoken', { trigger: true });
    });

    it('.logout should remove access token form localStorage and call doRedirect', function () {
      var redirectSpy = spyOn(loginLogout, 'redirectToRoot');
      localStorage.accessToken = '12345';
      loginLogout.logout();
      expect(localStorage.accessToken).not.toBeDefined();
      expect(redirectSpy).toHaveBeenCalledWith();
    });

  });

});
