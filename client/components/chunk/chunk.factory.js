(function (angular) {
  'use strict';

  var chunkModule = angular.module('GHReview');

  chunkModule.factory('Chunk', ['_', function (_) {
    if (typeof String.prototype.startsWith !== 'function') {
      String.prototype.startsWith = function (str) {
        return this.slice(0, str.length) === str;
      };
    }

    var chunkHeadingRegExp = new RegExp('^@@.*?[-+](\\d+)(,\\d+){0,1}\\s[-+](\\d+)(,\\d+){0,1} @@', 'g');

    function addLine(line, index) {
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
      return computedLine;
    }

    function Chunk(lines, path) {
      this.leftNr = 0;
      this.rightNr = 0;
      this.path = path;
      this.lines = _.map(lines, addLine.bind(this));
    }

    Chunk.prototype.extractChunk = function (line) {
      chunkHeadingRegExp.exec(line);
      return {
        leftNr: parseInt(RegExp.$1, 10),
        rightNr: parseInt(RegExp.$3, 10)
      };
    };

    Chunk.prototype.addChunkLine = function (line) {
      var lineNrs = this.extractChunk(line),
        lastNr = this.rightNr;

      this.leftNr = lineNrs.leftNr;
      this.rightNr = lineNrs.rightNr;
      return {
        lineNrLeft: '...',
        lineNrRight: '...',
        format: 'chunk-header',
        text: line,
        range: '' + lastNr + '-' + (this.rightNr - 1)
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

    Chunk.prototype.processFullBlob = function (blob) {
      this.blob = _.map(blob.split(/\r?\n/), function (line, index) {
        var lineNr = index + 1;
        return {
          lineNrLeft: lineNr,
          lineNrRight: lineNr,
          format: 'blob',
          text: ' ' + line
        };
      });
    };

    Chunk.prototype.expand = function (line) {
      var MAX_LINES_TO_ADD = 10,
        range = line.range.split('-'),
        rangeStart = parseInt(range[0], 10),
        rangeEnd = parseInt(range[1], 10);

      line.text = '';

      if(rangeStart !== 0){
        _.times(MAX_LINES_TO_ADD, function(){
          var INDEX_OF_CHUNK_LINE = _.findIndex(this.lines, line),
            previousLine = this.lines[INDEX_OF_CHUNK_LINE - 1],
            lineToAdd = this.blob[rangeStart];

          if(rangeStart > rangeEnd) {
            return;
          }

          lineToAdd.lineNrLeft = previousLine.lineNrLeft + 1;
          lineToAdd.lineNrRight = previousLine.lineNrRight + 1;
          this.lines.splice(INDEX_OF_CHUNK_LINE, 0, lineToAdd);
          rangeStart++;
        }, this);
      }

      if(rangeStart < rangeEnd) {
        _.times(MAX_LINES_TO_ADD, function(){
          var INDEX_OF_CHUNK_LINE = _.findIndex(this.lines, line),
            nextLine = this.lines[INDEX_OF_CHUNK_LINE + 1],
            lineToAdd = this.blob[rangeEnd];

          if(rangeStart > rangeEnd  || rangeEnd === 0) {
            return;
          }

          lineToAdd.lineNrLeft = nextLine.lineNrLeft - 1;
          lineToAdd.lineNrRight = nextLine.lineNrRight - 1;
          this.lines.splice(INDEX_OF_CHUNK_LINE + 1, 0, lineToAdd);
          rangeEnd--;
        }, this);
      }

      if(rangeStart > rangeEnd || rangeEnd === 0) {
        _.remove(this.lines, line);
      } else {
        line.range = '' + rangeStart + '-' + rangeEnd;
      }
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
  }]);
}(angular));