describe('#Services', function () {
  'use strict';

  beforeEach(angular.mock.module('GHReview'));

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

});
