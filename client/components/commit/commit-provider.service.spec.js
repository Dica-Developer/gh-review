describe('Service: commitProvider', function () {
  'use strict';

  beforeEach(angular.mock.module('GHReview'));


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