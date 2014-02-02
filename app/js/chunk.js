/*global define*/
define(['underscore'], function (_) {
  'use strict';

  var chunkHeadingRegExp = new RegExp('@@.*?[-+](\\d+)(,\\d+){0,1}\\s[-+](\\d+)(,\\d+){0,1} @@', 'g');

  function Chunk(chunkLine) {
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
    this.addLine = function (line) {
      var computedLine = null;
      if (_.str.startsWith(line, '-')) {
        computedLine = this.addDeletedLine(line);
      } else if (_.str.startsWith(line, '+')) {
        computedLine = this.addAddedLine(line);
      } else {
        computedLine = this.addNormalLine(line);
      }
      this.lines.push(computedLine);
    };
  }

  Chunk.prototype.extractChunk = function (line) {
    chunkHeadingRegExp.exec(line);
    this.leftNr = parseInt(RegExp.$1, 10);
    this.rightNr = parseInt(RegExp.$3, 10);
  };

  Chunk.prototype.addDeletedLine = function (line) {
    return {
      lineNrLeft: this.leftNr++,
      lineNrRight: '',
      format: 'deleted',
      text: line
    };
  };

  Chunk.prototype.addAddedLine = function (line) {
    return {
      lineNrLeft: '',
      lineNrRight: this.rightNr++,
      format: 'added',
      text: line
    };
  };

  Chunk.prototype.addNormalLine = function (line) {
    return {
      lineNrLeft: this.leftNr++,
      lineNrRight: this.rightNr++,
      format: '',
      text: line
    };
  };

  return Chunk;
});