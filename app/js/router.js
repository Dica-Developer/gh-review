/*global define*/
define([
  'jquery',
  'backbone',
  'repoCollection',
  'repoView',
  'reviewCollection',
  'reviewListView',
  'reviewDetailView',
  'commitCollection',
  'commentView'
], function($, Backbone, repoCollection, RepoView, reviewCollection, ReviewListView, ReviewDetailView, commitCollection, CommentView){
  'use strict';

  var Router = Backbone.Router.extend({
    view: null,
    routes:{
      '': 'reviewList',
      'repo/:id': 'repoDetail',
      'review/:id': 'reviewDetail',
      'commit/:id/:user/:repo': 'showCommit'
    },
    reviewList: function(){
      this.clear();
      this.view = new ReviewListView();
    },
    repoDetail: function(id){
      var model = repoCollection.get(id);
      this.view = new RepoView({model: model});
    },
    reviewDetail: function(id){
      this.clear();
      var model = reviewCollection.get(id);
      console.log(model.toJSON());
      this.view = new ReviewDetailView({model: model});
    },
    showCommit: function(id, user, repo){
      this.clear();
      var model = commitCollection.get(id);
      model.set('user', user);
      model.set('repo', repo);
      this.view = new CommentView({model: model});
    },
    clear: function () {
      console.log('clear');
      if (this.view) {
        this.view.remove();
        $('<section id="main"></section>').appendTo('#container');
      }
    },
    initialize: function(){
      Backbone.history.start();
    }
  });
  return new Router();
});
