describe('Service: github-commit', function () {
  'use strict';

  beforeEach(module('GHReview'));

  var github, $rootScope, ghCommits;

  beforeEach(inject(function ($injector) {
    github = $injector.get('github');
    $rootScope = $injector.get('$rootScope');
    ghCommits = $injector.get('ghCommits');
  }));

  describe('.bySha', function(){

    it('should call github.repos.getCommit', function () {
      spyOn(github.repos, 'getCommit');
      ghCommits.bySha({});
      expect(github.repos.getCommit).toHaveBeenCalled();
    });

    it('should return promise and resolve if data exist', function (done) {
      spyOn(github.repos, 'getCommit');
      ghCommits.bySha({})
        .then(function (data) {
          expect(data).toBeDefined();
          expect(data.result).toBe('testResult');
          done();
        });
      var callback = github.repos.getCommit.calls.argsFor(0)[1];
      callback(null, { result: 'testResult' });
      expect(github.repos.getCommit).toHaveBeenCalled();
      $rootScope.$apply();
    });

    it('should remove meta property from response', function (done) {
      spyOn(github.repos, 'getCommit');
      ghCommits.bySha({})
        .then(function (data) {
          expect(data).toBeDefined();
          expect(data.meta).not.toBeDefined();
          done();
        });
      var callback = github.repos.getCommit.calls.argsFor(0)[1];
      callback(null, { result: 'testResult', meta: true });
      expect(github.repos.getCommit).toHaveBeenCalled();
      $rootScope.$apply();
    });

    it('should return promise and reject if error exist', function (done) {
      spyOn(github.repos, 'getCommit');
      ghCommits.bySha({})
        .then(null, function (error) {
          expect(error).toBeDefined();
          expect(error.name).toBe('Error');
          done();
        });
      var callback = github.repos.getCommit.calls.argsFor(0)[1];
      callback({ name: 'Error' }, null);
      expect(github.repos.getCommit).toHaveBeenCalled();
      $rootScope.$apply();
    });

  });

});