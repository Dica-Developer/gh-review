/*global define, d3, crossfilter*/
define(function (require) {
  'use strict';

  var Backbone = require('backbone');
  var _ = require('underscore');
  var $ = require('jquery');
  var app = require('app');
  var dc = require('dc');
  var ExtendedFilterView = require('_ExtendedFilterView');
  var template = require('text!templates/_filter.html');

  return Backbone.View.extend({
    el: '#main',
    repoTable: null,
    selectedRepoModel: '',
    events: {
      'click #repo-data-table .dc-table-row': 'selectRepo',
      'change #tableGroup': 'changeRepotableGroup',
      'click .sortRepoTable': 'sortRepoTable',
      'click #applyBranchSettings': 'applyBranch'
    },
    template: _.template(template),
    initialize: function () {
      dc.chartRegistry.clear();
      this.listenTo(app.repoCollection, 'add', this.render);
    },
    changeRepotableGroup: function(event){
      var target = $(event.target);
      var groupValue = target.val();
      this.repoTable
        .group(function(data){
          var group;
          switch(groupValue){
          case 'owner':
            group = data.owner.login;
            break;
          case 'created':
            group = _.moment(data.created).format('MM/YYYY');
            break;
          case 'updated':
            group = _.moment(data.updated).format('MM/YYYY');
            break;
          default:
            group = data[groupValue];
          }
          return  group;
        })
        .render();
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
      var target = $(event.target);
      this.$('tr.success').removeClass('success');
      var tr = target.closest('tr');
      tr.addClass('success');

      var repo = tr.find('td').eq(0).text();
      var repoModel = app.repoCollection.findWhere({'full_name': repo});
      this.selectedRepoModel = repoModel;
      repoModel.getBranches()
        .then(this.addBranchesSelect.bind(this));
    },
    addBranchesSelect: function(repoModel){
      var branches = repoModel.get('branches');
      var defaultBranch = repoModel.get('default_branch');
      var selectField = this.$('#selectBranch');
      selectField.empty();
      _.each(branches, function(branch){
        var option = $('<option value="'+ branch.name + '">'+ branch.name +'</option>');
        if(defaultBranch === branch.name){
          option.attr('selected', 'selected');
        }
        option.appendTo(selectField);
      });
      this.$('#selectBranchesRow').show();
    },
    applyBranch: function(){
      var branch = this.$('#selectBranch option:selected').val();
      new ExtendedFilterView({model: this.selectedRepoModel, branch: branch});
    },
    repoData: function () {
      var rawData = app.repoCollection.toJSON();
      _.each(rawData, function (data) {
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