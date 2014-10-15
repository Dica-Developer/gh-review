/*global inject, _*/
describe('#commentProvider', function () {
  'use strict';

  var commentProvider;
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

  beforeEach(inject(function ($injector) {
    commentProvider = $injector.get('commentProvider');
  }));

  it('Should be defined', function () {
    expect(commentProvider).toBeDefined();
  });

  it('Should have correct API', function () {
    expect(commentProvider.getCommentsForCommit).toBeDefined();
  });

  describe('.getCommentsForCommit', function () {
    var github, $rootScope, commentCollector, Comment, $q;

    beforeEach(inject(function ($injector) {
      $rootScope = $injector.get('$rootScope');
      github = $injector.get('github');
      commentCollector = $injector.get('commentCollector');
      Comment = $injector.get('Comment');
      spyOn(github.repos, 'getCommitComments');
      $q = $injector.get('$q');
    }));

    it('Should reject if github.repos.getCommitComments returns error', function (done) {
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

    it('Should return one approver', function (done) {
      var defer = $q.defer();
      defer.resolve({
        '123': true
      });
      spyOn(commentCollector, 'getCommitApproved').and.returnValue(defer.promise);
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
      var defer = $q.defer();
      defer.resolve({
        '123': false
      });
      spyOn(commentCollector, 'getCommitApproved').and.returnValue(defer.promise);
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
      var defer = $q.defer();
      defer.resolve({
        '123': true
      });
      spyOn(commentCollector, 'getCommitApproved').and.returnValue(defer.promise);
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
      var defer = $q.defer();
      defer.resolve({
        '123': true
      });
      spyOn(commentCollector, 'getCommitApproved').and.returnValue(defer.promise);
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
      var defer = $q.defer();
      defer.resolve({
        '123': true
      });
      spyOn(commentCollector, 'getCommitApproved').and.returnValue(defer.promise);
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