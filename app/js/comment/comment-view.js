/*global define*/
define([
  'backbone',
  'underscore',
  'when',
  'app',
  'chunk',
  'commentBox',
  'text!templates/comment-view.html'
], function (Backbone, _, when, app, Chunk, CommentBoxes, template) {
  'use strict';

  var chunkHeadingRegExp = new RegExp('@@.*?[-+](\\d+)(,\\d+){0,1}\\s[-+](\\d+)(,\\d+){0,1} @@', 'g');
  var EditCommentBox = CommentBoxes.edit;

  var CommentView = Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    files: [],
    commentBox: null,
    events: {
      'click .added,.deleted': 'commentLine',
      'click .approveCommit': 'approveCommit'
    },
    getDiffAndComments: function(){
      return this.model.getDiff()
        .then(this.computeChunk.bind(this))
        .then(this.model.getCommitComments.bind(this.model));
    },
    computeChunk: function () {
      var defer = when.defer();
      this.files = [];
      var files = this.model.get('diff').files;
      var length = files.length;
      _.forEach(files, function (file, fileIndex) {
        this.files[fileIndex] = { chunks: [] };
        var lines = _.str.lines(file.patch);
        _.forEach(lines, this.addLine, this);
        if (fileIndex === (length - 1)) {
          defer.resolve();
        }
      }, this);
      return defer.promise;
    },
    addLine: function (line) {
      line = _.str.escapeHTML(line);
      var file = this.files[this.files.length -1];
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
      var position = target.data('position');
      var fileIndex = target.data('fileindex');
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
    renderComments: function(){
      this.model.comments.addComments();
    },
    approveCommit: function () {
      this.model.approveCommit();
    },
    render: function () {
      app.showIndicator(false);
      this.$el.html(this.template({model: this.model.toJSON(), files: this.files}));
      this.renderComments();
    }
  });

  return CommentView;
});
