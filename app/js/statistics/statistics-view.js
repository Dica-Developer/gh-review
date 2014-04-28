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
      var availWidth = this.$('.col-sm-6').width();
      var height = 300;
      var radius = 120;
      var chart = this.charts.reviewStateChart(availWidth, height);
      chart.radius(radius);
      var moveX = availWidth - 120;
      var moveY = height / 2;
      chart.renderlet(function (chart) {
        chart.select('svg > g').attr('transform', 'translate('+ moveX +', '+ moveY +')');
      });
      chart.render();
    },
    renderCommitsPerAuthorChart: function () {
      var availWidth = this.$('.col-sm-6').width();
      var height = 300;
      var radius = 120;
      var chart = this.charts.commitsPerAuthorChart(availWidth, height);
      chart.radius(radius);
      var moveX = availWidth - 120;
      var moveY = height / 2;
      chart.renderlet(function (chart) {
        chart.select('svg > g').attr('transform', 'translate('+ moveX +', '+ moveY +')');
      });
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
