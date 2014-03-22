/*global define, crossfilter, d3*/
define([
  'backbone',
  'underscore',
  'moment',
  'dc',
  'app',
  'text!templates/_filter.html'
], function (Backbone, _, moment, dc, app, template) {
  'use strict';

  return Backbone.View.extend({
    el: '#main',
    repoTable: null,
    events: {
      'click #repo-data-table .dc-table-row': 'selectRepo',
      'click .sortRepoTable': 'sortRepoTable'
    },
    template: _.template(template),
    initialize: function () {
      this.listenTo(app.repoCollection, 'add', this.render);
    },
    sortRepoTable: function(event){
      var target = $(event.target);
      if(!target.is('th')){
        target = target.closest('th');
      }
      var sortField = target.data('sortby');
      var sortDir = target.data('sortdir');
      var newSortDir = (sortDir === 'descending') ? 'ascending' : 'descending';
      target.data('sortdir', newSortDir);

      this.$('.sorticon').hide();
      target.find('.sorticon.' + newSortDir).show();

      this.repoTable
        .sortBy(function(data){
          return data[sortField];
        })
        .order(d3[newSortDir])
        .render();
    },
    selectRepo: function (event) {
      console.log($(event.target));
    },
    repoData: function () {
      var rawData = app.repoCollection.toJSON();
      _.each(rawData, function (data) {
        console.log(data);
        if (!data.private && !data.organization) {
          data.access = 'Public';
        } else if (data.private && !data.organization) {
          data.access = 'Private';
        } else if (data.organization) {
          data.access = 'Organization';
        }
        /*jshint camelcase: false*/
        data.updated = new Date(data.updated_at);
        data.created = new Date(data.created_at);
      }, this);
      var data = crossfilter(rawData);
      var all = data.groupAll();

      var repoAccess = data.dimension(function (data) {
        return data.access;
      });
      var repoAccessGroup = repoAccess.group();

      var repoOwner = data.dimension(function (data) {
        return data.owner.login;
      });
      var repoOwnerGroup = repoOwner.group();

      var repoUpdatedDimension = data.dimension(function (data) {
        return data.updated;
      });

      this.addRepoAccessChart(all, repoAccess, repoAccessGroup);
      this.addRepoOwnerChart(all, repoOwner, repoOwnerGroup);
      this.addRepoTable(repoUpdatedDimension);
      dc.dataCount('#table-data-count')
        .dimension(data)
        .group(all);
    },
    addRepoAccessChart: function (all, repoAccess, repoAccessGroup) {
      var availWidth = this.$('#repoFilterCharts').width();
      dc.pieChart('#repo-access-chart')
        .width(availWidth)
        .height(150)
        .transitionDuration(1000)
        .dimension(repoAccess)
        .group(repoAccessGroup)
        .radius(70)
        .minAngleForLabel(0)
        .colors(d3.scale.category10())
        .label(function (d) {
          return d.value;
        })
        .legend(dc.legend().x(5).y(5).itemHeight(13).gap(5))
        .renderlet(function(chart){
          chart.select('svg > g').attr('transform', 'translate(200,75)');
        });
    },
    addRepoOwnerChart: function (all, repoOwner, repoOwnerGroup) {
      var availWidth = this.$('#repoFilterCharts').width();
      dc.pieChart('#repo-owner-chart')
        .width(availWidth)
        .height(150)
        .transitionDuration(1000)
        .dimension(repoOwner)
        .group(repoOwnerGroup)
        .radius(70)
        .minAngleForLabel(0)
        .colors(d3.scale.category20())
        .label(function (d) {
          return d.value;
        })
        .legend(dc.legend().x(5).y(5).itemHeight(13).gap(5))
        .renderlet(function(chart){
          chart.select('svg > g').attr('transform', 'translate(200,75)');
        });
    },
    addRepoTable: function (repoUpdatedDimension) {
      this.repoTable = dc.dataTable('#repo-data-table')
        .dimension(repoUpdatedDimension)
        .size(100)
        .group(function (d) {
          return d.access;
        })
        .columns([
          function (d) {
            /*jshint camelcase:false*/
            return d.full_name;
          },
          function (d) {
            return _.moment(d.created).format('L');
          },
          function (d) {
            return _.moment(d.updated).format('L');
          },
          function (d) {
            /*jshint camelcase:false*/
            return d.open_issues_count;
          },
          function (d) {
            /*jshint camelcase:false*/
            return d.stargazers_count;
          }
        ])
        .sortBy(function (d) {
          //d.updated is a Date object with the leading '+' Date is converted into milliseconds
          return +d.updated;
        })
        .order(d3.descending)
        .renderlet(function (table) {
          table.selectAll('.dc-table-group').classed('info', true);
        });
    },
    render: function () {
      this.$el.html(this.template());
      this.repoData();
      app.router.trigger('ajaxIndicator', false);
      dc.renderAll();
    }
  });

});