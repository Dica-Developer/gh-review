/*global define, crossfilter, d3*/
define([
  'jquery',
  'backbone',
  'underscore',
  'moment',
  'when',
  'dc',
  'app',
  'text!templates/_extended-filter.html'
], function ($, Backbone, _, moment, when, dc, app, template) {
  'use strict';

  return Backbone.View.extend({
    el: '#extendedFilterView',
    /*jshint camelcase:false  */
    commitFilter: {
      user: '',
      repo: '',
      page: 1,
      per_page: 100
    },
    events: {
      'change #timeChartMethod': 'changeTimeChartMethod',
      'click #applyTimeChartSettings': 'applyTimeChartSettings'
    },
    template: _.template(template),
    commits: [],
    getCommitDefer: null,
    initialize: function () {
      var twoWeeksAgo = moment().subtract('weeks', 2).toISOString();
      this.commitFilter.repo = this.model.get('name');
      this.commitFilter.user = this.model.get('owner').login;
      this.commitFilter.since = twoWeeksAgo;
      this.getCommitsWithCurrentFilter()
        .then(this.processData.bind(this));
      this.model.getAdditionalInformations()
        .then(this.renderBranchesAndContributors.bind(this));
      this.render();
    },
    applyTimeChartSettings: function () {
      var method = this.$('#timeChartMethod').find(':selected').val();
      if ('sliding' === method) {
        var amount = this.$('#timeChartSlidingAmount').val();
        var pattern = this.$('#timeChartSlidingPattern').find(':selected').val();
        this.commitFilter.since = moment().subtract(pattern, amount).toISOString();
      } else {
        if (this.commitFilter.since) {
          delete this.commitFilter.since;
        }
        if (this.commitFilter.until) {
          delete this.commitFilter.until;
        }
        var start = this.$('#timeChartFixedStart').val();
        var end = this.$('#timeChartFixedEnd').val();
        if ('' !== start) {
          this.commitFilter.since = moment(start).toISOString();
        }
        if ('' !== end) {
          this.commitFilter.until = moment(end).toISOString();
        }
      }
      this.commits = [];
      this.getCommitsWithCurrentFilter()
        .then(this.processData.bind(this));
    },
    changeTimeChartMethod: function (event) {
      var target = this.$(event.target);
      var value = target.find(':selected').val();
      if ('sliding' === value) {
        this.$('#timeChartFixedSettings').hide();
        //.show() doesn't work here because .show() sets display to 'block' but we need 'inline-block'
        this.$('#timeChartSlidingSettings').css('display', 'inline-block');
      } else {
        this.$('#timeChartSlidingSettings').hide();
        //.show() doesn't work here because .show() sets display to 'block' but we need 'inline-block'
        this.$('#timeChartFixedSettings').css('display', 'inline-block');
      }
    },
    getCommitsWithCurrentFilter: function (link) {
      var callback = function (error, resp) {
        if (!error) {
          var link = resp.meta.link;
          var hasNext = app.github.hasNextPage(link);
          delete resp.meta;
          this.commits = this.commits.concat(resp);
          if (hasNext) {
            this.getCommitsWithCurrentFilter(link);
          } else {
            this.getCommitDefer.resolve();
          }
        }
      }.bind(this);
      if (!link) {
        this.getCommitDefer = when.defer();
        app.github.repos.getCommits(this.commitFilter, callback);
      } else {
        app.github.getNextPage(link, callback);
      }
      return this.getCommitDefer.promise;
    },
    renderBranchesAndContributors: function () {
//      var branches = this.model.get('branches');
//      var contributors = this.model.get('contributors');
    },
    processData: function () {
      var rawData = _.clone(this.commits);
      _.each(rawData, function (data) {
        data.commitDate = new Date(data.commit.author.date);
        data.commitDay = d3.time.day(data.commitDate);
      }, this);
      var data = crossfilter(rawData);
      var all = data.groupAll();

      var sortedDate = _.sortBy(rawData, function (data) {
        return data.commitDate.getTime();
      });

      var smallestGreatestDateOfCommits = {
        smallest: sortedDate[0].commitDate,
        greatest: sortedDate[sortedDate.length - 1].commitDate
      };

      var commitsByDay = data.dimension(function (d) {
        return d.commitDay;
      });
      var commitsByDayGroup = commitsByDay.group();

      var commitsByAuthor = data.dimension(function (data) {
        return data.commit.author.name;
      });
      var commitsByAuthorGroup = commitsByAuthor.group();

      var commentedCommits = data.dimension(function (data) {
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
      var commentedCommitsGroup = commentedCommits.group();

      var treeRawData = this.model.get('tree').tree;
      var treeData = crossfilter(treeRawData);
//      var treeAll = treeData.group();

      var folder = treeData.dimension(function (data) {
        return data.type;
      });

//      var folderGroup = folder.group();

      this.renderTimeChart(commitsByDay, commitsByDayGroup, smallestGreatestDateOfCommits);
      this.renderCommitsPerAuthorChart(commitsByAuthor, commitsByAuthorGroup);
      this.renderReviewStateChart(all, commentedCommits, commentedCommitsGroup);
      this.renderFolderTable(folder);
    },
    renderFolderTable: function (folder) {
      var table = dc.dataTable('#tree-folder-table');
      table.dimension(folder);
      table.size(100);
      table.group(function (d) {
        return d.path.split('/')[0];
      });
      table.columns([
        function (d) {
          return d.path;
        },
        function(d){
          return d.sha;
        }
      ]);
      table.sortBy(function (d) {
        return d.path.length;
      });
      table.order(d3.ascending);
      table.renderlet(function (table) {
        table.selectAll('.dc-table-group').classed('info', true);
      });
      table.filter('tree');
      table.render();
    },
    renderReviewStateChart: function (all, commentedCommits, commentedCommitsGroup) {
      var availWidth = this.$('#commitFilterCharts').width();
      var chart = dc.pieChart('#review-state-chart');
      chart.width(availWidth);
      chart.height(150);
      chart.transitionDuration(1000);
      chart.dimension(commentedCommits);
      chart.group(commentedCommitsGroup);
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
      chart.render();
    },
    renderCommitsPerAuthorChart: function (commitsByAuthor, commitsByAuthorGroup) {
      var availWidth = this.$('#commitFilterCharts').width();
      var chart = dc.pieChart('#commitsPerAuthor-chart');
      chart.width(availWidth);
      chart.height(150);
      chart.transitionDuration(1000);
      chart.dimension(commitsByAuthor);
      chart.group(commitsByAuthorGroup);
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
      chart.render();
    },
    renderTimeChart: function (commitsByDay, commitsByDayGroup, smallestGreatestDateOfCommits) {
      var availableWidth = this.$('#timeWindowFilter').width();
      dc.barChart('#time-chart')
        .width(availableWidth)
        .height(150)
        .margins({top: 20, right: 0, bottom: 20, left: 30})
        .renderHorizontalGridLines(true)
        .dimension(commitsByDay)
        .group(commitsByDayGroup)
        .centerBar(true)
        .mouseZoomable(false)
        .round(d3.time.day.round)
        .alwaysUseRounding(true)
        .x(d3.time.scale().domain([smallestGreatestDateOfCommits.smallest, smallestGreatestDateOfCommits.greatest]))
        .xUnits(d3.time.day)
        .elasticY(true)
        .brushOn(false)
        .render();
    },
    applyHelperTooltips: function () {
      var tooltipOptions = {
        placement: 'top',
        trigger: 'hover',
        delay: { show: 500, hide: 100 }
      };
      var timeChartFilterSinceTooltip = _.extend({title: 'Optional: If you leave blank and only until'}, tooltipOptions);
      this.$('#timeChartFixedStartLabel').tooltip(timeChartFilterSinceTooltip);
    },
    render: function () {
      this.$el.html(this.template());
      this.$el.height($(window).height());
      var position = this.$el.position();
      $('body').scrollTop(position.top - 60);
      this.applyHelperTooltips();
    }
  });

});