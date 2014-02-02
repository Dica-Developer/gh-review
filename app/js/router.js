/*global define*/
define([
  'jquery',
  'backbone',
  'repoCollection',
  'repoView',
  'repoDetailView',
  'reviewCollection',
  'reviewListView',
  'reviewDetailView',
  'commitCollection',
  'commentView'
], function ($, Backbone, repoCollection, RepoView, RepoDetailView, reviewCollection, ReviewListView, ReviewDetailView, commitCollection, CommentView) {
  'use strict';

  var Router = Backbone.Router.extend({
    view: null,
    routes: {
      '': 'reviewList',
      'reviews': 'reviewList',
      'repositories': 'repositories',
      'repo/:id': 'repoDetail',
      'review/:id': 'reviewDetail',
      'commit/:id': 'showCommit'
    },
    reviewList: function () {
      this.clear();
      this.view = new ReviewListView();
    },
    repositories: function () {
      this.clear();
      this.trigger('ajaxIndicator', true);
      this.view = new RepoView();
    },
    repoDetail: function (id) {
      this.clear();
      this.trigger('ajaxIndicator', true);
      var model = repoCollection.get(id);
      this.view = new RepoDetailView({model: model});
    },
    reviewDetail: function (id) {
      this.clear();
      this.trigger('ajaxIndicator', true);
      var model = reviewCollection.get(id);
      this.view = new ReviewDetailView({model: model});
    },
    showCommit: function (id) {
      this.clear();
      this.trigger('ajaxIndicator', true);
      var model = commitCollection.get(id);
      this.view = new CommentView({model: model});
    },
    clear: function () {
      if (this.view) {
        this.view.remove();
        $('<div id="main"></div>').appendTo('body');
      }
    },
    initialize: function () {
      Backbone.history.start();
    }
  });
  return new Router();
});
