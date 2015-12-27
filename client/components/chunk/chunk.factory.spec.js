/*global inject*/
describe('Factory: Chunk', function () {
  'use strict';

  var Chunk;
  var lines = [
    '@@ -42,7 +42,7 @@ define([\'angular\', \'lodash\', \'moment\'], function (angular, _, moment) {',
    ' if (!_.isNull(this.options.meta.id)) {',
    '-this.options = _.clone(localStorageService.get(\'filter-\' + this.options.meta.id), true);',
    '+_.extend(this.options, localStorageService.get(\'filter-\' + this.options.meta.id), true);'
  ];
  var chunkLine = [lines[0]];
  var normalLine = [lines[1]];
  var deletedLine = [lines[2]];
  var addedLine = [lines[3]];

  beforeEach(module('GHReview'));

  beforeEach(inject(function ($injector) {
    Chunk = $injector.get('Chunk');
  }));

  it('Should be defined', function () {
    expect(Chunk).toBeDefined();
  });

  it('Should have correct API', function () {
    var chunk = new Chunk([]);
    expect(chunk.extractChunk).toBeDefined();
    expect(chunk.addChunkLine).toBeDefined();
    expect(chunk.addDeletedLine).toBeDefined();
    expect(chunk.addAddedLine).toBeDefined();
    expect(chunk.addNormalLine).toBeDefined();
    expect(chunk.isMatchingChunkHeading).toBeDefined();
    expect(chunk.isAddition).toBeDefined();
    expect(chunk.isDeletion).toBeDefined();
    expect(chunk.isSame).toBeDefined();
  });

  it('Should correct start line number', function () {
    var chunk = new Chunk(chunkLine);
    expect(chunk.leftNr).toBe(42);
    expect(chunk.rightNr).toBe(42);
  });

  it('Should add chunk line', function () {
    var chunk = new Chunk(chunkLine);
    var lines = chunk.lines;
    expect(lines.length).toBe(1);
    expect(lines[0].format).toBe('chunk-header');
    expect(lines[0].lineNrLeft).toBe('...');
    expect(lines[0].lineNrRight).toBe('...');
    expect(lines[0].text).toBe('@@ -42,7 +42,7 @@ define([\'angular\', \'lodash\', \'moment\'], function (angular, _, moment) {');
  });

  it('Should add normal line', function () {
    var chunk = new Chunk(normalLine);
    var lines = chunk.lines;
    expect(lines.length).toBe(1);
    expect(lines[0].format).toBe('');
    expect(lines[0].lineNrLeft).toBe(0);
    expect(lines[0].lineNrRight).toBe(0);
    expect(lines[0].text).toBe(' if (!_.isNull(this.options.meta.id)) {');
  });

  it('Should add added line', function () {
    var chunk = new Chunk(addedLine);
    var lines = chunk.lines;
    expect(lines.length).toBe(1);
    expect(lines[0].format).toBe('added');
    expect(lines[0].lineNrLeft).toBe('');
    expect(lines[0].lineNrRight).toBe(0);
    expect(lines[0].text).toBe('+_.extend(this.options, localStorageService.get(\'filter-\' + this.options.meta.id), true);');
  });

  it('Should add deleted line', function () {
    var chunk = new Chunk(deletedLine);
    var lines = chunk.lines;
    expect(lines.length).toBe(1);
    expect(lines[0].format).toBe('deleted');
    expect(lines[0].lineNrLeft).toBe(0);
    expect(lines[0].lineNrRight).toBe('');
    expect(lines[0].text).toBe('-this.options = _.clone(localStorageService.get(\'filter-\' + this.options.meta.id), true);');
  });

  describe('#chunk', function () {
    var chunk;

    beforeEach(inject(function ($injector) {
      var Chunk = $injector.get('Chunk');
      chunk = new Chunk();
    }));

    describe('.isMatchingChunkHeading', function () {

      it('Should return true', function () {
        expect(chunk.isMatchingChunkHeading(chunkLine[0])).toBeTruthy();
      });

      it('Should return null', function () {
        expect(chunk.isMatchingChunkHeading(normalLine[0])).toBeNull();
      });

    });

    describe('.isAddition', function () {

      it('Should return true', function () {
        expect(chunk.isAddition(addedLine[0])).toBeTruthy();
      });

      it('Should return false', function () {
        expect(chunk.isAddition(normalLine[0])).toBeFalsy();
      });

    });

    describe('.isDeletion', function () {

      it('Should return true', function () {
        expect(chunk.isDeletion(deletedLine[0])).toBeTruthy();
      });

      it('Should return false', function () {
        expect(chunk.isDeletion(normalLine[0])).toBeFalsy();
      });

    });

    describe('.isSame', function () {

      it('Should return true', function () {
        expect(chunk.isSame(normalLine[0])).toBeTruthy();
      });

      it('Should return false', function () {
        expect(chunk.isSame(chunkLine[0])).toBeFalsy();
      });

    });

  });
});