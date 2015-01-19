/*global inject*/
describe('Service: commitCollector', function () {
  'use strict';

  var commitCollector, github, $rootScope, $interval;

  beforeEach(angular.mock.module('GHReview'));

  beforeEach(inject(function ($injector) {
    commitCollector = $injector.get('commitCollector');
    github = $injector.get('github');
    $rootScope = $injector.get('$rootScope');
    $interval = $injector.get('$interval');
  }));

  it('Should be defined', function () {
    expect(commitCollector).toBeDefined();
  });

  it('Should call github.repos.getCommits with correct arguments if ".get" is called', function () {
    spyOn(github.repos, 'getCommits');

    commitCollector.get({
      user: 'TestUser',
      repo: 'TestRepo',
      sha: 'master',
      author: 'TestAuthor'
    });
    commitCollector.get.cache = {};

    expect(github.repos.getCommits).toHaveBeenCalled();
    expect(github.repos.getCommits).toHaveBeenCalledWith({ user: 'TestUser', repo: 'TestRepo', sha: 'master', author: 'TestAuthor', 'per_page': 100 }, jasmine.any(Function));
  });

  it('Should be rejected if github throws error', function (done) {
    spyOn(github.repos, 'getCommits');

    commitCollector.get({
      user: 'TestUser',
      repo: 'TestRepo',
      sha: 'master',
      author: 'TestAuthor'
    })
      .then(null, function () {
        commitCollector.get.cache = {};
        done();
      });

    var callback = github.repos.getCommits.calls.argsFor(0)[1];
    callback({});
    $rootScope.$apply();
  });

  it('Should be resolved with result', function (done) {
    spyOn(github.repos, 'getCommits');

    commitCollector.get({
      user: 'TestUser',
      repo: 'TestRepo',
      sha: 'master',
      author: 'TestAuthor'
    })
      .then(function (result) {
        expect(result.length).toBeGreaterThan(0);
        commitCollector.get.cache = {};
        done();
      });

    var callback = github.repos.getCommits.calls.argsFor(0)[1];
    var result = [1, 2, 3];
    result.meta = {};
    callback(null, result);
    $rootScope.$apply();
  });

  it('Should call github.hasNextPage to check if pagination is needed', function (done) {
    var result = [1, 2, 3];
    result.meta = {};

    spyOn(github.repos, 'getCommits');
    spyOn(github, 'hasNextPage').and.returnValue(false);
    commitCollector.get({
      user: 'TestUser',
      repo: 'TestRepo',
      sha: 'master',
      author: 'TestAuthor'
    })
      .then(function () {
        expect(github.hasNextPage).toHaveBeenCalledWith(result);
        commitCollector.get.cache = {};
        done();
      });
    var callback = github.repos.getCommits.calls.argsFor(0)[1];
    callback(null, result);
    $rootScope.$apply();
  });

  it('Should call github.getNextPage if github result is paginated and return concatenated result', function (done) {
    var githubResult = [1, 2, 3];
    githubResult.meta = {};

    spyOn(github.repos, 'getCommits');
    spyOn(github, 'hasNextPage').and.returnValue(true);
    spyOn(github, 'getNextPage');
    commitCollector.get({
      user: 'TestUser',
      repo: 'TestRepo',
      sha: 'master',
      author: 'TestAuthor'
    })
      .then(function (result) {
        expect(github.getNextPage).toHaveBeenCalledWith(githubResult, jasmine.any(Function));
        expect(result.length).toBe(6);
        expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        commitCollector.get.cache = {};
        done();
      });


    var callback = github.repos.getCommits.calls.argsFor(0)[1];
    callback(null, githubResult);

    github.hasNextPage.and.returnValue(false);

    var getNextPageCallback = github.getNextPage.calls.argsFor(0)[1];
    var result1 =  [4, 5, 6];
    result1.meta = {};
    getNextPageCallback(null, result1);
    $rootScope.$apply();
  });

  it('Should reject if github.getNextPage throws error', function (done) {
    spyOn(github.repos, 'getCommits');
    spyOn(github, 'hasNextPage').and.returnValue(true);
    spyOn(github, 'getNextPage');
    commitCollector.get({
      user: 'TestUser',
      repo: 'TestRepo',
      sha: 'master',
      author: 'TestAuthor'
    })
      .then(null, function () {
        commitCollector.get.cache = {};
        done();
      });


    var callback = github.repos.getCommits.calls.argsFor(0)[1];
    var result = [1, 2, 3];
    result.meta = {};
    callback(null, result);

    github.hasNextPage.and.returnValue(false);

    var getNextPageCallback = github.getNextPage.calls.argsFor(0)[1];
    getNextPageCallback({});
    $rootScope.$apply();
  });

  it('Should add a well named cache object', function () {
    spyOn(github.repos, 'getCommits');
    commitCollector.get({
      user: 'TestUser',
      repo: 'TestRepo',
      sha: 'master',
      author: 'TestAuthor'
    });
    expect(commitCollector.get.cache).toBeDefined();
    expect(commitCollector.get.cache['TestUser-TestRepo-master-TestAuthor']).toBeDefined();
  });

  it('Should invalidate cache after a given time', function () {
    spyOn(github.repos, 'getCommits');
    commitCollector.get({
      user: 'TestUser',
      repo: 'TestRepo',
      sha: 'master',
      author: 'TestAuthor'
    });
    expect(commitCollector.get.cache).toBeDefined();
    expect(commitCollector.get.cache['TestUser-TestRepo-master-TestAuthor']).toBeDefined();
    var cacheExpireTime = 10 * 60 * 1000; //10min
    $interval.flush(cacheExpireTime);
    expect(commitCollector.get.cache['TestUser-TestRepo-master-TestAuthor']).not.toBeDefined();
  });
});