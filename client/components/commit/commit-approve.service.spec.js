describe('Service: approveCommit', function () {
  'use strict';

  beforeEach(angular.mock.module('GHReview'));

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