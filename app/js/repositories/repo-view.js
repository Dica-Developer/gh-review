/*global define*/
define([
  'backbone',
  'underscore',
  'when',
  'reviewCollection',
  'text!../templates/repo-view.html'
], function(Backbone, _, when, reviewCollection, template){
  'use strict';

  var RepoView = Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    initialize: function(){
      var _this = this;
      when.all(this.getFurtherInformations(), function(){
        _this.render();
      });
    },
    events: {
      'click #addReview': 'addReview',
      'change #branchList': 'storeBranch',
      'change #contributorsList': 'storeContributor'
    },
    storeBranch: function(event){
      this.branch = $(event.target).val();
    },
    storeContributor: function(event){
      this.contributor = $(event.target).val();
    },
    addReview: function(){
      reviewCollection.create({
        user: this.model.get('owner').login,
        repo: this.model.get('name'),
        branch: this.branch,
        contributor: this.contributor
      });
    },
    getFurtherInformations: function(){
      var promises = [];
      promises.push(this.model.getBranches());
      promises.push(this.model.getContributors());
      return promises;
    },
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }
  });

  return RepoView;
});
