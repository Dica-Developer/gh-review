/*global define*/
define([
  'jquery',
  'backbone',
  'underscore',
  'moment',
  'when',
  'Charts',
  'app',
  'CommitCollection',
  'text!templates/_extended-filter.html'
], function ($, Backbone, _, moment, when, Charts, app, CommitCollection, template) {
  'use strict';

  return Backbone.View.extend({
    el: '#extendedFilterView',
    charts: new Charts(),
    /*jshint camelcase:false  */
    commitFilter: {
      user: '',
      repo: '',
      page: 1,
      per_page: 100
    },
    events: {
      'change #timeChartMethod': 'changeTimeChartMethod',
      'click #applyTimeChartSettings': 'applyTimeChartSettings',
      'click #applyPathFilter': 'applyPathFilter'
    },
    template: _.template(template),
    commits: new CommitCollection(),
    getCommitDefer: null,
    initialize: function () {
      var twoWeeksAgo = moment().subtract('weeks', 2).toISOString();
      this.commitFilter.repo = this.model.get('name');
      this.commitFilter.user = this.model.get('owner').login;
      this.commitFilter.since = twoWeeksAgo;
      this.getCommitsWithCurrentFilter()
        .then(this.processDataAndRenderCharts.bind(this));
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
      this.getCommitsWithCurrentFilter()
        .then(this.processDataAndRenderCharts.bind(this));
    },
    applyPathFilter: function () {
      var path = this.$('#path-filter-input').val();
      if ('' !== path) {
        this.commitFilter.path = path;
      } else if ('' === path && typeof this.commitFilter.path !== 'undefined') {
        delete this.commitFilter.path;
      }
      this.getCommitsWithCurrentFilter()
        .then(this.processDataAndRenderCharts.bind(this));
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
          this.commits.add(resp);
          if (hasNext) {
            this.getCommitsWithCurrentFilter(link);
          } else {
            this.getCommitDefer.resolve();
          }
        }
      }.bind(this);
      if (!link) {
        this.commits.reset();
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
    processDataAndRenderCharts: function () {
      var rawData = this.commits.toJSON();
      this.charts.processCommitData(rawData);
      var treeRawData = this.model.get('tree').tree;
      this.charts.processTreeData(treeRawData);
      this.renderTimeChart();
      this.renderCommitsPerAuthorChart();
      this.renderReviewStateChart();
      this.renderFileTypeChart();
      this.addPaths(treeRawData);
    },
    renderFileTypeChart: function () {

    },
    addPaths: function (treeRawData) {
      var html = [];
      _.each(treeRawData, function (entry) {
        if ('tree' === entry.type) {
          html.push('<option value="' + entry.path + '">');
        }
      });
      this.$('#paths').html(html.join('\n'));
    },
    renderReviewStateChart: function () {
      var availWidth = this.$('#commitFilterCharts').width();
      var chart = this.charts.reviewStateChart(availWidth);
      chart.render();
    },
    renderCommitsPerAuthorChart: function () {
      var availWidth = this.$('#commitFilterCharts').width();
      var chart = this.charts.commitsPerAuthorChart(availWidth);
      chart.render();
    },
    renderTimeChart: function () {
      var availableWidth = this.$('#timeWindowFilter').width();
      var chart = this.charts.timeChart(availableWidth);
      chart.render();
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