/*global define*/
define(function (require) {
  'use strict';

  var Backbone = require('backbone'),
    _ = require('underscore'),
    when = require('when'),
    app = require('app'),
    Chunk = require('chunk'),
    CommentBoxes = require('commentBox'),
    template = require('text!templates/commit-view.html');

  var chunkHeadingRegExp = new RegExp('^@@.*?[-+](\\d+)(,\\d+){0,1}\\s[-+](\\d+)(,\\d+){0,1} @@', 'g');
  var EditCommentBox = CommentBoxes.edit;

  return Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    files: [],
    chunkDefer: null,
    commentBox: null,
    events: {
      'click .added,.deleted': 'commentLine',
      'click .approveCommit': 'approveCommit',
      'click #unApproveCommitButton': 'unApproveCommit'
    },
    initialize: function () {
    },
    getDiffAndComments: function () {
      return this.model.getDiff()
        .then(this.computeChunk.bind(this))
        .then(this.model.getHtmlCommitComments.bind(this.model));
    },
    computeChunk: function () {
      this.chunkDefer = when.defer();
      this.files = [];
      var files = this.model.get('diff').files;
      _.forEach(files, this.addFile, this);
      return this.chunkDefer.promise;
    },
    addFile: function (file, fileIndex, array) {
      this.files[fileIndex] = {
        chunks: []
      };
      var lines = _.str.lines(file.patch);
      _.forEach(lines, this.addLine, this);
      if (fileIndex === (array.length - 1)) {
        this.chunkDefer.resolve();
      }
    },
    addLine: function (line) {
      line = _.str.escapeHTML(line);
      var file = this.files[this.files.length - 1];
      var chunks = file.chunks;
      if (line.match(chunkHeadingRegExp)) {
        chunks.push(new Chunk(line));
      } else {
        chunks[chunks.length - 1].addLine(line);
      }
    },
    commentLine: function (event) {
      var target = $(event.target);
      var tr = target.closest('tr');
      var pre = tr.find('pre');
      var position = pre.data('position');
      var fileIndex = pre.data('fileindex');
      if (this.commentBox) {
        this.commentBox.remove();
      }
      this.commentBox = new EditCommentBox({
        model: this.model,
        tr: tr,
        position: position,
        fileIndex: fileIndex
      });
    },
    renderComments: function () {
      this.model.comments.renderComments();
    },
    approveCommit: function () {
      this.model.approveCommit()
        .then(this.addCommentToCollection.bind(this), this.handleError.bind(this));
    },
    addCommentToCollection: function (comment) {
      /*jshint camelcase:false*/
      app.commitApproved[comment.sha] = true;
      app.approveComments[comment.id] = true;
      this.model.comments.add(comment);
      this.render();
    },
    unApproveCommit: function (event) {
      this.model.comments.removeComment($(event.target).data('commentid'))
        .then(this.removeCommentFromCollection.bind(this), this.handleError.bind(this));
    },
    removeCommentFromCollection: function (model) {
      this.model.comments.remove(model);
      this.render();
    },
    handleError: function (error) {
      console.log(error);
    },
    render: function () {
      var approvers = this.model.comments.getApprovers();
      var approvedByUser = false;
      var approveCommentId = -1;
      if (!_.isUndefined(app.user) && !_.isNull(app.user)) {
        approvedByUser = _.contains(approvers, app.user.login);
        approveCommentId = this.model.comments.getApproveCommentId(app.user.login);
      }
      this.$el.html(this.template({
        model: this.model.toJSON(),
        message: this.model.commitMessage(),
        files: this.files,
        reviewData: app.currentFilter.toJSON(),
        approved: (true === app.commitApproved[this.model.get('sha')]),
        approvers: approvers,
        approvedByUser: approvedByUser,
        approveCommentId: approveCommentId
      }));
      this.renderComments();
      app.showIndicator(false);
    }
  });
});