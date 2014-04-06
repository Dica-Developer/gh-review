/*global define, describe, beforeEach, afterEach, it, expect*/
define(['underscore', 'dc', 'Charts'], function (_, dc, Charts) {
  'use strict';

  describe('#Charts', function () {
    var charts = null;

    beforeEach(function () {
      charts = new Charts();
      dc.chartRegistry.clear();
    });

    afterEach(function () {
      charts = null;
    });

    it('Should be defined', function () {
      expect(Charts).toBeDefined();
    });

    it('charts.charts should be empty Object', function(){
      expect(charts.charts).toEqual({});
    });

    it('charts.data should be empty Object', function(){
      expect(charts.data).toEqual({});
    });

    it('charts.getAll should return charts.charts', function(){
      expect(charts.getAll()).toBe(charts.charts);
    });

    it('.set should store specific chart in charts.charts', function(){
      var testA = {
        'test': 'chart'
      };
      charts.set('testA', testA);
      expect(charts.charts.testA).toBe(testA);
      expect(_.size(charts.charts)).toBe(1);
    });

    it('.get should return specific chart identified by name', function(){
      var testA = {
        'test': 'chart'
      };
      charts.set('testA', testA);
      expect(charts.get('testA')).toBe(testA);
      expect(charts.get('testB')).toBe(undefined);
    });

    it('.fileTypeChart should store chart in charts.charts', function(){
      charts.data.fileTypeGroup = [];
      charts.data.fileType = [];
      var chart = charts.fileTypeChart();
      expect(charts.charts.fileTypeChart).toBe(chart);
    });

    it('.reviewStateChart should store chart in charts.charts', function(){
      charts.data.all = [];
      charts.data.commentedCommits = [];
      charts.data.commentedCommitsGroup = [];
      var chart = charts.reviewStateChart(20);
      expect(charts.charts.reviewStateChart).toBe(chart);
    });

    it('.commitsPerAuthorChart should store chart in charts.charts', function(){
      charts.data.commitsByAuthor = [];
      charts.data.commitsByAuthorGroup = [];
      var chart = charts.commitsPerAuthorChart(20);
      expect(charts.charts.commitsPerAuthorChart).toBe(chart);
    });

    it('.timeChart should store chart in charts.charts', function(){
      charts.data.commitsByDay = [];
      charts.data.commitsByDayGroup = [];
      charts.data.smallestGreatestDateOfCommits = {
        smallest: new Date(),
        greatest: new Date()
      };
      var chart = charts.timeChart(20);
      expect(charts.charts.timeChart).toBe(chart);
    });

  });

});
