/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'when',
  'CommentCollection'
], function (Backbone, _, app, when, CommentCollection) {
  'use strict';
  var CommitModel = Backbone.Model.extend({
    comments: new CommentCollection(),
    getCommitCommentsDefer: null,
    initialize: function () {
      this.id = this.get('sha');
      if(_.isNull(this.get('author'))){
        var commit = this.get('commit');
        this.set('author', commit.author);
      }
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
      this.getCommitCommentsDefer = when.defer();
      app.github.repos.getCommitComments({
        user: app.currentReviewData.user,
        repo: app.currentReviewData.repo,
        sha: _this.get('sha')
      }, this.getCommitCommentCallback.bind(this));
      return this.getCommitCommentsDefer.promise;
    },
    getCommitCommentCallback: function (error, resp) {
      if (!error) {
        this.comments.reset(resp);
        this.getCommitCommentsDefer.resolve();
      }
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
          // FIXME its never called in case of error
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
      var comment = 'Approved by @' + app.user.login;
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
    },
    commitMessage: function () {
      var orgMessage = this.get('commit').message;
      var splits = _.str.lines(orgMessage);
      if (splits && splits.length > 0) {
        return splits;
      } else {
        return orgMessage;
      }
    }
  });

  return CommitModel;
});
