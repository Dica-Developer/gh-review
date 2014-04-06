/*global define, d3, crossfilter*/
define(function (require) {
  'use strict';

  var _ = require('underscore');
  var app = require('app');
  var dc = require('dc');
  /**
   * @class Charts
   * @contructs Charts
   */
  var Charts = function () {
    this.charts = {};
    this.data = {};
  };

  /**
   * @memberof Charts#
   * @returns {{}|*}
   */
  Charts.prototype.getAll = function () {
    return this.charts;
  };

  /**
   * @memberof Charts#
   * @param chartName
   * @returns {*}
   */
  Charts.prototype.get = function (chartName) {
    return this.charts[chartName];
  };

  /**
   * @memberof Charts#
   * @param chartName
   * @param chart
   */
  Charts.prototype.set = function (chartName, chart) {
    this.charts[chartName] = chart;
  };

  /**
   * @memberof Charts#
   * @returns {*}
   */
  Charts.prototype.fileTypeChart = function () {
    var chart = dc.rowChart('#file-type-chart');
    chart.width(180);
    chart.height(180);
    chart.margins({top: 20, left: 10, right: 10, bottom: 20});
    chart.group(this.data.fileTypeGroup);
    chart.dimension(this.data.fileType);
    // assign colors to each value in the x scale domain
    chart.ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb']);
    chart.label(function (d) {
      return d.key;
    });
    // title sets the row text
    chart.title(function (d) {
      return d.value;
    });
    chart.elasticX(true);
//      chart.xAxis().ticks(4);
    chart.filterHandler(function (d, v) {
      console.log(d, v);
    });
    this.set('fileTypeChart', chart);
    return chart;
  };

  /**
   * @memberof Charts#
   * @param availableWidth
   * @returns {*}
   */
  Charts.prototype.reviewStateChart = function (availableWidth) {
    var all = this.data.all;
    var chart = dc.pieChart('#review-state-chart');
    chart.width(availableWidth);
    chart.height(150);
    chart.transitionDuration(1000);
    chart.dimension(this.data.commentedCommits);
    chart.group(this.data.commentedCommitsGroup);
    chart.radius(70);
    chart.minAngleForLabel(0);
    chart.colors(d3.scale.ordinal().range(['#2EC73B', '#4EACF6', '#a60000']));
    chart.label(function (d) {
      var percentage = (d.value / all.value() * 100);
      var percentageString = '(' + (Math.round(percentage * 100) / 100) + '%)';
      if (chart.hasFilter() && !chart.hasFilter(d.key)) {
        percentageString = '(0%)';
      }
      return percentageString;
    });
    chart.legend(dc.legend().x(5).y(5).itemHeight(13).gap(5));
    chart.renderlet(function (chart) {
      chart.select('svg > g').attr('transform', 'translate(200,75)');
    });
    chart.on('filtered', function (chart, filter) {
      app.trigger('add:filter:byState', filter);
    });
    this.set('reviewStateChart', chart);
    return chart;
  };

  /**
   * @memberof Charts#
   * @param availableWidth
   * @returns {*}
   */
  Charts.prototype.commitsPerAuthorChart = function (availableWidth) {
    var chart = dc.pieChart('#commitsPerAuthor-chart');
    chart.width(availableWidth);
    chart.height(150);
    chart.transitionDuration(1000);
    chart.dimension(this.data.commitsByAuthor);
    chart.group(this.data.commitsByAuthorGroup);
    chart.radius(70);
    chart.minAngleForLabel(0);
    chart.colors(d3.scale.category10());
    chart.label(function (d) {
      return d.value;
    });
    chart.legend(dc.legend().x(5).y(5).itemHeight(13).gap(5));
    chart.renderlet(function (chart) {
      chart.select('svg > g').attr('transform', 'translate(200,75)');
    });
    chart.on('filtered', function (chart, filter) {
      app.trigger('add:filter:byEmail', filter);
    });
    this.set('commitsPerAuthorChart', chart);
    return chart;
  };

  /**
   * @memberof Charts#
   * @param availableWidth
   * @returns {*}
   */
  Charts.prototype.timeChart = function (availableWidth) {
    var chart = dc.barChart('#time-chart');
    chart.width(availableWidth);
    chart.height(150);
    chart.margins({top: 20, right: 0, bottom: 20, left: 30});
    chart.renderHorizontalGridLines(true);
    chart.dimension(this.data.commitsByDay);
    chart.group(this.data.commitsByDayGroup);
    chart.centerBar(true);
    chart.mouseZoomable(false);
    chart.round(d3.time.day.round);
    chart.alwaysUseRounding(true);
    var smallestGreatestDateOfCommits = this.data.smallestGreatestDateOfCommits;
    chart.x(d3.time.scale().domain([smallestGreatestDateOfCommits.smallest, smallestGreatestDateOfCommits.greatest]));
    chart.xUnits(d3.time.day);
    chart.elasticY(true);
    chart.brushOn(false);
    this.set('timeChart', chart);
    return chart;
  };

  /**
   * @memberof Charts#
   * @param rawData
   */
  Charts.prototype.processCommitData = function (rawData) {
    _.each(rawData, function (data) {
      data.commitDate = new Date(data.commit.author.date);
      data.commitDay = d3.time.day(data.commitDate);
    }, this);
    var data = crossfilter(rawData);
    this.data.all = data.groupAll();
    var sortedDate = _.sortBy(rawData, function (data) {
      return data.commitDate.getTime();
    });

    this.data.smallestGreatestDateOfCommits = {};
    if (0 !== data.size()) {
      this.data.smallestGreatestDateOfCommits.smallest = sortedDate[0].commitDate;
      this.data.smallestGreatestDateOfCommits.greatest = sortedDate[sortedDate.length - 1].commitDate;
    } else {
      console.log('filter seems not lead in any results');
    }

    this.data.commitsByDay = data.dimension(function (d) {
      return d.commitDay;
    });
    this.data.commitsByDayGroup = this.data.commitsByDay.group();

    this.data.commitsByAuthor = data.dimension(function (data) {
      return data.commit.author.email;
    });
    this.data.commitsByAuthorGroup = this.data.commitsByAuthor.group();

    this.data.commentedCommits = data.dimension(function (data) {
      /*jshint camelcase:false*/
      var commented = data.commit.comment_count > 0;
      var approved = app.commitApproved[data.sha] || false;
      var state = 'Undefined';
      if (!commented) {
        state = 'Not Reviewed';
      } else if (commented && !approved) {
        state = 'Not Approved';
      } else if (commented && approved) {
        state = 'Approved';
      }
      return state;
    });
    this.data.commentedCommitsGroup = this.data.commentedCommits.group();
  };

  /**
   * @memberof Charts#
   * @param treeRawData
   */
  Charts.prototype.processTreeData = function (treeRawData) {
    _.each(treeRawData, function (data) {
      var split = data.path.split('.');
      var extension = split[split.length - 1];
      if (split.length === 1) {
        extension = 'folder';
      }
      data.extension = extension;
    });
    var treeData = crossfilter(treeRawData);
    this.data.treeAll = treeData.groupAll();
    this.data.fileType = treeData.dimension(function (d) {
      return  d.extension;
    });
    this.data.fileTypeGroup = this.data.fileType.group();
  };

  return Charts;
});
