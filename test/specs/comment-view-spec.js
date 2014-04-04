/*globals define, describe, it, expect, beforeEach, afterEach, spyOn, waitsFor, runs*/
define(function (require) {
  'use strict';

  var when = require('when');
  var app = require('app');
  var _ = require('underscore');
  var CommentView = require('CommentView');
  var CommitModel = require('commitModel');
  var FilterModel = require('FilterModel');
  var Chunk = require('chunk');

  describe('#CommentView', function () {

    var commentView = null, filter = null;

    beforeEach(function () {
      filter = new FilterModel();
      filter.setOwner('TEST');
      filter.setRepo('testRepo');
      filter.setBranch('master');
      var commitModel = new CommitModel({
        sha: '12test345',
        author: 'test',
        diff: {
          'files': [{
            'sha': 'cc09446e24b4881902a395ebb1b6e030cf5fc5fa',
            'filename': 'test/test-main.js',
            'status': 'modified',
            'additions': 1,
            'deletions': 1,
            'changes': 2,
            'blob_url': 'https://github.com/Dica-Developer/gh-review/blob/31126e18d1e4e2072676602a1e85cbc388b1de86/test/test-main.js',
            'raw_url': 'https://github.com/Dica-Developer/gh-review/raw/31126e18d1e4e2072676602a1e85cbc388b1de86/test/test-main.js',
            'contents_url': 'https://api.github.com/repos/Dica-Developer/gh-review/contents/test/test-main.js?ref=31126e18d1e4e2072676602a1e85cbc388b1de86',
            'patch': '@@ -64,7 +64,7 @@\n \n       userModel: \'../app/js/user-model\',\n \n-      loginLogout: \'../app/js/login/loginLogout \',\n+      loginLogout: \'../app/js/login/loginLogout\',\n       OauthView: \'../app/js/oauth/oauth-view\'\n     },\n     map: {'
          }]
        },
        commit: ''
      });
      commentView = new CommentView({
        model: commitModel
      });
      commentView.filter = filter;
      commentView.model.comments.reset();
    });

    afterEach(function () {
      commentView = null;
    });

    it('Should be defined', function () {
      expect(CommentView).toBeDefined();
    });

    it('.getDiffAndComments should #CommitModel.getDiff', function () {
      var getDiffSpy = spyOn(commentView.model, 'getDiff').andReturn(when.promise(
        function (resolve) {
          resolve();
        }
      ));
      commentView.getDiffAndComments();

      expect(getDiffSpy).toHaveBeenCalled();
    });

    it('.renderComments should call #CommentView.model.comments.addComments', function () {
      spyOn(commentView.model.comments, 'renderComments');
      commentView.renderComments();
      expect(commentView.model.comments.renderComments).toHaveBeenCalled();
    });

    it('.approveCommit should call #CommentView.model.approveCommit and instantly mark commit as approved', function () {
      spyOn(commentView.model, 'approveCommit').andReturn(
        when.promise(function (resolve) {
          resolve({
            /*jshint camelcase:false*/
            commit_id: '123abc',
            id: 123,
            user: ''
          });
        })
      );
      commentView.approveCommit();
      expect(commentView.model.approveCommit).toHaveBeenCalled();

      waitsFor(function () {
        return (_.size(app.commitApproved) > 0);
      }, 'local commit approval', 5000);

      runs(function () {
        expect(app.commitApproved['123abc']).toBeTruthy();
        expect(app.approveComments[123]).toBeTruthy();
      });
    });

    describe('#CommentView.computeChunk', function () {

      it('Should reset CommentView.files to empty array', function () {
        spyOn(commentView, 'addFile');
        commentView.files = [1, 2, 3];
        commentView.computeChunk();
        expect(commentView.files.length).toBe(0);
      });

      it('Should call addFile as many as files exist in commit', function () {
        spyOn(commentView, 'addFile');
        commentView.computeChunk();
        expect(commentView.addFile).toHaveBeenCalled();
        expect(commentView.addFile.calls.length).toBe(1);
      });

    });

    describe('#CommentView.addFile', function () {

      it('Should call CommentView.addLine as many as lines the file has', function () {
        commentView.chunkDefer = when.defer();
        spyOn(commentView, 'addLine');
        var files = commentView.model.get('diff').files;
        commentView.addFile(files[0], 0, files);
        expect(commentView.addLine).toHaveBeenCalled();
        expect(commentView.addLine.calls.length).toBe(9);
      });

      it('Should add {chunks: []} to #CommentView.files', function () {
        commentView.chunkDefer = when.defer();
        spyOn(commentView, 'addLine');
        var files = commentView.model.get('diff').files;
        commentView.addFile(files[0], 0, files);
        expect(commentView.files.length).toBe(1);
        expect(commentView.files[0]).toEqual({
          chunks: []
        });
      });

    });

    describe('#CommentView.render', function () {

      it('Should call CommentView.renderComments', function () {
        spyOn(commentView, 'renderComments');
        spyOn(commentView, 'template');
        commentView.render();
        expect(commentView.renderComments).toHaveBeenCalled();
      });

      it('Should call #GH-Review.showIndicator with false', function () {
        spyOn(commentView, 'renderComments');
        spyOn(commentView, 'template');
        spyOn(app, 'showIndicator');
        commentView.render();
        expect(app.showIndicator).toHaveBeenCalledWith(false);
      });

      it('Should call #CommentView.template', function () {
        spyOn(commentView, 'renderComments');
        spyOn(commentView, 'template');
        commentView.render();
        expect(commentView.template).toHaveBeenCalled();
      });

    });

    describe('#CommentView.addLine', function () {
      it('add new chunk', function () {
        commentView.addLine('@@ -64,7 +64,7 @@');
        expect(commentView.files.length).toBe(1);
        expect(commentView.files[0].chunks.length).toBe(1);
        commentView.addLine('@@ -647 +64,7 @@');
        expect(commentView.files.length).toBe(1);
        expect(commentView.files[0].chunks.length).toBe(2);
        commentView.addLine('@@ -64,7 +647 @@');
        expect(commentView.files.length).toBe(1);
        expect(commentView.files[0].chunks.length).toBe(3);
      });

      it('add new line', function () {
        commentView.files = [{
          chunks: [new Chunk()]
        }];

        commentView.addLine(' @@ -64,7 +64,7 @@');
        expect(commentView.files.length).toBe(1);
        expect(commentView.files[0].chunks.length).toBe(1);
        expect(commentView.files[0].chunks[0].lines.length).toBe(2);
        commentView.addLine('@@ -64,7 +64,7 @');
        expect(commentView.files.length).toBe(1);
        expect(commentView.files[0].chunks.length).toBe(1);
        expect(commentView.files[0].chunks[0].lines.length).toBe(3);
        commentView.addLine(' @@ 64,7 +64,7 @@');
        expect(commentView.files.length).toBe(1);
        expect(commentView.files[0].chunks.length).toBe(1);
        expect(commentView.files[0].chunks[0].lines.length).toBe(4);
        commentView.addLine(' @@ -64,7 64,7 @@');
        expect(commentView.files.length).toBe(1);
        expect(commentView.files[0].chunks.length).toBe(1);
        expect(commentView.files[0].chunks[0].lines.length).toBe(5);
        commentView.addLine('f @@ -64,7 +64,7 @@');
        expect(commentView.files.length).toBe(1);
        expect(commentView.files[0].chunks.length).toBe(1);
        expect(commentView.files[0].chunks[0].lines.length).toBe(6);
        commentView.addLine('was komplett anderes');
        expect(commentView.files.length).toBe(1);
        expect(commentView.files[0].chunks.length).toBe(1);
        expect(commentView.files[0].chunks[0].lines.length).toBe(7);
      });
    });
  });
});