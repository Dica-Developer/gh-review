/*global define*/
define([
  'jquery',
  'backbone',
  'app',
  'RepoCollection',
  'repoView',
  'repoDetailView',
  'reviewCollection',
  'reviewListView',
  'reviewDetailView',
  'commitCollection',
  'commentView',
  'OauthView',
  'LoginView'
], function ($, Backbone, app, RepoCollection, RepoView, RepoDetailView, reviewCollection, ReviewListView, ReviewDetailView, commitCollection, CommentView, OauthView, LoginView) {
  'use strict';

  var repoCollection = null;

  var Router = Backbone.Router.extend({
    view: null,
    routes: {
      '': 'root',
      'reviews': 'reviewList',
      'repositories': 'repositories',
      'repo/:id': 'repoDetail',
      'review/:id': 'reviewDetail',
      'commit/:id': 'showCommit',
      'login': 'login',
      'oauth/accesstoken': 'getAccessToken',
      'oauth/callback': 'callback'
    },
    reviewList: function () {
      this.clear();
      this.view = new ReviewListView();
      this.view.render();
      this.view.fetchReviews();
      $('li[name="ghr-top-menu-links"]').removeClass('active');
      $('#reviewLink').addClass('active');
    },
    repositories: function () {
      if (app.authenticated) {
        this.clear();
        this.trigger('ajaxIndicator', true);
        repoCollection = new RepoCollection();
        this.view = new RepoView({
          collection: repoCollection
        });
        $('li[name="ghr-top-menu-links"]').removeClass('active');
        $('#repositoryLink').addClass('active');
      }
    },
    repoDetail: function (id) {
      if (app.authenticated) {
        this.clear();
        this.trigger('ajaxIndicator', true);
        var model = repoCollection.get(id);
        this.view = new RepoDetailView({
          model: model
        });
        $('li[name="ghr-top-menu-links"]').removeClass('active');
        $('#repositoryLink').addClass('active');
      }
    },
    reviewDetail: function (id) {
      this.clear();
      this.trigger('ajaxIndicator', true);
      var model = reviewCollection.get(id);
      this.view = new ReviewDetailView({
        model: model
      });
      this.view.getCommits()
        .then(function () {
          this.view.render();
          this.view.renderAllCommits();
        }.bind(this));
      $('li[name="ghr-top-menu-links"]').removeClass('active');
      $('#reviewLink').addClass('active');
    },
    showCommit: function (id) {
      this.clear();
      this.trigger('ajaxIndicator', true);
      var model = commitCollection.get(id);
      this.view = new CommentView({
        model: model
      });
      this.view.getDiffAndComments()
        .then(this.view.render.bind(this.view));
    },
    clear: function () {
      if (this.view) {
        this.view.remove();
        $('<div id="main" class="container"></div>').appendTo('body');
      }
    },
    initialize: function () {
      Backbone.history.start();
    },
    login: function () {
      this.clear();
      this.view = new LoginView();
    },
    getAccessToken: function () {
      this.clear();
      this.view = new OauthView();
      this.view.getAccessToken();
    },
    callback: function () {
      // TODO currently handled by root non authenticated case
      this.clear();
      this.view = new OauthView();
      this.view.callback();
    },
    root: function () {
      var url = window.location.href;
      var error = url.match(/[&\?]error=([^&]+)/);
      var code = url.match(/[&\?]code=([\w\/\-]+)/);
      if (!app.authenticated && (error || code)) {
        this.view = new OauthView();
        this.view.callback();
      }
    }
  });
  return Router;
});