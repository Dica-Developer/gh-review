/*global define, describe, it, expect, beforeEach, spyOn*/
define(['chunk'], function (Chunk) {
  'use strict';

  var patchString = '@@ -5,4 +5,5 @@ coverage/\n node_modules/\n bower_components/\n .DS_Store\n-app/css/main.css\n\\ No newline at end of file\n+app/css/main.css\n+app/js/options.js\n\\ No newline at end of file';
  var chunkSplit = patchString.split('\n');
  var deletedLine = chunkSplit[4];
  var addedLine = chunkSplit[6];
  var normalLine = chunkSplit[1];

  describe('#Chunk', function () {

    it('should be defined', function () {

      expect(Chunk).toBeDefined();

    });

    describe('new Chunk(line)', function () {
      var chunk = null;
      beforeEach(function () {
        chunk = new Chunk(chunkSplit[0]);
      });

      it('Should have all methods', function () {
        expect(chunk.addLine).toBeDefined();
        expect(chunk.extractChunk).toBeDefined();
        expect(chunk.addDeletedLine).toBeDefined();
        expect(chunk.addAddedLine).toBeDefined();
        expect(chunk.addNormalLine).toBeDefined();
      });

      it('Should set leftNr and rightNr', function () {
        expect(chunk.leftNr).toBe(5);
        expect(chunk.rightNr).toBe(5);
      });

      it('.addLine should call addDeletedLine', function () {
        var addDeletedLineSpy = spyOn(chunk, 'addDeletedLine');
        chunk.addLine(deletedLine);
        expect(addDeletedLineSpy).toHaveBeenCalledWith(deletedLine);
      });

      it('.addLine should call addAddedLine', function () {
        var addAddedLineSpy = spyOn(chunk, 'addAddedLine');
        chunk.addLine(addedLine);
        expect(addAddedLineSpy).toHaveBeenCalledWith(addedLine);
      });

      it('.addLine should call addNormalLine', function () {
        var addNormalLineSpy = spyOn(chunk, 'addNormalLine');
        chunk.addLine(normalLine);
        expect(addNormalLineSpy).toHaveBeenCalledWith(normalLine);
      });

      it('addDeletedLine should return correct object', function () {
        var deletedLineReturn = {
          lineNrLeft: 5,
          lineNrRight: '',
          format: 'deleted',
          text: '-app/css/main.css'
        };
        expect(chunk.addDeletedLine(deletedLine)).toEqual(deletedLineReturn);
      });

      it('addAddedLine should return correct object', function () {
        var addedLineReturn = {
          lineNrLeft: '',
          lineNrRight: 5,
          format: 'added',
          text: '+app/css/main.css'
        };
        expect(chunk.addAddedLine(addedLine)).toEqual(addedLineReturn);
      });

      it('addNormalLine should return correct object', function () {
        var normalLineReturn = {
          lineNrLeft: 5,
          lineNrRight: 5,
          format: '',
          text: ' node_modules/'
        };
        expect(chunk.addNormalLine(normalLine)).toEqual(normalLineReturn);
      });

    });

  });

});
