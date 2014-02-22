/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'text!templates/quickfilter.html'
], function(Backbone, _, app, template){
  'use strict';

  var QuickFilter = Backbone.View.extend({
    el: '#quickReview',
    template: _.template(template),
    collection: null,
    repo: {
      id: null,
      name: ''
    },
    branch: {
      sha: null,
      name: ''
    },
    events: {
      'click .repoDropdown': 'selectRepo',
      'click .branchDropdown': 'selectBranch'
    },
    selectRepo: function(event){
      var target = $(event.target);
      this.repo.id = target.data('id');
      this.repo.name = target.data('name');
      this.branch = {
        sha: null,
        name: ''
      };
      this.render();
    },
    selectBranch: function(event){
      var target = $(event.target);
      this.branch.sha = target.data('sha');
      this.branch.name = target.data('name');
      this.render();
    },
    initialize: function(){
      this.collection = app.repoCollection;
    },
    serialize: function(branches){
      return {
        repos: this.collection.toJSON(),
        branches: branches,
        branch: this.branch,
        repo: this.repo,
        value: this.repo.name +'/'+ this.branch.name
      };
    },
    render: function(){
      if(!_.isNull(this.repo.id)){
        var repo = this.collection.findWhere({id: this.repo.id});
        repo.getBranches()
          .then(function(){
            var branches = repo.get('branches');
            if(branches.length === 1){
              this.branch.sha = branches[0].commit.sha;
              this.branch.name = branches[0].name;
            }
            this.$el.html(this.template(this.serialize(branches)));
          }.bind(this));
      } else {
        this.$el.html(this.template(this.serialize(null)));
      }
    }
  });

  return QuickFilter;
});