/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'ReviewListView',
  'QuickReview',
  'text!templates/review-overview.html'
], function(Backbone, _, app, ReviewListView, QuickReview, template){
  'use strict';

  var ReviewOverview = Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    render: function(){
      this.$el.html(this.template());
      var quickReview = new QuickReview();
      quickReview.render();

      var reviewListView = new ReviewListView({collection: app.reviewCollection});
      reviewListView.render();
      reviewListView.fetchReviews();
    }
  });

  return ReviewOverview;

});
