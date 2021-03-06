describe('Service: github-comment', function () {
  'use strict';

  beforeEach(module('GHReview'));

  var github, $rootScope, ghComments;

  beforeEach(inject(function ($injector) {
    github = $injector.get('github');
    $rootScope = $injector.get('$rootScope');
    ghComments = $injector.get('ghComments');
  }));

  describe('.getForCommit', function(){

    it('should call github.repos.getCommitComments', function () {
      spyOn(github.repos, 'getCommitComments');
      ghComments.getForCommit({});
      expect(github.repos.getCommitComments).toHaveBeenCalled();
    });

    it('should return promise and resolve if data exist', function (done) {
      spyOn(github.repos, 'getCommitComments');
      ghComments.getForCommit({})
        .then(function (data) {
          expect(data).toBeDefined();
          expect(data.result).toBe('testResult');
          done();
        });
      var callback = github.repos.getCommitComments.calls.argsFor(0)[1];
      callback(null, { result: 'testResult' });
      expect(github.repos.getCommitComments).toHaveBeenCalled();
      $rootScope.$apply();
    });

    it('should remove meta property from response', function (done) {
      spyOn(github.repos, 'getCommitComments');
      ghComments.getForCommit({})
        .then(function (data) {
          expect(data).toBeDefined();
          expect(data.meta).not.toBeDefined();
          done();
        });
      var callback = github.repos.getCommitComments.calls.argsFor(0)[1];
      callback(null, { result: 'testResult', meta: true });
      expect(github.repos.getCommitComments).toHaveBeenCalled();
      $rootScope.$apply();
    });

    it('should return promise and reject if error exist', function (done) {
      spyOn(github.repos, 'getCommitComments');
      ghComments.getForCommit({})
        .then(null, function (error) {
          expect(error).toBeDefined();
          expect(error.name).toBe('Error');
          done();
        });
      var callback = github.repos.getCommitComments.calls.argsFor(0)[1];
      callback({ name: 'Error' }, null);
      expect(github.repos.getCommitComments).toHaveBeenCalled();
      $rootScope.$apply();
    });

  });

  describe('.addCommitComment', function(){

    it('should call github.repos.createCommitComment', function () {
      spyOn(github.repos, 'createCommitComment');
      ghComments.addCommitComment({});
      expect(github.repos.createCommitComment).toHaveBeenCalled();
    });

    it('should return promise and resolve error is null', function (done) {
      spyOn(github.repos, 'createCommitComment');
      ghComments.addCommitComment({})
        .then(function (data) {
          expect(data).toBeDefined();
          expect(data.result).toBe('testResult');
          done();
        });
      var callback = github.repos.createCommitComment.calls.argsFor(0)[1];
      callback(null, { result: 'testResult' });
      expect(github.repos.createCommitComment).toHaveBeenCalled();
      $rootScope.$apply();
    });

    it('should return promise and reject if error exist', function (done) {
      spyOn(github.repos, 'createCommitComment');
      ghComments.addCommitComment({})
        .then(null, function (error) {
          expect(error).toBeDefined();
          expect(error.name).toBe('Error');
          done();
        });
      var callback = github.repos.createCommitComment.calls.argsFor(0)[1];
      callback({ name: 'Error' }, null);
      expect(github.repos.createCommitComment).toHaveBeenCalled();
      $rootScope.$apply();
    });

  });

  describe('.addLineComment', function(){

    it('should call github.repos.createCommitComment', function () {
      spyOn(github.repos, 'createCommitComment');
      ghComments.addLineComment({});
      expect(github.repos.createCommitComment).toHaveBeenCalled();
    });

    it('should return promise and resolve error is null', function (done) {
      spyOn(github.repos, 'createCommitComment');
      ghComments.addLineComment({})
        .then(function (data) {
          expect(data).toBeDefined();
          expect(data.result).toBe('testResult');
          done();
        });
      var callback = github.repos.createCommitComment.calls.argsFor(0)[1];
      callback(null, { result: 'testResult' });
      expect(github.repos.createCommitComment).toHaveBeenCalled();
      $rootScope.$apply();
    });

    it('should return promise and reject if error exist', function (done) {
      spyOn(github.repos, 'createCommitComment');
      ghComments.addLineComment({})
        .then(null, function (error) {
          expect(error).toBeDefined();
          expect(error.name).toBe('Error');
          done();
        });
      var callback = github.repos.createCommitComment.calls.argsFor(0)[1];
      callback({ name: 'Error' }, null);
      expect(github.repos.createCommitComment).toHaveBeenCalled();
      $rootScope.$apply();
    });

  });

  describe('.deleteComment', function(){

    it('should call github.repos.deleteCommitComment', function () {
      spyOn(github.repos, 'deleteCommitComment');
      ghComments.deleteComment({});
      expect(github.repos.deleteCommitComment).toHaveBeenCalled();
    });

    it('should return promise and resolve error is null', function (done) {
      spyOn(github.repos, 'deleteCommitComment');
      ghComments.deleteComment({})
        .then(function () {
          done();
        });
      var callback = github.repos.deleteCommitComment.calls.argsFor(0)[1];
      callback(null, { result: 'testResult' });
      expect(github.repos.deleteCommitComment).toHaveBeenCalled();
      $rootScope.$apply();
    });

    it('should return promise and reject if error exist', function (done) {
      spyOn(github.repos, 'deleteCommitComment');
      ghComments.deleteComment({})
        .then(null, function (error) {
          expect(error).toBeDefined();
          expect(error.name).toBe('Error');
          done();
        });
      var callback = github.repos.deleteCommitComment.calls.argsFor(0)[1];
      callback({ name: 'Error' }, null);
      expect(github.repos.deleteCommitComment).toHaveBeenCalled();
      $rootScope.$apply();
    });

  });

  describe('.updateComment', function(){

    it('should call github.repos.updateCommitComment', function () {
      spyOn(github.repos, 'updateCommitComment');
      ghComments.updateComment({});
      expect(github.repos.updateCommitComment).toHaveBeenCalled();
    });

    it('should return promise and resolve error is null', function (done) {
      spyOn(github.repos, 'updateCommitComment');
      ghComments.updateComment({})
        .then(function (data) {
          expect(data).toBeDefined();
          expect(data.result).toBe('testResult');
          done();
        });
      var callback = github.repos.updateCommitComment.calls.argsFor(0)[1];
      callback(null, { result: 'testResult' });
      expect(github.repos.updateCommitComment).toHaveBeenCalled();
      $rootScope.$apply();
    });

    it('should return promise and reject if error exist', function (done) {
      spyOn(github.repos, 'updateCommitComment');
      ghComments.updateComment({})
        .then(null, function (error) {
          expect(error).toBeDefined();
          expect(error.name).toBe('Error');
          done();
        });
      var callback = github.repos.updateCommitComment.calls.argsFor(0)[1];
      callback({ name: 'Error' }, null);
      expect(github.repos.updateCommitComment).toHaveBeenCalled();
      $rootScope.$apply();
    });

  });

  describe('.renderAsMarkdown', function(){

    it('should call github.markdown.render', function () {
      spyOn(github.markdown, 'render');
      ghComments.renderAsMarkdown({});
      expect(github.markdown.render).toHaveBeenCalled();
    });

    it('should return promise and resolve error is null', function (done) {
      spyOn(github.markdown, 'render');
      ghComments.renderAsMarkdown({})
        .then(function (data) {
          expect(data).toBeDefined();
          expect(data.result).toBe('testResult');
          done();
        });
      var callback = github.markdown.render.calls.argsFor(0)[1];
      callback(null, { result: 'testResult' });
      expect(github.markdown.render).toHaveBeenCalled();
      $rootScope.$apply();
    });

    it('should return promise and reject if error exist', function (done) {
      spyOn(github.markdown, 'render');
      ghComments.renderAsMarkdown({})
        .then(null, function (error) {
          expect(error).toBeDefined();
          expect(error.name).toBe('Error');
          done();
        });
      var callback = github.markdown.render.calls.argsFor(0)[1];
      callback({ name: 'Error' }, null);
      expect(github.markdown.render).toHaveBeenCalled();
      $rootScope.$apply();
    });

  });

});