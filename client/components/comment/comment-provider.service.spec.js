describe('Service: CommentProvider', function () {
  'use strict';

  beforeEach(module('GHReview'));


  var commentProvider, ghComments,
    githubOptions = {
      user: 'testUser',
      repo: 'testRepo',
      sha: 'testSha'
    },
    commentMock = {
      'commit_id': '123',
      'id': '456',
      'user': {
        'login': 'testUser'
      },
      'line': null,
      'position': null
    },
    _;


  beforeEach(inject(function ($injector) {
    commentProvider = $injector.get('commentProvider');
    ghComments = $injector.get('ghComments');
    _ = $injector.get('_');
  }));

  it('Should be defined', function () {
    expect(commentProvider).toBeDefined();
  });

  it('Should have correct API', function () {
    expect(commentProvider.getCommentsForCommit).toBeDefined();
  });

  describe('.getCommentsForCommit', function () {
    var $rootScope, commentCollector, Comment, $q;

    beforeEach(inject(function ($injector) {
      $rootScope = $injector.get('$rootScope');
      commentCollector = $injector.get('commentCollector');
      Comment = $injector.get('Comment');
      $q = $injector.get('$q');
    }));

    it('Should reject if github.repos.getCommitComments returns error', function (done) {
      spyOn(ghComments, 'getForCommit').and.returnValue($q.reject({Error: 'Error'}));
      commentProvider.getCommentsForCommit(githubOptions)
        .then(null, function (reason) {
          expect(reason).toEqual({Error: 'Error'});
          done();
        });
      $rootScope.$apply();
    });

    it('Should return one approver', function (done) {
      spyOn(ghComments, 'getForCommit').and.returnValue($q.when([commentMock]));
      spyOn(commentCollector, 'getCommitApproved').and.returnValue($q.when({'123': true}));
      spyOn(commentCollector, 'getApproveComments').and.returnValue({'456': true});
      commentProvider.getCommentsForCommit(githubOptions)
        .then(function (result) {
          expect(result.approvers.length).toBe(1);
          expect(result.approvers[0]).toBe('testUser');
          done();
        });
      $rootScope.$apply();
    });

    it('Should return no approver', function (done) {
      spyOn(ghComments, 'getForCommit').and.returnValue($q.when([commentMock]));
      spyOn(commentCollector, 'getCommitApproved').and.returnValue($q.when({'123': false}));
      spyOn(commentCollector, 'getApproveComments').and.returnValue({'456': true});
      commentProvider.getCommentsForCommit(githubOptions)
        .then(function (result) {
          expect(result.approvers.length).toBe(0);
          done();
        });
      $rootScope.$apply();
    });

    it('Should return one line comment if comment.line not null', function (done) {
      var commentClone = _.clone(commentMock);
      commentClone.line = 23;
      spyOn(ghComments, 'getForCommit').and.returnValue($q.when([commentClone]));
      spyOn(commentCollector, 'getCommitApproved').and.returnValue($q.when({'123': true}));
      spyOn(commentCollector, 'getApproveComments').and.returnValue({'456': true});
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
      $rootScope.$apply();
    });

    it('Should return one line comment if comment.position not null', function (done) {
      var commentClone = _.clone(commentMock);
      commentClone.position = 23;
      spyOn(ghComments, 'getForCommit').and.returnValue($q.when([commentClone]));
      spyOn(commentCollector, 'getCommitApproved').and.returnValue($q.when({'123': true}));
      spyOn(commentCollector, 'getApproveComments').and.returnValue({'456': true});
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
      $rootScope.$apply();
    });

    it('Should return commit comment if comment.line and comment.position is null', function (done) {
      spyOn(ghComments, 'getForCommit').and.returnValue($q.when([commentMock]));
      spyOn(commentCollector, 'getCommitApproved').and.returnValue($q.when({'123': true}));
      spyOn(commentCollector, 'getApproveComments').and.returnValue({'456': true});
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
      $rootScope.$apply();
    });
  });

});