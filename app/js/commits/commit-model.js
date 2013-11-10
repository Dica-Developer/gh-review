/*global define*/
define([
  'backbone',
  'app',
  'when',
  'moment',
  'commentCollection',
  'userModel'
], function (Backbone, app, when, commentCollection, user) {
  'use strict';
  var CommitModel = Backbone.Model.extend({
    initialize: function () {
      this.id = this.get('sha');
    },
    getDiff: function () {
      var defer = when.defer(),
        _this = this;
      if (!this.get('diff')) {
        app.github.repos.getCommit({
          user: app.currentReviewData.user,
          repo: app.currentReviewData.repo,
          sha: _this.get('sha')
        }, function (error, res) {
          _this.set('diff', res);
          defer.resolve();
        });
      } else {
        defer.resolve();
      }

      return defer.promise;
    },
    getCommitComments: function () {
      var _this = this;
      var defer = when.defer();
      app.github.repos.getCommitComments({
        user: app.currentReviewData.user,
        repo: app.currentReviewData.repo,
        sha: _this.get('sha')
      }, function (error, resp) {
        if (!error) {
          commentCollection.reset(resp);
          defer.resolve();
        }
      });
      return defer.promise;
    },
    addLineComment: function (fileIndex, position, comment) {
      var defer = when.defer();
      var diff = this.get('diff');
      var files = diff.files;
      var file = files[fileIndex];
      app.github.repos.createCommitComment({
        user: app.currentReviewData.user,
        repo: app.currentReviewData.repo,
        sha: this.get('sha'),
        body: comment,
        /* jshint camelcase:false */
        commit_id: file.sha,
        path: file.filename,
        position: position
      }, function (error/*, resp*/) {
        if (!error) {
          defer.resolve();
        } else {
          defer.reject();
          app.logger.error(error);
        }
      });
      return defer.promise;
    },
    approveCommit: function () {
      var defer = when.defer();
      var comment = 'Approved by @' + user.get('login');
      app.github.repos.createCommitComment({
        user: app.currentReviewData.user,
        repo: app.currentReviewData.repo,
        sha: this.get('sha'),
        /*jshint camelcase: false*/
        commit_id: this.get('sha'),
        body: comment
      }, function (error/*, resp*/) {
        if (!error) {
          defer.resolve();
        } else {
          defer.reject();
          app.logger.error(error);
        }
      });
      return defer.promise;
    }
  });

  return CommitModel;
});
