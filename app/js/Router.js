/*global define*/
define([
  'jquery',
  'backbone',
  'RepoCollection',
  'repoView',
  'repoDetailView',
  'reviewCollection',
  'reviewListView',
  'reviewDetailView',
  'commitCollection',
  'commentView'
], function ($, Backbone, RepoCollection, RepoView, RepoDetailView, reviewCollection, ReviewListView, ReviewDetailView, commitCollection, CommentView) {
  'use strict';

  var repoCollection = null;

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
      this.view.render();
      this.view.fetchReviews();
    },
    repositories: function () {
      this.clear();
      this.trigger('ajaxIndicator', true);
      repoCollection = new RepoCollection();
      this.view = new RepoView({collection: repoCollection});
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
      this.view.getCommits()
        .then(function(){
          this.view.render();
          this.view.renderAllCommits();
        }.bind(this));
    },
    showCommit: function (id) {
      this.clear();
      this.trigger('ajaxIndicator', true);
      var model = commitCollection.get(id);
      this.view = new CommentView({model: model});
      this.view.getDiffAndComments()
        .then(this.view.render.bind(this.view));
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
  return Router;
});
