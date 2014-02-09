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
      var files = this.model.get('diff').files;
      _.forEach(files, function (file, fileIndex, array) {
        this.files.push({
          chunks: []
        });
        var lines = _.str.lines(file.patch);
        _.forEach(lines, function (line) {
          line = _.str.escapeHTML(line);
          if (line.match(chunkHeadingRegExp)) {
            this.files[fileIndex].chunks.push(new Chunk(line));
          } else {
            this.files[fileIndex].chunks[this.files[fileIndex].chunks.length - 1].addLine(line);
          }
        }, this);
        if (fileIndex === (array.length - 1)) {
          defer.resolve();
        }
      }, this);
      return defer.promise;
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
