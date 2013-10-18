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
      'commit/:cid': 'showCommit'
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
      this.view = new ReviewDetailView({model: model});
    },
    showCommit: function(cid){
      this.clear();
      var model = commitCollection.get(cid);
      this.view = new CommentView({model: model});
    },
    clear: function () {
      if (this.view) {
        this.view.remove();
        $('<div id="main"></div>').appendTo('body');
      }
    },
    initialize: function(){
      Backbone.history.start();
    }
  });
  return new Router();
});
