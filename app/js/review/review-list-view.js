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
    el: '#reviewList',
    events: {
      'click li': 'showDetail'
    },
    fetchReviews: function(){
      if (this.collection.length) {
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
      this.$el.append(view.render().el);
    },
    addAll: function () {
      this.collection.each(this.addOne, this);
      app.showIndicator(false);
    },
    showHint: function () { },
    render: function () {}
  });

  return ReviewListView;
});
