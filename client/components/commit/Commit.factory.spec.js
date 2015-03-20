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

  describe('.returnSelf', function () {
    var commit;
    beforeEach(function () {
      commit = new Commit({
        user: 'test-user',
        repo: 'test-repo',
        sha: 'test-sha'
      });
      spyOn(ghCommits, 'bySha').and.returnValue($q.when(commitsMock[0]));
      spyOn(ghComments, 'getForCommit').and.returnValue($q.when(commentsMock[0]));
    });

    it('Should call ghCommits.bySha with correct arguments', function (done) {
      commit.prepareForView()
        .then(function () {
          expect(ghCommits.bySha).toHaveBeenCalledWith({
            user: 'test-user',
            repo: 'test-repo',
            sha: 'test-sha'
          });
          done();
        });
      $rootScope.$apply();
    });
  });

  describe('.returnSelf', function () {
    it('Should resolve with instance of Commit', function (done) {
      var commit = new Commit();

      commit.returnSelf()
        .then(function (commitInstance) {
          expect(commitInstance instanceof Commit).toBe(true);
          expect(commitInstance).toBe(commit);
          done();
        });
      $rootScope.$apply();
    });
  });

  describe('.processCommit', function () {
    it('Should set Commit.commitData', function () {
      var commit = new Commit();

      commit.processCommit(commitsMock[3]);
      expect(commit.commitData).toBe(commitsMock[3]);
    });

    it('Should set Commit.files', function () {
      var commit = new Commit();

      expect(commit.files).not.toBeDefined();
      commit.processCommit(commitsMock[3]);
      expect(commit.files).toBeDefined();
    });

    it('Should return a promise', function () {
      var commit = new Commit(),
        promise = commit.processCommit(commitsMock[3]);
      expect(promise).toBeDefined();
      expect(promise.then).toBeDefined();
    });
  });

  describe('.getComments', function () {

    it('Should call ghComments.getForCommit with correct parameters', function () {
      var commit = new Commit({
        user: 'test-user',
        repo: 'test-repo',
        sha: 'test-sha'
      });
      spyOn(ghComments, 'getForCommit').and.returnValue($q.when(commentsMock[0]));
      commit.getComments();
      expect(ghComments.getForCommit).toHaveBeenCalledWith({
        user: 'test-user',
        repo: 'test-repo',
        sha: 'test-sha'
      });
    });

    it('Should return promise', function () {
      var commit = new Commit();
      spyOn(ghComments, 'getForCommit').and.returnValue($q.when(commentsMock[0]));
      var expectedPromise = commit.getComments();
      expect(expectedPromise.then).toBeDefined();
    });
  });

  describe('.processComments', function () {
    var commit;
    beforeEach(function () {
      commit = new Commit({
        user: 'test-user',
        repo: 'test-repo',
        sha: 'test-sha'
      });
    });

    it('Should set commit.comments', function () {
      expect(commit.comments).not.toBeDefined();
      commit.processComments(commentsMock[0]);
      expect(commit.comments).toBeDefined();
    });

    it('Should set commit.comments splitted in line and commit comments', function () {
      expect(commit.comments).not.toBeDefined();
      commit.processComments(commentsMock[0]);
      expect(commit.comments.lineComments).toBeDefined();
      expect(commit.comments.commitComments).toBeDefined();
    });

    it('Should return promise', function () {
      var expectedPromise = commit.processComments(commentsMock[0]);
      expect(expectedPromise.then).toBeDefined();
    });
  });

  describe('.updateComments', function () {
    var commit;
    beforeEach(function () {
      commit = new Commit({
        user: 'test-user',
        repo: 'test-repo',
        sha: 'test-sha'
      });
    });

    it('Should call commit.getComments', function () {
      spyOn(commit, 'getComments').and.returnValue($q.when(commentsMock[0]));
      commit.updateComments();
      expect(commit.getComments).toHaveBeenCalled();
    });

    it('Should call commit.processComments', function () {
      spyOn(commit, 'getComments').and.returnValue($q.when(commentsMock[0]));
      spyOn(commit, 'processComments').and.returnValue($q.when());
      commit.updateComments();
      $rootScope.$apply();
      expect(commit.processComments).toHaveBeenCalled();
    });

    it('Should return promise', function () {
      spyOn(commit, 'getComments').and.returnValue($q.when(commentsMock[0]));
      var expectedPromise = commit.updateComments();
      expect(expectedPromise.then).toBeDefined();
    });
  });

  describe('.approve', function () {
    var commit;
    beforeEach(function () {
      commit = new Commit({
        user: 'test-user',
        repo: 'test-repo',
        sha: 'test-sha'
      });
    });

    it('Should call ghComments.addCommitComment', function () {
      spyOn(ghComments, 'addCommitComment').and.returnValue($q.when());
      commit.approve({login: 'me'});
      expect(ghComments.addCommitComment).toHaveBeenCalled();
    });

    it('Should call ghComments.addCommitComment with correct arguments', function () {
      spyOn(ghComments, 'addCommitComment').and.returnValue($q.when());
      commit.approve({login: 'me'});
      var callArgs = ghComments.addCommitComment.calls.argsFor(0);
      expect(callArgs[0]).toBe('test-sha');
      expect(callArgs[1]).toBe('test-user');
      expect(callArgs[2]).toBe('test-repo');
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
      commit = new Commit({
        user: 'test-user',
        repo: 'test-repo',
        sha: 'test-sha'
      });
    });

    it('Should return a promise', function () {
      commit.processComments(commentsMock[0]);
      var comment = commit.comments.commitComments[0];
      spyOn(comment, 'remove').and.returnValue($q.when());
      var expectedPromise = commit.unapprove({login: 'JayGray'});
      expect(expectedPromise.then).toBeDefined();
    });

    it('Should call Comment#remove', function () {
      commit.processComments(commentsMock[0]);
      var comment = commit.comments.commitComments[0];
      spyOn(comment, 'remove');
      commit.unapprove({login: 'JayGray'});
      expect(comment.remove).toHaveBeenCalled();
    });
  });

  describe('.getApprover', function () {
    var commit;
    beforeEach(function () {
      commit = new Commit({
        user: 'test-user',
        repo: 'test-repo',
        sha: 'test-sha'
      });
    });

    it('should return a list of approver if Commit.comments not undefined', function () {
      commit.processComments(commentsMock[0]);
      var approvers = commit.getApprover();
      expect(approvers).toEqual(jasmine.any(Array));
      expect(approvers.length).toBe(1);
      expect(approvers[0]).toBe('JayGray');
    });

    it('should return empty list if Commit.comments undefined', function () {
      var approvers = commit.getApprover();
      expect(approvers).toEqual(jasmine.any(Array));
      expect(approvers.length).toBe(0);
    });

  });

  describe('.isApprover', function () {
    var commit;
    beforeEach(function () {
      commit = new Commit({
        user: 'test-user',
        repo: 'test-repo',
        sha: 'test-sha'
      });
      commit.processComments(commentsMock[0]);
    });

    it('should return true if given user.login match approve comment', function () {
      expect(commit.isApprovedByUser({login: 'JayGray'})).toBe(true);
    });

    it('should return false if given user.login does not match approve comment', function () {
      expect(commit.isApprovedByUser({login: 'NoMatch'})).toBe(false);
    });

    it('should return false no argument is given', function () {
      expect(commit.isApprovedByUser()).toBe(false);
    });
  });

});