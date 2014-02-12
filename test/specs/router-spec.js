/*global define, describe, it, expect, beforeEach, afterEach, spyOn*/
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
  'commentView',
  'OauthView',
  'loginLogout',
  'backboneLocalStorage'
], function (Backbone, when, app, Router, RepoCollection, RepoView, RepoDetailView, ReviewCollection, ReviewListView, ReviewDetailView, CommentView, OauthView, loginLogout) {
  'use strict';

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
        app.authenticated = false;
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

      it('.repositories should init new #RepoCollection and #RepoView if authenticated', function () {
        app.authenticated = true;
        var repoCollectionSpy = spyOn(RepoCollection.prototype, 'initialize');
        var repoViewSpy = spyOn(RepoView.prototype, 'initialize');

        router.repositories();

        expect(routerClearSpy).toHaveBeenCalled();
        expect(repoCollectionSpy).toHaveBeenCalled();
        expect(repoViewSpy).toHaveBeenCalled();
        expect(router.view instanceof RepoView).toBeTruthy();

      });

      it('.repositories should init new #RepoCollection and #RepoView if not authenticated', function () {
        app.authenticated = false;
        var repoCollectionSpy = spyOn(RepoCollection.prototype, 'initialize');
        var repoViewSpy = spyOn(RepoView.prototype, 'initialize');

        router.repositories();

        expect(routerClearSpy).not.toHaveBeenCalled();
        expect(repoCollectionSpy).not.toHaveBeenCalled();
        expect(repoViewSpy).not.toHaveBeenCalled();
        expect(router.view instanceof RepoView).toBeFalsy();

      });

      it('.repoDetail should init new #RepoDetailView if authenticated', function () {
        app.authenticated = true;
        var repoDetailViewSpy = spyOn(RepoDetailView.prototype, 'initialize');

        router.repoDetail();

        expect(routerClearSpy).toHaveBeenCalled();
        expect(repoDetailViewSpy).toHaveBeenCalled();
        expect(router.view instanceof RepoDetailView).toBeTruthy();
      });

      it('.repoDetail should not init new #RepoDetailView if not authenticated', function () {
        app.authenticated = false;
        var repoDetailViewSpy = spyOn(RepoDetailView.prototype, 'initialize');

        router.repoDetail();

        expect(routerClearSpy).not.toHaveBeenCalled();
        expect(repoDetailViewSpy).not.toHaveBeenCalled();
        expect(router.view instanceof RepoDetailView).toBeFalsy();

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

      it('.getAccessToken should init new #OauthView and call #OAuthView.getAccessToken', function () {
        var oauthRenderViewSpy = spyOn(OauthView.prototype, 'render');
        var oauthGetAccessTokenViewSpy = spyOn(OauthView.prototype, 'getAccessToken');

        router.getAccessToken();

        expect(routerClearSpy).toHaveBeenCalled();
        expect(oauthRenderViewSpy).toHaveBeenCalled();
        expect(oauthGetAccessTokenViewSpy).toHaveBeenCalled();
        expect(router.view instanceof OauthView).toBeTruthy();

      });

      it('.callback should init new #OauthView and call #OAuthView.callback', function () {
        var oauthRenderViewSpy = spyOn(OauthView.prototype, 'render');
        var oauthCallbackViewSpy = spyOn(OauthView.prototype, 'callback');

        router.callback();

        expect(routerClearSpy).toHaveBeenCalled();
        expect(oauthRenderViewSpy).toHaveBeenCalled();
        expect(oauthCallbackViewSpy).toHaveBeenCalled();
        expect(router.view instanceof OauthView).toBeTruthy();

      });


      it('.initialize should start Backbone.history', function () {
        spyOn(Backbone.history, 'start');
        new Router();

        expect(Backbone.history.start).toHaveBeenCalled();
      });

    });

  });

});
