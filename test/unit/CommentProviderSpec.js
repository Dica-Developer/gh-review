define(function (require) {
  'use strict';

  var angular = require('angular'),
    mocks = require('angularMocks'),
    _ = require('lodash');

  require('app');

  var githubOptions = {
    user: 'testUser',
    repo: 'testRepo',
    sha: 'testSha'
  };

  var comment = {
    'commit_id': '123',
    'id': '456',
    'user': {
      'login': 'testUser'
    },
    'line': null,
    'position': null
  };

  beforeEach(angular.mock.module('GHReview'));

  describe('#commentProvider', function () {
    var commentProvider;

    beforeEach(mocks.inject(function ($injector) {
      commentProvider = $injector.get('commentProvider');
    }));

    it('Should be defined', function () {
      expect(commentProvider).toBeDefined();
    });

    it('Should have correct API', function () {
      expect(commentProvider.getCommentsForCommit).toBeDefined();
    });

    describe('.getCommentsForCommit', function () {
      var github, authenticated, $rootScope, commentCollector, Comment;

      beforeEach(mocks.inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        github = $injector.get('github');
        authenticated = $injector.get('authenticated');
        commentCollector = $injector.get('commentCollector');
        Comment = $injector.get('Comment');
        spyOn(github.repos, 'getCommitComments');
      }));

      it('Should reject if not authenticated', function (done) {
        spyOn(authenticated, 'get').and.returnValue(false);
        commentProvider.getCommentsForCommit(githubOptions)
          .then(null, function (reason) {
            expect(reason).toBeDefined();
            expect(reason.message).toBe('Not authenticated');
            done();
          });
        $rootScope.$apply();
      });

      it('Should call github.repos.getCommitComments', function () {
        spyOn(authenticated, 'get').and.returnValue(true);
        commentProvider.getCommentsForCommit(githubOptions);
        expect(github.repos.getCommitComments).toHaveBeenCalled();
        expect(github.repos.getCommitComments.calls.argsFor(0)[0]).toEqual({
          user: 'testUser',
          repo: 'testRepo',
          sha: 'testSha',
          headers: {
            Accept: 'application/vnd.github-commitcomment.html+json'
          }
        });
      });

      it('Should reject if github.repos.getCommitComments returns error', function (done) {
        spyOn(authenticated, 'get').and.returnValue(true);
        commentProvider.getCommentsForCommit(githubOptions)
          .then(null, function (reason) {
            expect(reason).toEqual({
              Error: 'Error'
            });
            done();
          });
        var callback = github.repos.getCommitComments.calls.argsFor(0)[1];
        callback({
          Error: 'Error'
        }, null);
        $rootScope.$apply();
      });

      it('Should call commentCollector.getCommitApproved and commentCollector.getApproveComments', function (done) {
        spyOn(authenticated, 'get').and.returnValue(true);
        spyOn(commentCollector, 'getCommitApproved').and.returnValue({
          '123': true
        });
        spyOn(commentCollector, 'getApproveComments').and.returnValue({
          '456': true
        });
        commentProvider.getCommentsForCommit(githubOptions)
          .then(function () {
            expect(commentCollector.getCommitApproved).toHaveBeenCalled();
            expect(commentCollector.getApproveComments).toHaveBeenCalled();
            done();
          });
        var callback = github.repos.getCommitComments.calls.argsFor(0)[1];
        callback(null, [comment]);
        $rootScope.$apply();
      });

      it('Should return one approver', function (done) {
        spyOn(authenticated, 'get').and.returnValue(true);
        spyOn(commentCollector, 'getCommitApproved').and.returnValue({
          '123': true
        });
        spyOn(commentCollector, 'getApproveComments').and.returnValue({
          '456': true
        });
        commentProvider.getCommentsForCommit(githubOptions)
          .then(function (result) {
            expect(result.approvers.length).toBe(1);
            expect(result.approvers[0]).toBe('testUser');
            done();
          });
        var callback = github.repos.getCommitComments.calls.argsFor(0)[1];
        callback(null, [comment]);
        $rootScope.$apply();
      });

      it('Should return no approver', function (done) {
        spyOn(authenticated, 'get').and.returnValue(true);
        spyOn(commentCollector, 'getCommitApproved').and.returnValue({
          '123': false
        });
        spyOn(commentCollector, 'getApproveComments').and.returnValue({
          '456': true
        });
        commentProvider.getCommentsForCommit(githubOptions)
          .then(function (result) {
            expect(result.approvers.length).toBe(0);
            done();
          });
        var callback = github.repos.getCommitComments.calls.argsFor(0)[1];
        callback(null, [comment]);
        $rootScope.$apply();
      });

      it('Should return one line comment if comment.line not null', function (done) {
        spyOn(authenticated, 'get').and.returnValue(true);
        spyOn(commentCollector, 'getCommitApproved').and.returnValue({
          '123': true
        });
        spyOn(commentCollector, 'getApproveComments').and.returnValue({
          '456': true
        });
        commentProvider.getCommentsForCommit(githubOptions)
          .then(function (result) {
            expect(result.comments.lineComments.length).toBe(1);
            expect(result.comments.commitComments.length).toBe(0);
            expect(result.comments.lineComments[0] instanceof Comment).toBeTruthy();
            expect(result.comments.lineComments[0].editInformations).toEqual({
              user: 'testUser',
              repo: 'testRepo'
            });
            done();
          });
        var callback = github.repos.getCommitComments.calls.argsFor(0)[1];
        var commentClone = _.clone(comment);
        commentClone.line = 23;
        callback(null, [commentClone]);
        $rootScope.$apply();
      });

      it('Should return one line comment if comment.position not null', function (done) {
        spyOn(authenticated, 'get').and.returnValue(true);
        spyOn(commentCollector, 'getCommitApproved').and.returnValue({
          '123': true
        });
        spyOn(commentCollector, 'getApproveComments').and.returnValue({
          '456': true
        });
        commentProvider.getCommentsForCommit(githubOptions)
          .then(function (result) {
            expect(result.comments.lineComments.length).toBe(1);
            expect(result.comments.commitComments.length).toBe(0);
            expect(result.comments.lineComments[0] instanceof Comment).toBeTruthy();
            expect(result.comments.lineComments[0].editInformations).toEqual({
              user: 'testUser',
              repo: 'testRepo'
            });
            done();
          });
        var callback = github.repos.getCommitComments.calls.argsFor(0)[1];
        var commentClone = _.clone(comment);
        commentClone.position = 23;
        callback(null, [commentClone]);
        $rootScope.$apply();
      });

      it('Should return commit comment if comment.line and comment.position is null', function (done) {
        spyOn(authenticated, 'get').and.returnValue(true);
        spyOn(commentCollector, 'getCommitApproved').and.returnValue({
          '123': true
        });
        spyOn(commentCollector, 'getApproveComments').and.returnValue({
          '456': true
        });
        commentProvider.getCommentsForCommit(githubOptions)
          .then(function (result) {
            expect(result.comments.lineComments.length).toBe(0);
            expect(result.comments.commitComments.length).toBe(1);
            expect(result.comments.commitComments[0] instanceof Comment).toBeTruthy();
            expect(result.comments.commitComments[0].editInformations).toEqual({
              user: 'testUser',
              repo: 'testRepo'
            });
            done();
          });
        var callback = github.repos.getCommitComments.calls.argsFor(0)[1];
        callback(null, [comment]);
        $rootScope.$apply();
      });

    });
  });
});
