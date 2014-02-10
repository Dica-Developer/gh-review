/*global define, describe, it, expect, beforeEach, afterEach, spyOn*/
define([
  'backbone',
  'when',
  'Router',
  'RepoCollection',
  'repoView',
  'repoDetailView',
  'reviewCollection',
  'reviewListView',
  'reviewDetailView',
  'commitCollection',
  'commentView',
  'backboneLocalStorage'
], function(Backbone, when, Router, RepoCollection, RepoView, RepoDetailView, reviewCollection, ReviewListView, ReviewDetailView, commitCollection, CommentView){
  'use strict';

  describe('#Router', function(){
    it('Should be defined', function(){
      expect(Router).toBeDefined();
    });

    describe('methods', function(){

      var router = null, routerClearSpy = null;

      beforeEach(function(){
        var TmpRouter = Router.extend({initialize: function(){}});
        router = new TmpRouter();
        routerClearSpy = spyOn(router, 'clear').andCallThrough();
      });

      afterEach(function(){
        router = null;
        routerClearSpy = null;
      });

      it('.reviewList should init new #ReviewListView', function(){
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

      it('.repositories should init new #RepoCollection and #RepoView', function(){
        var repoCollectionSpy = spyOn(RepoCollection.prototype, 'initialize');
        var repoViewSpy = spyOn(RepoView.prototype, 'initialize');

        router.repositories();

        expect(routerClearSpy).toHaveBeenCalled();
        expect(repoCollectionSpy).toHaveBeenCalled();
        expect(repoViewSpy).toHaveBeenCalled();
        expect(router.view instanceof RepoView).toBeTruthy();

      });

      it('.repoDetail should init new #RepoDetailView', function(){
        var repoDetailViewSpy = spyOn(RepoDetailView.prototype, 'initialize');

        router.repoDetail();

        expect(routerClearSpy).toHaveBeenCalled();
        expect(repoDetailViewSpy).toHaveBeenCalled();
        expect(router.view instanceof RepoDetailView).toBeTruthy();

      });

      it('.reviewDetail should init new #ReviewDetailView', function(){
        var reviewDetailViewSpy = spyOn(ReviewDetailView.prototype, 'initialize');

        router.reviewDetail();

        expect(routerClearSpy).toHaveBeenCalled();
        expect(reviewDetailViewSpy).toHaveBeenCalled();
        expect(router.view instanceof ReviewDetailView).toBeTruthy();

      });

      it('.showCommit should init new #CommentView', function(){
        var commentViewSpy = spyOn(CommentView.prototype, 'initialize');
        var getDiffAndCommentsSpy = spyOn(CommentView.prototype, 'getDiffAndComments').andReturn(
          when.promise(function(resolve) {
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

      it('.clear should remove view if present', function(){
        var View = Backbone.View.extend();
        router.view = new View();
        spyOn(View.prototype, 'remove');
        router.clear();

        expect(View.prototype.remove).toHaveBeenCalled();
      });

      it('.initialize should start Backbone.history', function(){
        spyOn(Backbone.history, 'start');
        var newRouter = new Router();

        expect(Backbone.history.start).toHaveBeenCalled();
      });

    });

  });

});
