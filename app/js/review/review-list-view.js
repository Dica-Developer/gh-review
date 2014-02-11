/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'reviewCollection',
  'reviewListItemView'
], function (Backbone, _, app, reviewCollection, ReviewListItemView) {
  'use strict';

  var ReviewListView = Backbone.View.extend({
    el: '#main',
    events: {
      'click li': 'showDetail'
    },
    fetchReviews: function(){
      if (reviewCollection.length) {
        this.addAll();
      } else {
        this.showHint();
      }
    },
    showDetail: function (event) {
      app.router.navigate('review/' + $(event.target).data('modelid'), {trigger: true});
    },
    addOne: function (model) {
      var view = new ReviewListItemView({model: model});
      this.$('#reviewList').append(view.render().el);
    },
    addAll: function () {
      reviewCollection.each(this.addOne, this);
    },
    showHint: function () {
    },
    render: function () {
      this.$el.html('<ul id="reviewList" class="list-group"></ul>');
    }
  });

  return ReviewListView;
});
