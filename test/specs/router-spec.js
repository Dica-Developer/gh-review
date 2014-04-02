/*global define, describe, it, expect, beforeEach, afterEach, spyOn, localStorage, xit*/
define(function (require) {
  'use strict';

  var Backbone = require('backbone');
  var when = require('when');
  var app = require('app');
  var Router = require('Router');
  var FilterOverview = require('FilterOverview');
  var CommentView = require('CommentView');
  var oauthHandler = require('OauthHandler');
  var loginLogout = require('loginLogout');
  var WhoAmI = require('WhoAmI');

  require('backboneLocalStorage');

  afterEach(function () {
    localStorage.clear();
    app.authenticated = false;
  });

  describe('#Router', function () {
    it('Should be defined', function () {
      expect(Router).toBeDefined();
    });

    describe('methods', function () {

      var router = null,
        routerClearSpy = null;

      beforeEach(function () {
        var TmpRouter = Router.extend({
          initialize: function () {
          }
        });
        router = new TmpRouter();
        routerClearSpy = spyOn(router, 'clear').andCallThrough();
      });

      afterEach(function () {
        router = null;
        routerClearSpy = null;
      });

      it('.filter should init new #FilterOverview', function () {
        var filterOverviewSpy = spyOn(FilterOverview.prototype, 'initialize');
        spyOn(FilterOverview.prototype, 'render');
        router.filter();

        expect(routerClearSpy).toHaveBeenCalled();
        expect(filterOverviewSpy).toHaveBeenCalled();
        expect(router.view instanceof FilterOverview).toBeTruthy();

      });

      //disabled until the commit view w/o filter is up again
      xit('.showCommit should init new #CommentView', function () {
        var commentViewSpy = spyOn(CommentView.prototype, 'initialize');
        var getDiffAndCommentsSpy = spyOn(CommentView.prototype, 'getDiffAndComments').andReturn(
          when.promise(function (resolve) {
            resolve();
          })
        );
        var renderSpy = spyOn(CommentView.prototype, 'render');

        router.showCommit();

        expect(routerClearSpy).toHaveBeenCalled();
        expect(commentViewSpy).toHaveBeenCalled();
        expect(getDiffAndCommentsSpy).toHaveBeenCalled();
        //TODO strange behavior here actually it is called but the spy returns no. Needs further investigation
        expect(renderSpy).not.toHaveBeenCalled();
        expect(router.view instanceof CommentView).toBeTruthy();
      });

      it('.clear should remove view if present', function () {
        $('<div id="main"><p>here</p></div>').appendTo('body');
        var View = Backbone.View.extend();
        router.view = new View();
        router.clear();
        expect($('#main').find('p').length).toBe(0);
      });

      xit('.login should init new #loginLogout', function () {
        var loginViewSpy = spyOn(loginLogout.prototype, 'initialize');

        router.login();

        expect(routerClearSpy).toHaveBeenCalled();
        expect(loginViewSpy).toHaveBeenCalled();
        expect(router.view instanceof loginLogout).toBeTruthy();

      });

      it('.getAccessToken should call #OAuthHandler.getAccessToken', function () {
        var oauthGetAccessTokenSpy = spyOn(oauthHandler, 'getAccessToken');

        router.getAccessToken();

        expect(routerClearSpy).toHaveBeenCalled();
        expect(oauthGetAccessTokenSpy).toHaveBeenCalled();
      });

      it('.callback should call #OAuthHandler.callback', function () {
        var oauthCallbackSpy = spyOn(oauthHandler, 'callback');

        router.callback();

        expect(routerClearSpy).toHaveBeenCalled();
        expect(oauthCallbackSpy).toHaveBeenCalled();

      });

      it('.whoami should call new #WhoAmI', function () {
        var whoAmISpy = spyOn(WhoAmI.prototype, 'initialize');

        router.whoami();

        expect(routerClearSpy).toHaveBeenCalled();
        expect(whoAmISpy).toHaveBeenCalled();

      });

    });

  });

});
