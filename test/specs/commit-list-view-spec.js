/*globals define, describe, it, expect, beforeEach, afterEach, _*/
define(function (require) {
  'use strict';

  var app = require('app');
  var CommentListView = require('CommitListView');
  var FilterModel = require('FilterModel');

  describe('#CommentView', function () {

    var commentListView = null;

    beforeEach(function () {

    });

    afterEach(function () {
      commentListView = null;
    });

    it('Should be defined', function () {
      expect(CommentListView).toBeDefined();
    });

    it('Init empty', function () {
      var filterModel = new FilterModel({});
      commentListView = new CommentListView({
        model: filterModel
      });
      expect(_.size(app.currentReviewData)).toBe(2);
      expect(app.currentReviewData.sha).toBe('master');
      expect(app.currentReviewData.since).toBeDefined();
    });

    it('Init not empty', function () {
      var filterModel = new FilterModel({
        owner: 'owner',
        repo: 'repo',
        branch: 'branch',
        contributor: 'contributor',
        since: {
          pattern: 'YYYY-MM-dd',
          amount: '24'
        },
        until: 'until',
        path: 'path'
      });
      commentListView = new CommentListView({
        model: filterModel
      });
      expect(app.currentReviewData.user).toBe('owner');
      expect(app.currentReviewData.repo).toBe('repo');
      expect(app.currentReviewData.sha).toBe('branch');
      expect(app.currentReviewData.author).toBe('contributor');
      expect(app.currentReviewData.until).toBe('until');
      expect(app.currentReviewData.path).toBe('path');
      expect(app.currentReviewData.since).toBeDefined();
    });
  });
});