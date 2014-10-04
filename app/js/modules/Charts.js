/*global define*/
define(['angular', 'd3', 'dcjs', 'crossfilter', 'lodash', 'moment'], function (angular, d3, dcjs, crossfilter, _, moment) {
  'use strict';

  var services = angular.module('GHReview.Charts', []);
  services.factory('Charts', ['$rootScope',
    function ($rootScope) {

      console.log(dcjs.version);

      function Charts() {
        this.data = {};
      }

      Charts.prototype.addRepoCharts = function (rawData) {
        var arrayData = _.toArray(rawData);

        var data = crossfilter(arrayData);
        var all = data.groupAll();

        var repoType = data.dimension(function (data) {
          return data.repoType;
        });
        var repoTypeGroup = repoType.group();

        var repoOwner = data.dimension(function (data) {
          return data.owner.login;
        });
        var repoOwnerGroup = repoOwner.group();

        var repoUpdatedDimension = data.dimension(function (data) {
          return moment(data.updatedAt).valueOf();
        });

        this.addRepoTypeChart(all, repoType, repoTypeGroup);
        this.addRepoOwnerChart(all, repoOwner, repoOwnerGroup);
        this.addRepoTable(repoUpdatedDimension);
        dcjs.dataCount('#table-data-count')
          .dimension(data)
          .group(all)
          .render();
      };

      Charts.prototype.addRepoTypeChart = function (all, repoType, repoTypeGroup) {
        var availWidth = document.getElementById('repoFilterCharts').offsetWidth;
        dcjs.pieChart('#repo-access-chart')
          .width(availWidth)
          .height(150)
          .transitionDuration(1000)
          .dimension(repoType)
          .group(repoTypeGroup)
          .radius(70)
          .minAngleForLabel(0)
          .colors(window.d3.scale.category10())
          .legend(dcjs.legend().x(5).y(5).itemHeight(13).gap(5))
          .label(function (d) {
            return d.value;
          })
          .renderlet(function (chart) {
            chart.select('svg > g').attr('transform', 'translate(200,75)');
          })
          .render();
      };

      Charts.prototype.addRepoOwnerChart = function (all, repoOwner, repoOwnerGroup) {
        var availWidth = document.getElementById('repoFilterCharts').offsetWidth;
        dcjs.pieChart('#repo-owner-chart')
          .width(availWidth)
          .height(150)
          .transitionDuration(1000)
          .dimension(repoOwner)
          .group(repoOwnerGroup)
          .radius(70)
          .minAngleForLabel(0)
          .colors(window.d3.scale.category20())
          .label(function (d) {
            return d.value;
          })
          .legend(dcjs.legend().x(5).y(5).itemHeight(13).gap(5))
          .renderlet(function (chart) {
            chart.select('svg > g').attr('transform', 'translate(200,75)');
          })
          .render();
      };

      Charts.prototype.addRepoTable = function (repoUpdatedDimension) {
        dcjs.dataTable('#repo-data-table')
          .dimension(repoUpdatedDimension)
          .size(100)
          .group(function (d) {
            return d.repoType;
          })
          .columns([

            function (d) {
              return d.fullName;
            },
            function (d) {
              return moment(d.createdAt).format('L');
            },
            function (d) {
              return moment(d.updatedAt).format('L');
            },
            function (d) {
              return d.openIssues;
            },
            function (d) {
              return d.stargazers;
            }
          ])
          .sortBy(function (data) {
            return moment(data.updatedAt).valueOf();
          })
          .order(window.d3.descending)
          .renderlet(function (table) {
            table.selectAll('.dc-table-group').classed('info', true);
          })
          .render();
      };

      Charts.prototype.processCommitData = function (rawData) {
        _.each(rawData, function (data) {
          data.commitDate = new Date(data.commit.author.date);
          data.commitDay = window.d3.time.day(data.commitDate);
        }, this);
        this.data.commitData = crossfilter(rawData);
        this.data.all = this.data.commitData.groupAll();
        var sortedDate = _.sortBy(rawData, function (data) {
          return data.commitDate.getTime();
        });

        this.data.smallestGreatestDateOfCommits = {};
        if (0 !== this.data.commitData.size()) {
          this.data.smallestGreatestDateOfCommits.smallest = sortedDate[0].commitDate;
          this.data.smallestGreatestDateOfCommits.greatest = sortedDate[sortedDate.length - 1].commitDate;
        } else {
          console.log('filter seems not lead in any results');
        }

        this.data.commitsByDay = this.data.commitData.dimension(function (d) {
          return d.commitDay;
        });
        this.data.commitsByDayGroup = this.data.commitsByDay.group();

        this.data.commitsByAuthor = this.data.commitData.dimension(function (data) {
          return data.committer ? data.committer.login : '';
        });
        this.data.commitsByAuthorGroup = this.data.commitsByAuthor.group();
      };

      Charts.prototype.proccessCommentData = function (commitApproved) {
        this.data.commentedCommits = this.data.commitData.dimension(function (data) {
          /*jshint camelcase:false*/
          var commented = data.commit.comment_count > 0;
          var approved = commitApproved[data.sha] || false;
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

      Charts.prototype.fileTypeChart = function () {
        var chart = dcjs.rowChart('#file-type-chart');
        chart.width(180);
        chart.height(180);
        chart.margins({
          top: 20,
          left: 10,
          right: 10,
          bottom: 20
        });
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
        chart.render();
      };

      Charts.prototype.reviewStateChart = function (width, height) {
        var all = this.data.all;
        var chart = dcjs.pieChart('#review-state-chart');
        chart.width(width);
        chart.height(height);
        chart.transitionDuration(1000);
        chart.dimension(this.data.commentedCommits);
        chart.group(this.data.commentedCommitsGroup);
        chart.radius(70);
        chart.minAngleForLabel(0);
        chart.colors(window.d3.scale.ordinal().range(['#2EC73B', '#4EACF6', '#a60000']));
        chart.label(function (d) {
          var percentage = (d.value / all.value() * 100);
          var percentageString = '(' + (Math.round(percentage * 100) / 100) + '%)';
          if (chart.hasFilter() && !chart.hasFilter(d.key)) {
            percentageString = '(0%)';
          }
          return percentageString;
        });
        chart.legend(dcjs.legend().x(5).y(5).itemHeight(13).gap(5));
        chart.on('filtered', function (chart, filter) {
          $rootScope.$broadcast('filter:change:state', filter);
        });
        chart.render();
      };

      Charts.prototype.commitsPerAuthorChart = function (width, height) {
        var chart = dcjs.pieChart('#commitsPerAuthor-chart');
        chart.width(width);
        chart.height(height);
        chart.transitionDuration(1000);
        chart.dimension(this.data.commitsByAuthor);
        chart.group(this.data.commitsByAuthorGroup);
        chart.radius(70);
        chart.minAngleForLabel(0);
        chart.colors(window.d3.scale.category10());
        chart.label(function (d) {
          return d.value;
        });
        chart.legend(dcjs.legend().x(5).y(5).itemHeight(13).gap(5));
        chart.on('filtered', function (chart, filter) {
          $rootScope.$broadcast('filter:change:author', filter);
        });
        chart.render();
      };

      Charts.prototype.timeChart = function (width, height) {
        var chart = dcjs.barChart('#time-chart');
        chart.width(width);
        chart.height(height);
        chart.margins({
          top: 20,
          right: 0,
          bottom: 20,
          left: 30
        });
        chart.renderHorizontalGridLines(true);
        chart.dimension(this.data.commitsByDay);
        chart.group(this.data.commitsByDayGroup);
        chart.centerBar(true);
        chart.mouseZoomable(false);
        chart.round(window.d3.time.day.round);
        chart.alwaysUseRounding(true);
        var smallestGreatestDateOfCommits = this.data.smallestGreatestDateOfCommits;
        chart.x(window.d3.time.scale().domain([smallestGreatestDateOfCommits.smallest, smallestGreatestDateOfCommits.greatest]));
        chart.xUnits(window.d3.time.day);
        chart.elasticY(true);
        chart.brushOn(false);
        chart.render();
      };

      return Charts;
    }
  ]);
});
