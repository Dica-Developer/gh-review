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
      'click li': 'showCommit'
    },
    initialize: function(){
      var _this = this;
      this.render();
      when(this.getCommits(),function(){
        _this.renderAllCommits();
      });
    },
    getCommits: function(){
      var defer = when.defer(),
        _this = this;
      app.github.repos.getCommits({
        user: _this.model.get('user'),
        repo: _this.model.get('repo'),
        sha: _this.model.get('branch')  // could be commit SHA or branch
      }, function(error, commits){
        _.forEach(commits, function(commit){
          commit.user = _this.model.get('user');
          commit.repo = _this.model.get('repo');
          var alreadyExist = commitCollection.where({
            user: commit.user,
            repo:commit.repo,
            sha: commit.sha
          });
          if(!alreadyExist.length){
            commitCollection.create(commit);
          }
        });
        defer.resolve();
      });
      return defer.promise;
    },
    renderOneCommit: function(commit){
      var view = new CommitListItemView({model: commit});
      this.$('#commitList').append(view.el);
    },
    renderAllCommits: function(){
      var commits = commitCollection.where({
        repo: this.model.get('repo'),
        user: this.model.get('user')
      });
      _.forEach(commits, function(commit){
        this.renderOneCommit(commit);
      },this);
    },
    showCommit: function(event){
      var modelId = $(event.target).data('modelid');
      var user = $(event.target).data('user');
      var repo = $(event.target).data('repo');
      app.router.navigate('commit/' + modelId + '/' + user + '/' + repo , {trigger: true});
    },
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }
  });

  return ReviewDetailView;
});
