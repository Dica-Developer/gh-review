/*global inject*/
describe('Service: branchCollector', function () {
  'use strict';

  var branchCollector, github, $rootScope, $timeout;

  beforeEach(module('GHReview'));

  beforeEach(inject(function ($injector) {
    branchCollector = $injector.get('branchCollector');
    github = $injector.get('github');
    $rootScope = $injector.get('$rootScope');
    $timeout = $injector.get('$timeout');
  }));

  it('Should be defined', function () {
    expect(branchCollector).toBeDefined();
  });

  it('Should call github.repos.getBranches with correct arguments if ".get" is called', function () {
    spyOn(github.repos, 'getBranches');

    branchCollector.get('TestUser', 'TestRepo');
    branchCollector.get.cache = {};

    expect(github.repos.getBranches).toHaveBeenCalled();
    /*jshint camelcase:false*/
    expect(github.repos.getBranches).toHaveBeenCalledWith({
      repo: 'TestRepo',
      user: 'TestUser',
      per_page: 100
    }, jasmine.any(Function));
    /*jshint camelcase:true*/
  });

  it('Should be rejected if github throws error', function (done) {
    spyOn(github.repos, 'getBranches');

    branchCollector.get('TestUser', 'TestRepo')
      .then(null, function () {
        branchCollector.get.cache = {};
        done();
      });

    var callback = github.repos.getBranches.calls.argsFor(0)[1];
    callback({});
    $rootScope.$apply();
  });

  it('Should be resolved with result', function (done) {
    spyOn(github.repos, 'getBranches');

    branchCollector.get('TestUser', 'TestRepo')
      .then(function (result) {
        expect(result.length).toBeGreaterThan(0);
        branchCollector.get.cache = {};
        done();
      });

    var callback = github.repos.getBranches.calls.argsFor(0)[1];
    var result = [1, 2, 3];
    result.meta = {};
    callback(null, result);
    $rootScope.$apply();
  });

  xit('Should call github.hasNextPage to check if pagination is needed', function (done) {
    spyOn(github.repos, 'getBranches');
    spyOn(github, 'hasNextPage').and.returnValue(false);
    branchCollector.get('TestUser', 'TestRepo')
      .then(function () {
        expect(github.hasNextPage).toHaveBeenCalledWith([1, 2, 3]);
        done();
      });
    var callback = github.repos.getBranches.calls.argsFor(0)[1];
    var result = [1, 2, 3];
    result.meta = {};
    callback(null, result);
    $rootScope.$apply();
  });

  xit('Should call github.getNextPage if github result is paginated and return concatenated result', function (done) {
    spyOn(github.repos, 'getBranches');
    spyOn(github, 'hasNextPage').and.returnValue(true);
    spyOn(github, 'getNextPage');
    branchCollector.get('TestUser', 'TestRepo')
      .then(function (result) {
        expect(github.getNextPage).toHaveBeenCalledWith([1, 2, 3], jasmine.any(Function));
        expect(result.length).toBe(6);
        expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        done();
      });


    var callback = github.repos.getBranches.calls.argsFor(0)[1];
    var result = [1, 2, 3];
    result.meta = {};
    callback(null, result);

    github.hasNextPage.and.returnValue(false);

    var getNextPageCallback = github.getNextPage.calls.argsFor(0)[1];
    var result1 = [4, 5, 6];
    result.meta = {};
    getNextPageCallback(null, result1);
    $rootScope.$apply();
  });

  it('Should reject if github.getNextPage throws error', function (done) {
    spyOn(github.repos, 'getBranches');
    spyOn(github, 'hasNextPage').and.returnValue(true);
    spyOn(github, 'getNextPage');
    branchCollector.get('TestUser', 'TestRepo')
      .then(null, function () {
        branchCollector.get.cache = {};
        done();
      });


    var callback = github.repos.getBranches.calls.argsFor(0)[1];
    var result = [1, 2, 3];
    result.meta = {};
    callback(null, result);

    github.hasNextPage.and.returnValue(false);

    var getNextPageCallback = github.getNextPage.calls.argsFor(0)[1];
    getNextPageCallback({});
    $rootScope.$apply();
  });

  it('Should add a well named cache object', function () {
    spyOn(github.repos, 'getBranches');
    branchCollector.get('TestUser', 'TestRepo');
    expect(branchCollector.get.cache.has('TestUser-TestRepo')).toBe(true);
  });

  it('Should invalidate cache after a given time', function () {
    spyOn(github.repos, 'getBranches');
    branchCollector.get('TestUser', 'TestRepo');
    expect(branchCollector.get.cache.has('TestUser-TestRepo')).toBe(true);
    var cacheExpireTime = 15 * 60 * 1000; //15min
    $timeout.flush(cacheExpireTime);
    expect(branchCollector.get.cache.has('TestUser-TestRepo')).toBe(false);
  });
});