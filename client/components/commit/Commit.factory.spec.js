describe('Factory: Commit', function () {
  'use strict';

  beforeEach(module('GHReview'));
  beforeEach(module('commitMockModule'));
  beforeEach(module('commentMockModule'));

  var Commit, commitsMock, commentsMock, ghCommits, ghComments, $q, $rootScope, $timeout, github;

  beforeEach(inject(function ($injector) {
    Commit = $injector.get('Commit');
    commitsMock = $injector.get('commitsMock');
    commentsMock = $injector.get('commentsMock');
    ghCommits = $injector.get('ghCommits');
    ghComments = $injector.get('ghComments');
    $q = $injector.get('$q');
    $rootScope = $injector.get('$rootScope');
    $timeout = $injector.get('$timeout');
    github = $injector.get('github');
  }));

  it('should be defined', function () {
    expect(Commit).toBeDefined();
  });


  describe('.getCommit', function () {
    var commit;

    beforeEach(function () {
      commit = new Commit();
    });

    it('Should add a well named cache object', function () {
      spyOn(github.repos, 'getCommit');
      commit.getCommit({user: 'TestUser', repo: 'testRepo', sha: 'testSha'});
      expect(commit.getCommit.cache.has('TestUser-testRepo-testSha')).toBe(true);
    });

    it('Should invalidate cache after a given time', function () {
      var cacheExpireTime = 10 * 60 * 1000; //10min

      spyOn(github.repos, 'getCommit');
      commit.getCommit({user: 'TestUser', repo: 'testRepo', sha: 'testSha'});
      expect(commit.getCommit.cache.has('TestUser-testRepo-testSha')).toBe(true);
      $timeout.flush(cacheExpireTime + 1);
      expect(commit.getCommit.cache.has('TestUser-testRepo-testSha')).toBe(false);
    });
  });

  describe('.getFiles', function () {

    var commit;

    beforeEach(function () {
      commit = new Commit({user: 'TestUser', repo: 'testRepo', sha: 'testSha'});
    });

    it('should call .getCommit', function () {
      spyOn(commit, 'getCommit').and.returnValue($q.when());

      commit.getFiles();

      expect(commit.getCommit).toHaveBeenCalledWith({user: 'TestUser', repo: 'testRepo', sha: 'testSha'});
    });

    it('should return a promise', function () {
      spyOn(commit, 'getCommit').and.returnValue($q.when());

      var expectedPromise = commit.getFiles();

      expect(expectedPromise.then).toBeDefined();
    });

    it('should return resolve with files object', function (done) {
      spyOn(commit, 'getCommit').and.returnValue($q.when(commitsMock[3]));

      commit.getFiles()
        .then(function (files) {
          expect(files).toEqual(jasmine.any(Array));
          expect(files[0].lines).toBeDefined();
          expect(files[0].name).toBeDefined();
          done();
        });

      $rootScope.$apply();
    });


  });

  describe('.approve', function () {
    var commit;
    beforeEach(function () {
      commit = new Commit({user: 'TestUser', repo: 'testRepo', sha: 'testSha'});
    });

    it('should call comments.addCommitComment', function () {
      spyOn(ghComments, 'addCommitComment').and.returnValue($q.when());
      commit.approve({login: 'me'});
      expect(ghComments.addCommitComment).toHaveBeenCalled();
    });

    it('should call comments.addCommitComment with correct arguments', function () {
      spyOn(ghComments, 'addCommitComment').and.returnValue($q.when());
      commit.approve({login: 'me'});
      var callArgs = ghComments.addCommitComment.calls.argsFor(0);
      expect(callArgs[0]).toBe('testSha');
      expect(callArgs[1]).toBe('TestUser');
      expect(callArgs[2]).toBe('testRepo');
      expect(callArgs[3]).toMatch(new RegExp('approved with \\[gh-review\\]\\(http://gh-review.herokuapp.com/\\)', 'gm'));
      expect(callArgs[3]).toMatch(new RegExp('"approver": "me"', 'gm'));
    });

    it('should return promise', function () {
      spyOn(ghComments, 'addCommitComment').and.returnValue($q.when());
      var expectedPromise = commit.approve({login: 'me'});
      expect(expectedPromise.then).toBeDefined();
    });

  });

  describe('.unapprove', function () {
    var commit;
    beforeEach(function () {
      spyOn(github.repos, 'deleteCommitComment');
      spyOn(ghComments, 'getForCommit').and.returnValue($q.when(commentsMock[0]));
      commit = new Commit({user: 'TestUser', repo: 'testRepo', sha: 'testSha'});
      commit.getComments();
      $rootScope.$apply();
    });

    it('should return a promise', function () {
      var expectedPromise = commit.unapprove({login: 'JayGray'});
      expect(expectedPromise.then).toBeDefined();
    });

    it('should call Comment#remove', function () {
      var comment = commit.comments.commitComments[0];
      spyOn(comment, 'remove');
      commit.unapprove({login: 'JayGray'});
      expect(comment.remove).toHaveBeenCalled();
    });
  });

  describe('.getComments', function () {
    var commit;
    beforeEach(function () {
      commit = new Commit({user: 'TestUser', repo: 'testRepo', sha: 'testSha'});
    });

    it('should return promise', function () {
      spyOn(ghComments, 'getForCommit').and.returnValue($q.when(commentsMock[0]));
      var expectedPromise = commit.getComments();
      expect(expectedPromise.then).toBeDefined();
    });

    it('should resolve with splitted line and commit comments', function (done) {
      spyOn(ghComments, 'getForCommit').and.returnValue($q.when(commentsMock[0]));
      commit.getComments()
        .then(function (comments) {
          expect(comments.lineComments).toBeDefined();
          expect(comments.commitComments).toBeDefined();

          expect(comments.lineComments.length).toBe(2);
          expect(comments.commitComments.length).toBe(1);
          done();
        });
      $rootScope.$apply();
    });

    it('should add comments as property to Commit', function (done) {
      spyOn(ghComments, 'getForCommit').and.returnValue($q.when(commentsMock[0]));
      commit.getComments()
        .then(function () {
          expect(commit.comments.lineComments).toBeDefined();
          expect(commit.comments.commitComments).toBeDefined();

          expect(commit.comments.lineComments.length).toBe(2);
          expect(commit.comments.commitComments.length).toBe(1);
          done();
        });
      $rootScope.$apply();
    });
  });

  describe('.getApprover', function(){
    var commit;
    beforeEach(function () {
      spyOn(github.repos, 'deleteCommitComment');
      spyOn(ghComments, 'getForCommit').and.returnValue($q.when(commentsMock[0]));
      commit = new Commit({user: 'TestUser', repo: 'testRepo', sha: 'testSha'});
      commit.getComments();
      $rootScope.$apply();
    });

    it('should return a list of approver if Commit.comments not undefined', function(){
      var approvers = commit.getApprover();
      expect(approvers).toEqual(jasmine.any(Array));
      expect(approvers.length).toBe(1);
      expect(approvers[0]).toBe('JayGray');
    });

    it('should return empty list if Commit.comments undefined', function(){
      delete commit.comments;
      var approvers = commit.getApprover();
      expect(approvers).toEqual(jasmine.any(Array));
      expect(approvers.length).toBe(0);
    });
  });

  describe('.isApprover', function(){
    var commit;
    beforeEach(function () {
      spyOn(github.repos, 'deleteCommitComment');
      spyOn(ghComments, 'getForCommit').and.returnValue($q.when(commentsMock[0]));
      commit = new Commit({user: 'TestUser', repo: 'testRepo', sha: 'testSha'});
      commit.getComments();
      $rootScope.$apply();
    });

    it('should return true if given user.login match approve comment', function(){
      expect(commit.isApprovedByUser({login: 'JayGray'})).toBe(true);
    });

    it('should return false if given user.login does not match approve comment', function(){
      expect(commit.isApprovedByUser({login: 'NoMatch'})).toBe(false);
    });

    it('should return false no argument is given', function(){
      expect(commit.isApprovedByUser()).toBe(false);
    });
  });

});