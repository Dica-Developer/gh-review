/*global define*/
define(['angular', 'lodash'], function (angular, _) {
  'use strict';

  var chunkModule = angular.module('GHReview.Chunk', []);

  chunkModule.factory('Chunk', function () {
    if (typeof String.prototype.startsWith !== 'function') {
      String.prototype.startsWith = function (str) {
        return this.slice(0, str.length) === str;
      };
    }

    var chunkHeadingRegExp = new RegExp('^@@.*?[-+](\\d+)(,\\d+){0,1}\\s[-+](\\d+)(,\\d+){0,1} @@', 'g');

    function Chunk(lines, path) {
      this.leftNr = 0;
      this.rightNr = 0;

      this.lines = [];
      this.addLine = function (line, index) {
        var computedLine = null;
        if (this.isMatchingChunkHeading(line)) {
          computedLine = this.addChunkLine(line);
        } else if (line.startsWith('-')) {
          computedLine = this.addDeletedLine(line);
        } else if (line.startsWith('+')) {
          computedLine = this.addAddedLine(line);
        } else {
          computedLine = this.addNormalLine(line);
        }
        computedLine.position = index;
        computedLine.path = path;
        this.lines.push(computedLine);
      };
      _.each(lines, this.addLine, this);
    }

    Chunk.prototype.extractChunk = function (line) {
      chunkHeadingRegExp.exec(line);
      return {
        leftNr: parseInt(RegExp.$1, 10),
        rightNr: parseInt(RegExp.$3, 10)
      };
    };

    Chunk.prototype.addChunkLine = function (line) {
      var lineNrs = this.extractChunk(line);
      this.leftNr = lineNrs.leftNr;
      this.rightNr = lineNrs.rightNr;
      return {
        lineNrLeft: '...',
        lineNrRight: '...',
        format: 'chunk-header',
        text: line
      };
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

    Chunk.prototype.isMatchingChunkHeading = function (line) {
      return line.match(chunkHeadingRegExp);
    };

    Chunk.prototype.isAddition = function (line) {
      return line.startsWith('+');
    };

    Chunk.prototype.isDeletion = function (line) {
      return line.startsWith('-');
    };

    Chunk.prototype.isSame = function (line) {
      return line.startsWith(' ');
    };

    return Chunk;
  });
});
