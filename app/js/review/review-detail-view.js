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
    initialize: function(){
      var _this = this;
      app.currentReviewData = {
        user: this.model.get('user'),
        repo: this.model.get('repo'),
        branch: this.model.get('branch')
      };
      this.render();
      when(this.getCommits(),function(){
        _this.renderAllCommits();
      });
    },
    getCommits: function(){
      var defer = when.defer();
      app.github.repos.getCommits(app.currentReviewData, function(error, commits){
        if(!error){
          commitCollection.reset(commits);
          defer.resolve();
        }
      });
      return defer.promise;
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
