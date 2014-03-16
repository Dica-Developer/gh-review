/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'text!templates/quickfilter.html'
], function (Backbone, _, app, template) {
  'use strict';

  return Backbone.View.extend({
    el: '#quickReview',
    template: _.template(template),
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
      'click .branchDropdown': 'selectBranch',
      'click #quickFilterButton': 'findCommit',
      'keypress #quickFilterValue': 'findCommitKeyHandler'
    },
    findCommitKeyHandler: function (event) {
      if (13 === event.keyCode) {
        this.findCommit();
      }
    },
    findCommit: function () {
      var filterValue = $('#quickFilterValue').val();
      app.router.navigate('commit/' + encodeURIComponent(this.repo.owner) + '/' + encodeURIComponent(this.repo.name) + '/' + encodeURIComponent(filterValue), {
        trigger: true
      });
    },
    selectRepo: function (event) {
      var target = $(event.target);
      this.repo.id = target.data('id');
      this.repo.name = target.data('name');
      this.repo.owner = target.data('owner');
      this.branch = {
        sha: null,
        name: ''
      };
      this.render();
    },
    selectBranch: function (event) {
      var target = $(event.target);
      this.branch.sha = target.data('sha');
      this.branch.name = target.data('name');
      this.render();
    },
    initialize: function () {},
    serialize: function (branches) {
      return {
        repos: app.repoCollection.toJSONSortedByName(),
        branches: branches,
        branch: this.branch,
        repo: this.repo
      };
    },
    render: function () {
      if (!_.isNull(this.repo.id)) {
        var repo = app.repoCollection.findWhere({
          id: this.repo.id
        });
        repo.getBranches()
          .then(function () {
            var branches = repo.get('branches');
            if (branches.length === 1) {
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
});