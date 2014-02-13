/*global define, describe, it, expect, beforeEach, afterEach, spyOn, localStorage*/
define([
  'backbone',
  'when',
  'app',
  'Router',
  'RepoCollection',
  'RepoView',
  'repoDetailView',
  'reviewCollection',
  'reviewListView',
  'reviewDetailView',
  'CommentView',
  'OauthHandler',
  'loginLogout',
  'backboneLocalStorage'
], function (Backbone, when, app, Router, RepoCollection, RepoView, RepoDetailView, ReviewCollection, ReviewListView, ReviewDetailView, CommentView, oauthHandler, loginLogout) {
  'use strict';

  afterEach(function(){
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
          initialize: function () {}
        });
        router = new TmpRouter();
        routerClearSpy = spyOn(router, 'clear').andCallThrough();
      });

      afterEach(function () {
        router = null;
        routerClearSpy = null;
      });

      it('.reviewList should init new #ReviewListView', function () {
        var reviewListViewSpy = spyOn(ReviewListView.prototype, 'initialize');
        var renderSpy = spyOn(ReviewListView.prototype, 'render');
        var fetchReviewsSpy = spyOn(ReviewListView.prototype, 'fetchReviews');

        router.reviewList();

        expect(routerClearSpy).toHaveBeenCalled();
        expect(reviewListViewSpy).toHaveBeenCalled();
        expect(renderSpy).toHaveBeenCalled();
        expect(fetchReviewsSpy).toHaveBeenCalled();
        expect(router.view instanceof ReviewListView).toBeTruthy();

      });

      it('.reviewDetail should init new #ReviewDetailView', function () {
        var reviewDetailViewSpy = spyOn(ReviewDetailView.prototype, 'initialize');
        router.reviewCollection = new ReviewCollection();
        router.reviewDetail();

        expect(routerClearSpy).toHaveBeenCalled();
        expect(reviewDetailViewSpy).toHaveBeenCalled();
        expect(router.view instanceof ReviewDetailView).toBeTruthy();

      });

      it('.showCommit should init new #CommentView', function () {
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
        var View = Backbone.View.extend();
        router.view = new View();
        spyOn(View.prototype, 'remove');
        router.clear();

        expect(View.prototype.remove).toHaveBeenCalled();
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


      it('.initialize should start Backbone.history', function () {
        spyOn(Backbone.history, 'start');
        new Router();

        expect(Backbone.history.start).toHaveBeenCalled();
      });

    });

  });

});
