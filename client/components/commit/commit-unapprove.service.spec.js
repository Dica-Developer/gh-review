describe('Service: unapproveCommit', function () {
  'use strict';

  beforeEach(angular.mock.module('GHReview'));

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