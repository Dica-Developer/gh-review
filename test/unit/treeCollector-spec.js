/*global inject*/
describe('treeCollector', function () {
  'use strict';

  var treeCollector, github, $rootScope, $interval;

  beforeEach(angular.mock.module('GHReview'));

  beforeEach(inject(function ($injector) {
    treeCollector = $injector.get('treeCollector');
    github = $injector.get('github');
    $rootScope = $injector.get('$rootScope');
    $interval = $injector.get('$interval');
  }));

  it('Should be defined', function () {
    expect(treeCollector).toBeDefined();
  });

  it('Should call github.getTree with correct arguments if ".get" is called', function(){
    spyOn(github.gitdata, 'getTree');

    treeCollector.get('TestUser', 'TestRepo', 'master');
    treeCollector.get.cache = {};

    expect(github.gitdata.getTree).toHaveBeenCalled();
    expect(github.gitdata.getTree).toHaveBeenCalledWith({ user : 'TestUser', repo : 'TestRepo', sha : 'master', recursive : true }, jasmine.any(Function));
  });

  it('Should be rejected if github throws error', function(done){
    spyOn(github.gitdata, 'getTree');

    treeCollector.get('TestUser', 'TestRepo', 'master')
      .then(null, function(){
        treeCollector.get.cache = {};
        done();
      });

    var callback = github.gitdata.getTree.calls.argsFor(0)[1];
    callback({});
    $rootScope.$apply();
  });

  it('Should be resolved with result', function(done){
    spyOn(github.gitdata, 'getTree');

    treeCollector.get('TestUser', 'TestRepo', 'master')
      .then(function(result){
        expect(result.length).toBeGreaterThan(0);
        treeCollector.get.cache = {};
        done();
      });

    var callback = github.gitdata.getTree.calls.argsFor(0)[1];
    var result = {
      tree: [1, 2, 3],
      meta: {}
    };
    callback(null, result);
    $rootScope.$apply();
  });

  it('Should call github.hasNextPage to check if pagination is needed', function(done){
    var result = {
      tree: [1, 2, 3],
      meta: {}
    };

    spyOn(github.gitdata, 'getTree');
    spyOn(github, 'hasNextPage').and.returnValue(false);
    treeCollector.get('TestUser', 'TestRepo', 'master')
      .then(function(){
        expect(github.hasNextPage).toHaveBeenCalledWith(result);
        treeCollector.get.cache = {};
        done();
      });
    var callback = github.gitdata.getTree.calls.argsFor(0)[1];
    callback(null, result);
    $rootScope.$apply();
  });

  it('Should call github.getNextPage if github result is paginated and return concatenated result', function(done){
    var githubResult = {
      tree: [1, 2, 3],
      meta: {}
    };

    spyOn(github.gitdata, 'getTree');
    spyOn(github, 'hasNextPage').and.returnValue(true);
    spyOn(github, 'getNextPage');
    treeCollector.get('TestUser', 'TestRepo', 'master')
      .then(function(result){
        expect(github.getNextPage).toHaveBeenCalledWith(githubResult, jasmine.any(Function));
        expect(result.length).toBe(6);
        expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        treeCollector.get.cache = {};
        done();
      });


    var callback = github.gitdata.getTree.calls.argsFor(0)[1];
    callback(null, githubResult);

    github.hasNextPage.and.returnValue(false);

    var getNextPageCallback = github.getNextPage.calls.argsFor(0)[1];
    var result1 = {
      tree: [4, 5, 6],
      meta: {}
    };
    getNextPageCallback(null, result1);
    $rootScope.$apply();
  });

  it('Should reject if github.getNextPage throws error', function(done){
    spyOn(github.gitdata, 'getTree');
    spyOn(github, 'hasNextPage').and.returnValue(true);
    spyOn(github, 'getNextPage');
    treeCollector.get('TestUser', 'TestRepo', 'master')
      .then(null, function(){
        treeCollector.get.cache = {};
        done();
      });


    var callback = github.gitdata.getTree.calls.argsFor(0)[1];
    var result = {
      tree: [1, 2, 3],
      meta: {}
    };
    callback(null, result);

    github.hasNextPage.and.returnValue(false);

    var getNextPageCallback = github.getNextPage.calls.argsFor(0)[1];
    getNextPageCallback({});
    $rootScope.$apply();
  });

  it('Should add a well named cache object', function(){
    spyOn(github.gitdata, 'getTree');
    treeCollector.get('TestUser', 'TestRepo', 'master');
    expect(treeCollector.get.cache).toBeDefined();
    expect(treeCollector.get.cache['TestUser-TestRepo-master']).toBeDefined();
  });

  it('Should invalidate cache after a given time', function(){
    spyOn(github.gitdata, 'getTree');
    treeCollector.get('TestUser', 'TestRepo', 'master');
    expect(treeCollector.get.cache).toBeDefined();
    expect(treeCollector.get.cache['TestUser-TestRepo-master']).toBeDefined();
    var cacheExpireTime = 30 * 60 * 1000; //30min
    $interval.flush(cacheExpireTime);
    expect(treeCollector.get.cache['TestUser-TestRepo-master']).not.toBeDefined();
  });
});