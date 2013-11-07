/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'reviewCollection',
  'reviewListItemView'
], function (Backbone, _, app, reviews, ReviewListItemView) {
  'use strict';

  var ReviewListView = Backbone.View.extend({
    el: '#main',
    initialize: function () {
      reviews.fetch();
      this.render();
      if (reviews.length) {
        this.addAll();
      } else {
        this.showHint();
      }
    },
    events: {
      'click li': 'showDetail'
    },
    showDetail: function (event) {
      app.router.navigate('review/' + $(event.target).data('modelid'), {trigger: true});
    },
    addOne: function (model) {
      var view = new ReviewListItemView({model: model});
      this.$('#reviewList').append(view.render().el);
    },
    addAll: function () {
      reviews.each(this.addOne, this);
    },
    showHint: function () {
    },
    render: function () {
      this.$el.html('<ul id="reviewList" class="list-group"></ul>');
    }
  });

  return ReviewListView;
});
