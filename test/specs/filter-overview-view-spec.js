/*global define, describe, it, expect, spyOn, beforeEach, afterEach*/
define(['FilterOverview', 'app', 'QuickFilter', 'RepoCollection', 'FilterCollection', 'FilterListView'], function (FilterOverview, app, QuickFilter, RepoCollection, FilterCollection, FilterListView) {
  'use strict';

  describe('#FilterOverview', function () {
    it('Should be defined', function () {
      expect(FilterOverview).toBeDefined();
    });

    describe('.render', function () {

      beforeEach(function () {
        app.repoCollection = new RepoCollection();
        app.filterCollection = new FilterCollection();
      });

      afterEach(function () {
        app.repoCollection = null;
      });

      it('Should initiate new #QuickFilter and call #QuickFilter.render', function () {
        var quickFilterInitSpy = spyOn(QuickFilter.prototype, 'initialize').andCallThrough();
        var quickFilterRenderSpy = spyOn(QuickFilter.prototype, 'render');

        var filterOverview = new FilterOverview();
        filterOverview.render();

        expect(quickFilterInitSpy).toHaveBeenCalled();
        expect(quickFilterRenderSpy).toHaveBeenCalled();
      });

      it('Should initiate new #FilterListView and call #FilterListView.render and #FilterListView.fetchReviews', function () {
        var filterListInitSpy = spyOn(FilterListView.prototype, 'initialize').andCallThrough();
        var filterListRenderSpy = spyOn(FilterListView.prototype, 'render');
        var filterListFetchReviewsSpy = spyOn(FilterListView.prototype, 'fetchReviews');

        var filterOverview = new FilterOverview();
        filterOverview.render();

        expect(filterListInitSpy).toHaveBeenCalled();
        expect(filterListRenderSpy).toHaveBeenCalled();
        expect(filterListFetchReviewsSpy).toHaveBeenCalled();
      });

    });

  });

});
