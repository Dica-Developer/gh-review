describe('Service: contributorCollector', function () {
  'use strict';

  var contributorCollector, github, $rootScope, $interval;

  beforeEach(angular.mock.module('GHReview'));

  beforeEach(inject(function ($injector) {
    contributorCollector = $injector.get('contributorCollector');
    github = $injector.get('github');
    $rootScope = $injector.get('$rootScope');
    $interval = $injector.get('$interval');
  }));

  it('Should be defined', function () {
    expect(contributorCollector).toBeDefined();
  });

  it('Should call github.repos.getContributors with correct arguments if ".get" is called', function () {
    spyOn(github.repos, 'getContributors');

    contributorCollector.get('TestUser', 'TestRepo');
    contributorCollector.get.cache = {};

    expect(github.repos.getContributors).toHaveBeenCalled();
    expect(github.repos.getContributors).toHaveBeenCalledWith({ user: 'TestUser', repo: 'TestRepo', 'per_page': 100 }, jasmine.any(Function));
  });

  it('Should be rejected if github throws error', function (done) {
    spyOn(github.repos, 'getContributors');

    contributorCollector.get('TestUser', 'TestRepo')
      .then(null, function () {
        contributorCollector.get.cache = {};
        done();
      });

    var callback = github.repos.getContributors.calls.argsFor(0)[1];
    callback({});
    $rootScope.$apply();
  });

  it('Should be resolved with result', function (done) {
    spyOn(github.repos, 'getContributors');

    contributorCollector.get('TestUser', 'TestRepo')
      .then(function (result) {
        expect(result.length).toBeGreaterThan(0);
        contributorCollector.get.cache = {};
        done();
      });

    var callback = github.repos.getContributors.calls.argsFor(0)[1];
    var result = [1, 2, 3];
    result.meta = {};
    callback(null, result);
    $rootScope.$apply();
  });

  it('Should call github.hasNextPage to check if pagination is needed', function (done) {
    var result = [1, 2, 3];
    result.meta = {};

    spyOn(github.repos, 'getContributors');
    spyOn(github, 'hasNextPage').and.returnValue(false);
    contributorCollector.get('TestUser', 'TestRepo')
      .then(function () {
        expect(github.hasNextPage).toHaveBeenCalledWith(result);
        contributorCollector.get.cache = {};
        done();
      });
    var callback = github.repos.getContributors.calls.argsFor(0)[1];
    callback(null, result);
    $rootScope.$apply();
  });

  it('Should call github.getNextPage if github result is paginated and return concatenated result', function (done) {
    var githubResult = [1, 2, 3];
    githubResult.meta = {};

    spyOn(github.repos, 'getContributors');
    spyOn(github, 'hasNextPage').and.returnValue(true);
    spyOn(github, 'getNextPage');
    contributorCollector.get('TestUser', 'TestRepo')
      .then(function (result) {
        expect(github.getNextPage).toHaveBeenCalledWith(githubResult, jasmine.any(Function));
        expect(result.length).toBe(6);
        expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        contributorCollector.get.cache = {};
        done();
      });


    var callback = github.repos.getContributors.calls.argsFor(0)[1];
    callback(null, githubResult);

    github.hasNextPage.and.returnValue(false);

    var getNextPageCallback = github.getNextPage.calls.argsFor(0)[1];
    var result1 =  [4, 5, 6];
    result1.meta = {};
    getNextPageCallback(null, result1);
    $rootScope.$apply();
  });

  it('Should reject if github.getNextPage throws error', function (done) {
    spyOn(github.repos, 'getContributors');
    spyOn(github, 'hasNextPage').and.returnValue(true);
    spyOn(github, 'getNextPage');
    contributorCollector.get('TestUser', 'TestRepo')
      .then(null, function () {
        contributorCollector.get.cache = {};
        done();
      });


    var callback = github.repos.getContributors.calls.argsFor(0)[1];
    var result = [1, 2, 3];
    result.meta = {};
    callback(null, result);

    github.hasNextPage.and.returnValue(false);

    var getNextPageCallback = github.getNextPage.calls.argsFor(0)[1];
    getNextPageCallback({});
    $rootScope.$apply();
  });

  it('Should add a well named cache object', function () {
    spyOn(github.repos, 'getContributors');
    contributorCollector.get('TestUser', 'TestRepo');
    expect(contributorCollector.get.cache).toBeDefined();
    expect(contributorCollector.get.cache['TestUser-TestRepo']).toBeDefined();
  });

  it('Should invalidate cache after a given time', function () {
    spyOn(github.repos, 'getContributors');
    contributorCollector.get('TestUser', 'TestRepo');
    expect(contributorCollector.get.cache).toBeDefined();
    expect(contributorCollector.get.cache['TestUser-TestRepo']).toBeDefined();
    var cacheExpireTime = 2 * 60 * 60 * 1000; //2h
    $interval.flush(cacheExpireTime);
    expect(contributorCollector.get.cache['TestUser-TestRepo']).not.toBeDefined();
  });
});