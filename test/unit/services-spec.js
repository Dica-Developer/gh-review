describe('#Services', function () {
  'use strict';

  beforeEach(angular.mock.module('GHReview'));

  describe('.commits', function () {

    describe('.bySha', function () {
      var commits, github, $rootScope,
        githubParams = {
          user: 'testUser',
          repo: 'testRepo',
          sha: 'master'
        };

      beforeEach(inject(function ($injector) {
        commits = $injector.get('commits');
        github = $injector.get('github');
        $rootScope = $injector.get('$rootScope');
      }));

      it('Should be defined', function () {
        expect(commits.bySha).toBeDefined();
      });

      it('Should call "github.repos.getCommit"', function () {
        spyOn(github.repos, 'getCommit');
        commits.bySha(githubParams);
        expect(github.repos.getCommit.calls.argsFor(0)[0]).toEqual(githubParams);
      });

      it('Should return promise and resolve if response has no errors', function (done) {
        spyOn(github.repos, 'getCommit');

        commits.bySha(githubParams)
          .then(function (data) {
            expect(data).toBeDefined();
            done();
          });

        var getCallback = github.repos.getCommit.calls.argsFor(0)[1];
        getCallback(null, {});

        $rootScope.$apply();
      });

      it('Should return promise and reject if response has errors', function (done) {
        spyOn(github.repos, 'getCommit');

        commits.bySha(githubParams)
          .then(null, function (error) {
            expect(error.name).toBe('TestError');
            done();
          });

        var getCallback = github.repos.getCommit.calls.argsFor(0)[1];
        getCallback({
          name: 'TestError'
        }, null);

        $rootScope.$apply();
      });
    });

    describe('.byPath', function () {
      var commits, $rootScope,
        githubParams = {
          user: 'testUser',
          repo: 'testRepo',
          path: '/',
          sha: 'master'
        };

      beforeEach(inject(function ($injector) {
        commits = $injector.get('commits');
        $rootScope = $injector.get('$rootScope');
      }));

      it('Should be defined', function () {
        expect(commits.byPath).toBeDefined();
      });

      xit('Should return promise and resolve if response has no errors', function (done) {
        commits.byPath(githubParams)
          .then(function (data) {
            expect(data).toBeDefined();
            done();
          });

        $rootScope.$apply();
      });

      xit('Should return promise and reject if response has errors', function (done) {
        commits.byPath(githubParams)
          .then(null, function (error) {
            expect(error.name).toBe('TestError');
            done();
          });

        $rootScope.$apply();
      });
    });
  });

  describe('.getCommitApproved', function () {
    var getCommitApproved, commentCollector;

    beforeEach(inject(function ($injector) {
      getCommitApproved = $injector.get('getCommitApproved');
      commentCollector = $injector.get('commentCollector');
    }));

    it('Should be a promise', function () {
      expect(getCommitApproved.then).toBeDefined();
    });
  });

  describe('.commitProviderService', function () {
    var commitProviderService, commitProvider;

    beforeEach(inject(function ($injector) {
      commitProviderService = $injector.get('commitProviderService');
      commitProvider = $injector.get('commitProvider');
    }));

    it('Should return commitProvider', function () {
      expect(commitProviderService).toEqual(commitProvider);
    });
  });

  describe('.isCommentNotApprovalComment', function () {

    var commentCollector, isCommentNotApprovalComment;

    beforeEach(inject(function ($injector) {
      commentCollector = $injector.get('commentCollector');
      isCommentNotApprovalComment = $injector.get('isCommentNotApprovalComment');
    }));

    it('Should return false', function () {
      spyOn(commentCollector, 'getApproveComments').and.returnValue({
        commentIsApprovalComment: true
      });
      expect(isCommentNotApprovalComment('commentIsApprovalComment')).toBe(false);
    });

    it('Should return true', function () {
      spyOn(commentCollector, 'getApproveComments').and.returnValue({
        commentIsNotApprovalComment: false
      });
      expect(isCommentNotApprovalComment('commentIsNotApprovalComment')).toBe(true);
    });

    it('Should return true', function () {
      spyOn(commentCollector, 'getApproveComments').and.returnValue({
        commentIsApprovalComment: true
      });
      expect(isCommentNotApprovalComment('commentIsNotApprovalComment')).toBe(true);
    });
  });

  describe('.isCommentApprovalCommentFromUser', function () {

    var commentCollector, isCommentApprovalCommentFromUser;

    beforeEach(inject(function ($injector) {
      commentCollector = $injector.get('commentCollector');
      isCommentApprovalCommentFromUser = $injector.get('isCommentApprovalCommentFromUser');
    }));

    it('Should return false comment is approval comment but user is not approver', function () {
      spyOn(commentCollector, 'getApproveComments').and.returnValue({
        commentIsApprovalComment: true
      });
      expect(isCommentApprovalCommentFromUser({
        id: 'isCommentApprovalCommentFromUser',
        user: {
          login: 'ms'
        }
      }, {
        login: 'karl'
      })).toBe(false);
    });

    it('Should return false comment is not approval comment and user is not approver', function () {
      spyOn(commentCollector, 'getApproveComments').and.returnValue({
        commentIsNotApprovalComment: false
      });
      expect(isCommentApprovalCommentFromUser({
        id: 'notApprovalComment',
        user: {
          login: 'ms'
        }
      }, {
        login: 'karl'
      })).toBe(false);
    });

    it('Should return false comment is not approval comment but user is approver', function () {
      spyOn(commentCollector, 'getApproveComments').and.returnValue({
        commentIsApprovalComment: true
      });
      expect(isCommentApprovalCommentFromUser({
        id: 'commentIsNotApprovalComment',
        user: {
          login: 'ms'
        }
      }, {
        login: 'ms'
      })).toBe(false);
    });

    it('Should return true comment is approval comment and user is approver', function () {
      spyOn(commentCollector, 'getApproveComments').and.returnValue({
        commentIsApprovalComment: true
      });
      expect(isCommentApprovalCommentFromUser({
        id: 'commentIsApprovalComment',
        user: {
          login: 'ms'
        }
      }, {
        login: 'ms'
      })).toBe(true);
    });
  });

  describe('.approveCommit', function () {
    var $q, $rootScope, approveCommit, commentCollector, githubUserData, github;

    beforeEach(inject(function ($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      approveCommit = $injector.get('approveCommit');
      commentCollector = $injector.get('commentCollector');
      githubUserData = $injector.get('githubUserData');
      github = $injector.get('github');
    }));

    it('Should resolve', function (done) {

      spyOn(githubUserData, 'get').and.returnValue($q.when({login: 'TestAuthor'}));
      spyOn(commentCollector, 'addApprovalComment');
      spyOn(github.repos, 'createCommitComment');

      approveCommit('sha', 'user', 'repo')
        .then(function () {
          expect(githubUserData.get).toHaveBeenCalled();
          expect(commentCollector.addApprovalComment).toHaveBeenCalledWith('sha', 'commentId');
          done();
        });


      $rootScope.$apply();

      var callback = github.repos.createCommitComment.calls.argsFor(0)[1];
      callback(null, {id: 'commentId'});

      $rootScope.$apply();
    });

    it('Should reject if github throws error', function (done) {

      spyOn(githubUserData, 'get').and.returnValue($q.when({login: 'TestAuthor'}));
      spyOn(commentCollector, 'addApprovalComment');
      spyOn(github.repos, 'createCommitComment');

      approveCommit('sha', 'user', 'repo')
        .then(null, function () {
          expect(githubUserData.get).toHaveBeenCalled();
          expect(commentCollector.addApprovalComment).not.toHaveBeenCalled();
          done();
        });


      $rootScope.$apply();

      var callback = github.repos.createCommitComment.calls.argsFor(0)[1];
      callback({});

      $rootScope.$apply();
    });

  });

  describe('.unapproveCommit', function () {
    var $q, $rootScope, unapproveCommit, commentCollector, github;

    beforeEach(inject(function ($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      unapproveCommit = $injector.get('unapproveCommit');
      commentCollector = $injector.get('commentCollector');
      github = $injector.get('github');
    }));

    it('Should resolve', function (done) {

      spyOn(commentCollector, 'removeApprovalComment');
      spyOn(github.repos, 'deleteCommitComment');

      unapproveCommit('commentId', 'sha', 'user', 'repo')
        .then(function () {
          expect(commentCollector.removeApprovalComment).toHaveBeenCalledWith('sha');
          done();
        });


      $rootScope.$apply();

      var callback = github.repos.deleteCommitComment.calls.argsFor(0)[1];
      callback(null, {});

      $rootScope.$apply();
    });

    it('Should reject if github throws error', function (done) {

      spyOn(commentCollector, 'removeApprovalComment');
      spyOn(github.repos, 'deleteCommitComment');

      unapproveCommit('commitId', 'sha', 'user', 'repo')
        .then(null, function () {
          expect(commentCollector.removeApprovalComment).not.toHaveBeenCalled();
          done();
        });


      $rootScope.$apply();

      var callback = github.repos.deleteCommitComment.calls.argsFor(0)[1];
      callback({});

      $rootScope.$apply();
    });

  });


});
