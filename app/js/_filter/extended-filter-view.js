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
  'CommitListView',
  'FilterModel',
  'text!templates/_extended-filter.html'
], function ($, Backbone, _, moment, when, Charts, app, CommitCollection, CommitListView, FilterModel, template) {
  'use strict';

  return Backbone.View.extend({
    el: '#extendedFilterView',
    charts: null,
    filter: null,
    events: {
      'change #timeChartMethod': 'changeTimeChartMethod',
      'click #applyTimeChartSettings': 'applyTimeChartSettings',
      'click #applyPathFilter': 'applyPathFilter',
      'click #preview': 'showPreview',
      'click #save': 'save'
    },
    template: _.template(template),
    commits: new CommitCollection(),
    getCommitDefer: null,
    initialize: function () {
      this.filter = new FilterModel();
      this.charts = new Charts();

      var twoWeeksAgo = moment().subtract('weeks', 2).toISOString();
      this.filter.setRepo(this.model.get('name'));
      this.filter.setOwner(this.model.get('owner').login);
      this.filter.setSince(twoWeeksAgo);
      this.filter.getAllComments()
        .then(this.filter.getAllCommits.bind(this.filter))
        .then(this.processDataAndRenderCharts.bind(this));
      this.model.getAdditionalInformations()
        .then(this.renderBranchesAndContributors.bind(this));
      this.render();
      this.listenTo(app, 'add:filter:byEmail', this.addFilterByEmail);
      this.listenTo(app, 'add:filter:byState', this.addFilterByState);

    },
    addFilterByEmail: function (filter) {
      this.filter.setAuthor(filter);
    },
    addFilterByState: function (filter) {
      switch (filter) {
      case 'Approved':
        this.filter.setState('approved');
        break;
      case 'Not Approved':
        this.filter.setState('reviewed');
        break;
      default:
        this.filter.setState('unseen');
      }
    },
    showPreview: function () {
      var view = new CommitListView({
        model: this.filter,
        el: '#commitList'
      });
      view.render();
      view.getAllCommits();
      $('#peviewModal').modal('show');
    },
    applyTimeChartSettings: function () {
      var method = this.$('#timeChartMethod').find(':selected').val();
      if ('sliding' === method) {
        var amount = this.$('#timeChartSlidingAmount').val();
        var pattern = this.$('#timeChartSlidingPattern').find(':selected').val();
        this.filter.setSince(moment().subtract(pattern, amount).toISOString());
      } else {
        this.filter.unsetSince();
        this.filter.unsetUntil();
        var start = this.$('#timeChartFixedStart').val();
        var end = this.$('#timeChartFixedEnd').val();
        if ('' !== start) {
          this.filter.setSince(moment(start).toISOString());
        }
        if ('' !== end) {
          this.filter.setUntil(moment(end).toISOString());
        }
      }
      this.filter.getAllCommits()
        .then(this.processDataAndRenderCharts.bind(this));
    },
    applyPathFilter: function () {
      var path = this.$('#path-filter-input').val();
      if ('' !== path) {
        this.filter.setPath(path);
      } else if ('' === path) {
        this.filter.unsetPath();
      }
      this.filter.getAllCommits()
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
    renderBranchesAndContributors: function () {
//      var branches = this.model.get('branches');
//      var contributors = this.model.get('contributors');
    },
    processDataAndRenderCharts: function (commits) {
      var rawData = commits.toJSON();
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
      var chart = this.charts.reviewStateChart(availWidth, 150);
      chart.render();
    },
    renderCommitsPerAuthorChart: function () {
      var availWidth = this.$('#commitFilterCharts').width();
      var chart = this.charts.commitsPerAuthorChart(availWidth, 150);
      chart.render();
    },
    renderTimeChart: function () {
      var availableWidth = this.$('#timeWindowFilter').width();
      var chart = this.charts.timeChart(availableWidth, 150);
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
    save: function () {
      app.filterCollection.create(this.filter);
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