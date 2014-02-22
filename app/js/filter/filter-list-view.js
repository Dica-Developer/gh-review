/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'text!templates/filter-list-item.html'
], function (Backbone, _, app, listItemTemplate) {
  'use strict';

// TODO
//      this.listenTo(this.model, 'change', this.render);
//      this.listenTo(this.model, 'destroy', this.remove);
//    clear: function (event) {
//      event.stopPropagation();
//      event.preventDefault();
//      this.model.destroy();

  var FilterListView = Backbone.View.extend({
    el: '#reviewList',
    listItemTemplate: _.template(listItemTemplate),
    events: {
      'click a.list-group-item': 'showDetail',
      'click .destroy': 'clear'
    },
    fetchReviews: function(){
      if (this.collection.length) {
        this.addAll();
      } else {
        this.showHint();
      }
    },
    showDetail: function (event) {
      var target = $(event.target);
      if(!target.is('a')){
        target = target.closest('a');
      }
      var modelId = target.data('id');
      app.currentFilter = this.collection.get(modelId);
      app.router.navigate(
        'commits/' +
        app.currentFilter.get('owner') +
        '/' +
        app.currentFilter.get('repo') +
        '/' +
        app.currentFilter.get('branch'),
        {trigger: true});
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
    render: function () {}
  });

  return FilterListView;
});
