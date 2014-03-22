/*global define*/
define([
  'jquery',
  'backbone',
  'underscore',
  'moment',
  'when',
  'dc',
  'app',
  'text!templates/_extended-filter.html'
], function ($, Backbone, _, moment, when, dc, app, template) {
  'use strict';

  return Backbone.View.extend({
    el: '#extendedFilterView',
    commitFilter: {
      user: '',
      repo: ''
    },
    events: {
    },
    template: _.template(template),
    initialize: function () {
      console.log(this.model.toJSON());
      this.commitFilter.repo = this.model.get('name');
      this.commitFilter.user = this.model.get('owner').login;
      app.github.repos.getCommits(this.commitFilter, function(err, resp){
        console.log(resp);
      });
      this.model.getAdditionalInformations()
        .then(this.renderBranchesAndContributors.bind(this));
      this.render();
    },
    renderBranchesAndContributors: function(){
      var branches = this.model.get('branches');
      var contributors = this.model.get('contributors');

      console.log(branches, contributors);
    },
    render: function () {
      this.$el.html(this.template());
      this.$el.height($(window).height());
      var position = this.$el.position();
      $('body').scrollTop(position.top - 60);
    }
  });

});