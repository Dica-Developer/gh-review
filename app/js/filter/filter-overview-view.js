/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'FilterListView',
  'QuickFilter',
  'text!templates/filter-overview.html'
], function (Backbone, _, app, FilterListView, QuickFilter, template) {
  'use strict';

  var ReviewOverview = Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    render: function () {
      this.$el.html(this.template());
      var quickFilter = new QuickFilter();
      quickFilter.render();

      var reviewListView = new FilterListView({collection: app.filterCollection});
      reviewListView.render();
      reviewListView.fetchReviews();
    }
  });

  return ReviewOverview;

});
