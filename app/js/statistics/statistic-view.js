/*global define, crossfilter, d3*/
define([
  'backbone',
  'underscore',
  'moment',
  'dc',
  'app',
  'text!templates/statistic-charts.html'
], function (Backbone, _, moment, dc, app, template) {
  'use strict';

  return Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    approvedPieChart: null,
    commitsPerDayChart: null,
    commitsPerAuthorChart: null,
    events: {
      'click a.reset': 'resetChart'
    },
    resetChart: function (event) {
      var target = this.$(event.target);
      var chart = target.data('chart');
      switch (chart) {
      case 'approved-pie-chart':
        this.approvedPieChart.filterAll();
        break;
      case 'commitsPerAuthor-chart':
        this.commitsPerAuthorChart.filterAll();
        break;
      case 'commitsPerDay-chart':
        this.commitsPerDayChart.filterAll();
        this.commitBarChart.filterAll();
        break;
      }
      dc.redrawAll();
    },
    addCharts: function () {
      var rawData = this.model.toJSON().commits;
      _.each(rawData, function (data) {
        data.commit.date = new Date(data.commit.author.date);
        data.commit.day = d3.time.day(data.commit.date);
      });
      var data = crossfilter(rawData);
      var all = data.groupAll();
      var commentedCommits = data.dimension(function (data) {
        /*jshint camelcase:false*/
        var commented = data.commit.comment_count > 0;
        var approved = app.commitApproved[data.sha] || false;
        if(commented && approved){
          return 'Approved';
        }else if(commented && !approved){
          return 'Not approved';
        } else {
          return 'Not reviewed';
        }
      });
      var commentedCommitsGroup = commentedCommits.group();

      var commentedCommitsAuthor = data.dimension(function (data) {
        return data.commit.author.name;
      });
      var commentedCommitsAuthorGroup = commentedCommitsAuthor.group();

      var dayDimension = data.dimension(function (data) {
        return data.commit.day;
      });

      // group by total movement within month
      var dayDimensionGroup = dayDimension.group();

      if (_.size(dc.chartRegistry.list()) > 0) {
        dc.deregisterAllCharts();
      }
      this.addPieChart(all, commentedCommits, commentedCommitsGroup);
      this.addCommitsPerAuthorChart(all, commentedCommitsAuthor, commentedCommitsAuthorGroup);
      this.addCommitsPerDayChart(dayDimension, dayDimensionGroup);

      dc.renderAll();
    },
    addPieChart: function (all, commentedCommits, commentedCommitsGroup) {
      this.approvedPieChart = dc.pieChart('#approved-pie-chart');
      var chart = this.approvedPieChart;
      this.approvedPieChart
        .width(300)
        .height(300)
        .renderLabel(true)
        .transitionDuration(1000)
        .dimension(commentedCommits)
        .group(commentedCommitsGroup)
        .radius(120)
        .minAngleForLabel(0)
        .colors(['#2EC73B', '#4EACF6', '#a60000'])
        .label(function (d) {
          if (chart.hasFilter() && !chart.hasFilter(d.data.key)) {
            return d.data.key + '(0%)';
          }
          return d.data.key + '(' + Math.floor(d.data.value / all.value() * 100) + '%)';
        });
    },
    addCommitsPerAuthorChart: function (all, commentedCommitsAuthor, commentedCommitsAuthorGroup) {
      this.commitsPerAuthorChart = dc.pieChart('#commitsPerAuthor-chart');
      this.commitsPerAuthorChart
        .width(300)
        .height(300)
        .transitionDuration(1000)
        .dimension(commentedCommitsAuthor)
        .group(commentedCommitsAuthorGroup)
        .radius(120)
        .minAngleForLabel(0)
        .colors(d3.scale.category20c());
    },
    addCommitsPerDayChart: function (dayDimension, dayDimensionGroup) {
      this.commitsPerDayChart = dc.barChart('#commitsPerDay-chart');
      var oneMonthAgo = moment().subtract('weeks', 4).toISOString();
      var now = moment().toISOString();
      this.commitsPerDayChart
        .width(900)
        .height(250)
        .margins({top: 20, right: 50, bottom: 20, left: 40})
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .dimension(dayDimension)
        .group(dayDimensionGroup)
        .centerBar(true)
        .gap(1)
        .mouseZoomable(true)
        .x(d3.time.scale().domain([new Date(oneMonthAgo), new Date(now)]))
        .xUnits(d3.time.day);
    },
    render: function () {
      this.$el.html(this.template());
      this.addCharts();
    }
  });

});