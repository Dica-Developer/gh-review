/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'Charts',
  'text!templates/statistics.html'
], function(Backbone, _, app, Charts, template){
  'use strict';

  return Backbone.View.extend({
    initialize: function(){

    },
    el: '#main',
    template: _.template(template),
    initCharts: function(){
      this.charts = new Charts();
      this.model.getAllCommitsFromBranch()
        .then(this.processDataAndRenderCharts.bind(this));
    },
    processDataAndRenderCharts: function (commits) {
      var rawData = commits.toJSON();
      this.charts.processCommitData(rawData);
      this.renderTimeChart();
      this.renderCommitsPerAuthorChart();
      this.renderReviewStateChart();
      app.ajaxIndicator.hide();
    },
    renderReviewStateChart: function () {
      var availWidth = this.$('.col-sm-5').width();
      var chart = this.charts.reviewStateChart(availWidth, 300);
      chart.radius(120);
      chart.render();
    },
    renderCommitsPerAuthorChart: function () {
      var availWidth = this.$('.col-sm-5').width();
      var chart = this.charts.commitsPerAuthorChart(availWidth, 300);
      chart.radius(120);
      chart.render();
    },
    renderTimeChart: function () {
      var availableWidth = this.$('.col-sm-12').width();
      var chart = this.charts.timeChart(availableWidth, 200);
      chart.render();
    },
    render: function(){
      this.$el.append(this.template());
      this.initCharts();
    }
  });

});
