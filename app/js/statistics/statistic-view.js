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
    commitBarChart: null,
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
        data.commit.hour = d3.time.hour(data.commit.date);
        data.commit.minute = d3.time.minute(data.commit.date);
      });
      var data = crossfilter(rawData);
      var all = data.groupAll();
      var commentedCommits = data.dimension(function (data) {
        /*jshint camelcase:false*/
        return data.commit.comment_count > 0 ? 'Reviewed' : 'Not reviewed';
      });
      var commentedCommitsGroup = commentedCommits.group();

      var commentedCommitsAuthor = data.dimension(function (data) {
        /*jshint camelcase:false*/
        return data.commit.author.name;
      });
      var commentedCommitsAuthorGroup = commentedCommitsAuthor.group();

      var minuteDimension = data.dimension(function (data) {
        /*jshint camelcase:false*/
        return data.commit.minute;
      });

      var minuteDimensionGroup = minuteDimension.group();

      var dayDimension = data.dimension(function (data) {
        /*jshint camelcase:false*/
        return data.commit.day;
      });

      // group by total movement within month
      var dayDimensionGroup = dayDimension.group();

      if (_.size(dc.chartRegistry.list()) > 0) {
        dc.deregisterAllCharts();
      }
      this.addPieChart(all, commentedCommits, commentedCommitsGroup);
      this.addCommitsPerAuthorChart(all, commentedCommitsAuthor, commentedCommitsAuthorGroup);
      try {
        this.addBarChart(dayDimension, dayDimensionGroup);
      } catch (e) {
        console.log(e);
      }
      this.addCommitsPerDayChart(minuteDimension, minuteDimensionGroup);

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
        .colors(['#a60000', '#2EC73B'])
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
        .colors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb']);
    },
    addCommitsPerDayChart: function (minuteDimension, minuteDimensionGroup) {
      this.commitsPerDayChart = dc.barChart('#commitsPerDay-chart');
      this.commitsPerDayChart
        .width(900)
        .height(250)
        .margins({top: 20, right: 50, bottom: 20, left: 40})
        .rangeChart(this.commitBarChart)
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .legend(dc.legend().x(700).y(10).itemHeight(13).gap(5))
        .dimension(minuteDimension)
        .group(minuteDimensionGroup, 'Commit count per hour')
        .centerBar(true)
        .gap(1)
        .mouseZoomable(true)
        .x(d3.time.scale().domain([new Date(moment().subtract('weeks', 2).toISOString()), new Date(moment().toISOString())]))
        .xUnits(d3.time.second);
    },
    addBarChart: function (dayDimension, dayDimensionGroup) {
      this.commitBarChart = dc.barChart('#commit-bar-chart');
      this.commitBarChart
        .width(900)
        .height(140)
        .margins({top: 20, right: 50, bottom: 20, left: 40})
        .dimension(dayDimension)
        .group(dayDimensionGroup)
        .centerBar(true)
        .x(d3.time.scale().domain([new Date(moment().subtract('weeks', 2).toISOString()), new Date(moment().toISOString())]))
        .xUnits(d3.time.day);
    },
    render: function () {
      this.$el.html(this.template());
      this.addCharts();
    }
  });

});