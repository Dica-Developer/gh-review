/*global inject*/
describe('Service: eventCollector', function () {
  'use strict';

  var eventCollector, github, $rootScope, $timeout;

  beforeEach(angular.mock.module('GHReview'));

  beforeEach(inject(function ($injector) {
    eventCollector = $injector.get('eventCollector');
    github = $injector.get('github');
    $rootScope = $injector.get('$rootScope');
    $timeout = $injector.get('$timeout');
  }));

  it('Should be defined', function () {
    expect(eventCollector).toBeDefined();
  });

  it('Should call github.events.getFromRepo with correct arguments if ".get" is called', function () {
    spyOn(github.events, 'getFromRepo');

    eventCollector.get({
      user: 'TestUser',
      repo: 'TestRepo'
    });
    eventCollector.get.cache = {};

    expect(github.events.getFromRepo).toHaveBeenCalled();
    expect(github.events.getFromRepo).toHaveBeenCalledWith({
      user: 'TestUser',
      repo: 'TestRepo'
    }, jasmine.any(Function));
  });

  it('Should add "If-None-Match" header if etag is given', function () {
    spyOn(github.events, 'getFromRepo');

    eventCollector.get({
      user: 'TestUser',
      repo: 'TestRepo',
      etag: 'TestEtag'
    });
    eventCollector.get.cache = {};

    expect(github.events.getFromRepo).toHaveBeenCalled();
    expect(github.events.getFromRepo).toHaveBeenCalledWith({
      user: 'TestUser',
      repo: 'TestRepo',
      etag: 'TestEtag',
      headers : {
        'If-None-Match' : 'TestEtag'
      }
    }, jasmine.any(Function));
  });

  it('Should be rejected if github throws error', function (done) {
    spyOn(github.events, 'getFromRepo');

    eventCollector.get({
      user: 'TestUser',
      repo: 'TestRepo'
    })
      .then(null, function () {
        eventCollector.get.cache = {};
        done();
      });

    var callback = github.events.getFromRepo.calls.argsFor(0)[1];
    callback({});
    $rootScope.$apply();
  });

  it('Should be resolved with event list and new etag', function (done) {
    spyOn(github.events, 'getFromRepo');

    eventCollector.get({
      user: 'TestUser',
      repo: 'TestRepo'
    })
      .then(function (data) {
        expect(data.result.length).toBeGreaterThan(0);
        expect(data.etag).toBe('etag');
        eventCollector.get.cache = {};
        done();
      });

    var callback = github.events.getFromRepo.calls.argsFor(0)[1];
    var result = [1, 2, 3];
    result.meta = {
      etag: 'etag'
    };
    callback(null, result);
    $rootScope.$apply();
  });

  it('Should resolve with old etag if no new is responded', function (done) {
    spyOn(github.events, 'getFromRepo');

    eventCollector.get({
      user: 'TestUser',
      repo: 'TestRepo',
      etag: 'old_etag'
    })
      .then(function (data) {
        expect(data.result.length).toBeGreaterThan(0);
        expect(data.etag).toBe('old_etag');
        eventCollector.get.cache = {};
        done();
      });

    var callback = github.events.getFromRepo.calls.argsFor(0)[1];
    var result = [1, 2, 3];
    callback(null, result);
    $rootScope.$apply();
  });

  it('Should resolve and set new poll interval', function (done) {
    spyOn(github.events, 'getFromRepo');

    expect(eventCollector.pollInterval).toBe(60000);
    eventCollector.get({
      user: 'TestUser',
      repo: 'TestRepo'
    })
      .then(function () {
        expect(eventCollector.pollInterval).toBe(42000);
        eventCollector.get.cache = {};
        eventCollector.pollInterval = 60000;
        done();
      });

    var callback = github.events.getFromRepo.calls.argsFor(0)[1];
    var result = [];
    result.meta = {
      'x-poll-interval': '42'
    };
    callback(null, result);
    $rootScope.$apply();
  });

  it('Should add a well named cache object', function () {
    spyOn(github.events, 'getFromRepo');
    eventCollector.get({
      user: 'TestUser',
      repo: 'TestRepo'
    });
    expect(eventCollector.get.cache.has('TestUser/TestRepo')).toBe(true);
  });

  it('Should invalidate cache after a given time', function () {
    var cacheExpireTime = 60 * 1000;
    spyOn(github.events, 'getFromRepo');
    eventCollector.get({
      user: 'TestUser',
      repo: 'TestRepo'
    });
    $timeout.flush(cacheExpireTime / 2);
    eventCollector.get({
      user: 'TestUser1',
      repo: 'TestRepo2'
    });
    expect(eventCollector.get.cache.has('TestUser/TestRepo')).toBe(true);
    expect(eventCollector.get.cache.has('TestUser1/TestRepo2')).toBe(true);
    $timeout.flush(cacheExpireTime / 2);
    expect(eventCollector.get.cache.has('TestUser/TestRepo')).toBe(false);
    expect(eventCollector.get.cache.has('TestUser1/TestRepo2')).toBe(true);
    $timeout.flush(cacheExpireTime / 2);
    expect(eventCollector.get.cache.has('TestUser1/TestRepo2')).toBe(false);
  });
});