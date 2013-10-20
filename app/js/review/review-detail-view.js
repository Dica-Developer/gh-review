/*global define*/
define([
  'backbone',
  'app',
  'underscore',
  'when',
  'commitCollection',
  'commitListItemView',
  'text!../templates/review-detail.html'
], function(Backbone, app, _, when, commitCollection, CommitListItemView, template){
  'use strict';
  var ReviewDetailView = Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    events: {
      'click .previous': 'getPreviousPage',
      'click .next': 'getNextPage',
      'click .first': 'getFirstPage'
    },
    initialize: function(){
      app.currentReviewData = {
        user: this.model.get('user'),
        repo: this.model.get('repo'),
        branch: this.model.get('branch')
      };
      this.getCommits();
    },
    storeMetaToModel: function (commits) {
      this.model.set('hasNext', app.github.hasNextPage(commits.meta.link));
      this.model.set('hasPrevious', app.github.hasPreviousPage(commits.meta.link));
      this.model.set('hasFirst', app.github.hasFirstPage(commits.meta.link));
      this.model.set('currentLink', commits.meta.link);
    },
    getCommits: function(){
      var _this = this;
      app.github.repos.getCommits(app.currentReviewData, function(error, commits){
        if(!error){
          _this.storeMetaToModel(commits);
          commitCollection.reset(commits);
          _this.render();
          _this.renderAllCommits();
        }
      });
    },
    getPreviousPage: function(){
      var _this = this;
      app.github.getPreviousPage(this.model.get('currentLink'), function(error, commits){
        if(!error){
          _this.storeMetaToModel(commits);
          commitCollection.reset(commits);
          _this.render();
          _this.renderAllCommits();
        }
      });
    },
    getNextPage: function(){
      var _this = this;
      app.github.getNextPage(this.model.get('currentLink'), function(error, commits){
        if(!error){
          _this.storeMetaToModel(commits);
          commitCollection.reset(commits);
          _this.render();
          _this.renderAllCommits();
        }
      });
    },
    getFirstPage: function(){
      var _this = this;
      app.github.getFirstPage(this.model.get('currentLink'), function(error, commits){
        if(!error){
          _this.storeMetaToModel(commits);
          commitCollection.reset(commits);
          _this.render();
          _this.renderAllCommits();
        }
      });
    },
    renderOneCommit: function(commit){
      var view = new CommitListItemView({model: commit});
      this.$('#commitList').append(view.render());
    },
    renderAllCommits: function(){
      commitCollection.each(function(commit){
        this.renderOneCommit(commit);
      },this);
    },
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }
  });

  return ReviewDetailView;
});
