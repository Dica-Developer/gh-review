/*global define, Rainbow*/
define([
  'backbone',
  'underscore',
  'when',
  'app',
  'text!../templates/comment-view.html',
  'text!../templates/comment-box.html'
], function(Backbone, _, when, app, template, boxTemplate){
  'use strict';

  var chunkHeadingRegExp = new RegExp('@@.*?[-+](\\d+)(,\\d+){0,1}\\s[-+](\\d+)(,\\d+){0,1} @@', 'g');

  function Chunk(chunkLine){
    this.leftNr = 0;
    this.rightNr = 0;
    this.extractChunk(chunkLine);
    this.lines = [
      {
        lineNrLeft: '...',
        lineNrRight: '...',
        format: 'chunk-header',
        text: chunkLine
      }
    ];
    this.addLine = function(line){
      var computedLine = null;
      if(line.startsWith('-')){
        computedLine = this.addDeletedLine(line);
      } else if(line.startsWith('+')){
        computedLine = this.addAddedLine(line);
      } else {
        computedLine = this.addNormalLine(line);
      }
      this.lines.push(computedLine);
    };
  }

  Chunk.prototype.extractChunk = function(line){
    chunkHeadingRegExp.exec(line);
    this.leftNr = parseInt(RegExp.$1, 10);
    this.rightNr = parseInt(RegExp.$3, 10);
  };

  Chunk.prototype.addDeletedLine = function(line){
    line = line.replace('-', ' ');
    return {
      lineNrLeft: this.leftNr++,
      lineNrRight: '',
      format: 'deleted',
      text: line
    };
  };

  Chunk.prototype.addAddedLine = function(line){
    line = line.replace('+', ' ');
    return {
      lineNrLeft: '',
      lineNrRight: this.rightNr++,
      format: 'added',
      text: line
    };
  };

  Chunk.prototype.addNormalLine = function(line){
    return {
      lineNrLeft: this.leftNr++,
      lineNrRight: this.rightNr++,
      format: '',
      text: line
    };
  };

  function CommentBox(line){
    var box = $(boxTemplate);
    line.after(box);
    return box;
  }

  var CommentView = Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    EOLRegExp: new RegExp('\\n|\\n\\r|\\r','g'),
    commentBox: null,
    initialize: function(){
      var _this = this;
      this.files = [];
      this.model.getDiff()
        .then(function(){
          return _this.computeChunk();
        })
        .then(function(){
          return _this.render();
        });
    },
    events: {
      'click .added,.deleted': 'commentLine'
    },
    computeChunk: function(){
      var defer = when.defer();
      var files = this.model.get('diff').files;
      _.forEach(files, function(file, fileIndex, array){
        this.files.push({
          chunks: []
        });
        var patchSplit = file.patch.split(this.EOLRegExp);
        _.forEach(patchSplit, function(line){
          line = app.string.escapeHTML(line);
          if(line.match(chunkHeadingRegExp)){
            this.files[fileIndex].chunks.push(new Chunk(line));
          } else {
            this.files[fileIndex].chunks[this.files[fileIndex].chunks.length -1].addLine(line);
          }
        }, this);
        if(fileIndex === (array.length -1)){
          defer.resolve();
        }
      }, this);
      return defer.promise;
    },
    commentLine: function(event){
      var line = $(event.target).closest('tr');
      if(this.commentBox){
        this.commentBox.remove();
      }
      this.commentBox = new CommentBox(line);
    },
    render: function(){
      var diff = this.model.get('diff');
      diff.computedFiles = this.files;
      this.$el.html(this.template(diff));
      Rainbow.color();
    }
  });

  return CommentView;
});
