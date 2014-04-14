/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'text!templates/filter-list-item.html'
], function (Backbone, _, app, listItemTemplate) {
  'use strict';

  return Backbone.View.extend({
    el: '#reviewList',
    listItemTemplate: _.template(listItemTemplate),
    events: {
      'click .destroy': 'removeFilter',
      'click .stats': 'showStatistics'
    },
    removeFilter: function (event) {
      event.preventDefault();
      var modelId = $(event.target).data('id');
      var model = app.filterCollection.get(modelId);
      if (model) {
        model.destroy();
      }
    },
    showStatistics: function (event) {
      event.preventDefault();
      var filterId = $(event.target).data('id');
      app.router.navigate('statistics/' +filterId, {trigger: true});
    },
    fetchReviews: function () {
      if (this.collection.length) {
        this.addAll();
      } else {
        this.showHint();
      }
    },
    addOne: function (model) {
      var view = this.listItemTemplate(model.toJSON());
      this.$el.append(view);
    },
    addAll: function () {
      this.collection.each(this.addOne, this);
      app.showIndicator(false);
    },
    showHint: function () {
      //TODO show help text for first filter
    },
    render: function () {
    }
  });
});