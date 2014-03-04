/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'when',
  'CommentCollection'
], function (Backbone, _, app, when, CommentCollection) {
  'use strict';
  return Backbone.Model.extend({
    comments: new CommentCollection(),
    getCommitCommentsDefer: null,
    initialize: function () {
      this.id = this.get('sha');
      if (_.isNull(this.get('author'))) {
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
          if (!error) {
            _this.set('diff', res);
            defer.resolve();
          } else {
            defer.reject(error);
          }
        });
      } else {
        defer.resolve();
      }

      return defer.promise;
    },
    getHtmlCommitComments: function () {
      var _this = this;
      this.getCommitCommentsDefer = when.defer();
      app.github.repos.getCommitComments({
        user: app.currentReviewData.user,
        repo: app.currentReviewData.repo,
        sha: _this.get('sha'),
        headers: {
          'Accept': 'application/vnd.github-commitcomment.html+json'
        }
      }, this.getCommitCommentCallback.bind(this));
      return this.getCommitCommentsDefer.promise;
    },
    getCommitCommentCallback: function (error, resp) {
      if (!error) {
        this.comments.reset(resp);
        this.getCommitCommentsDefer.resolve();
      } else {
        this.getCommitCommentsDefer.reject(error);
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
        // TODO sha and commit ifd are the same. Why do we need both?
        sha: this.get('sha'),
        body: comment,
        /* jshint camelcase:false */
        commit_id: file.sha,
        path: file.filename,
        position: position
      }, function (error) {
        if (!error) {
          defer.resolve();
        } else {
          defer.reject(error);
        }
      });
      return defer.promise;
    },
    addCommitComment: function (comment) {
      var defer = when.defer();
      app.github.repos.createCommitComment({
        user: app.currentReviewData.user,
        repo: app.currentReviewData.repo,
        // TODO sha and commit id are the same. Why do we need both?
        sha: this.get('sha'),
        body: comment,
        /*jshint camelcase:false */
        commit_id: this.get('sha')
      }, function (error) {
        if (!error) {
          // FIXME its never called in case of error
          defer.resolve();
        } else {
          defer.reject(error);
        }
      });
      return defer.promise;
    },
    approveCommit: function () {
      var defer = when.defer();
      var commitState = {
        version: app.options.ghReview.version,
        approved: true,
        approver: app.user.login,
        approvalDate: Date.now()
      };
      var comment = '```json\n' + JSON.stringify(commitState, null, 2) + '\n```';
      app.github.repos.createCommitComment({
        user: app.currentReviewData.user,
        repo: app.currentReviewData.repo,
        // TODO sha and commit id are the same. Why do we need both?
        sha: this.get('sha'),
        /*jshint camelcase:false*/
        commit_id: this.get('sha'),
        body: comment
      }, function (error, resp) {
        if (!error) {
          defer.resolve(resp);
        } else {
          defer.reject(error);
        }
      });
      return defer.promise;
    },
    commitMessage: function () {
      var message = _.str.escapeHTML(this.get('commit').message);
      return _.str.lines(message);
    }
  });
});