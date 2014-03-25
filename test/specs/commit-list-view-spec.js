/*globals define, describe, it, expect, beforeEach, afterEach, _*/
define(function (require) {
  'use strict';

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
      var filterModel = new FilterModel();
      var filter = filterModel.toJSON();
      expect(_.size(filter)).toBe(0);
    });

    it('Init not empty', function () {
      var filterModel = new FilterModel();
      filterModel.setOwner('owner');
      filterModel.setRepo('repo');
      filterModel.setBranch('branch');
      filterModel.setContributor('contributor');
      filterModel.setSinceObject({
        pattern: 'YYYY-MM-dd',
        amount: '24'
      });
      filterModel.setUntil('until');
      filterModel.setPath('path');
      var filterModelJson = filterModel.toJSON();
      expect(filterModelJson.user).toBe('owner');
      expect(filterModelJson.repo).toBe('repo');
      expect(filterModelJson.branch).toBe('branch');
      expect(filterModelJson.contributor).toBe('contributor');
      expect(filterModelJson.until).toBe('until');
      expect(filterModelJson.path).toBe('path');
      expect(filterModelJson.since).toBeDefined();
    });
  });
});