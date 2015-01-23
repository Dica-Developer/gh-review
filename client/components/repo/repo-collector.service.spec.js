/*global inject*/
describe('Service: repoCollector', function () {
  'use strict';

  var repoCollector, github, $rootScope, $interval, $q;

  beforeEach(module('GHReview'));

  beforeEach(inject(function ($injector) {
    repoCollector = $injector.get('repoCollector');
    github = $injector.get('github');
    $rootScope = $injector.get('$rootScope');
    $interval = $injector.get('$interval');
    $q = $injector.get('$q');
  }));

  it('Should be defined', function () {
    expect(repoCollector).toBeDefined();
  });

  describe('repoCollector.getOrganizationsForUser', function () {

    it('should call github.user.getOrgs and resolve', function (done) {
      spyOn(github.user, 'getOrgs');

      repoCollector.getOrganizationsForUser()
        .then(function (result) {
          expect(result).toBeDefined();
          expect(result.length).toBe(3);
          expect(github.user.getOrgs).toHaveBeenCalledWith({'per_page': 100}, jasmine.any(Function));
          done();
        });

      var callback = github.user.getOrgs.calls.argsFor(0)[1];
      callback(null, [1, 2, 3]);
      $rootScope.$apply();
    });

    it('should call github.user.getOrgs and reject if github throws error', function (done) {
      spyOn(github.user, 'getOrgs');

      repoCollector.getOrganizationsForUser()
        .then(null, function () {
          done();
        });

      var callback = github.user.getOrgs.calls.argsFor(0)[1];
      callback({});
      $rootScope.$apply();
    });
  });

  describe('repoCollector.getReposFromOrganizations', function () {

    it('should call github.repos.getFromOrg and resolve', function (done) {
      spyOn(github.repos, 'getFromOrg');

      repoCollector.getReposFromOrganizations([{login: 'TestOrganization'}])
        .then(function (result) {
          expect(result).toBeDefined();
          expect(result.length).toBe(3);
          /*jshint camelcase:false*/
          expect(github.repos.getFromOrg).toHaveBeenCalledWith({
            org: 'TestOrganization',
            per_page: 100
          }, jasmine.any(Function));
          done();
        });

      var callback = github.repos.getFromOrg.calls.argsFor(0)[1];
      callback(null, [1, 2, 3]);
      $rootScope.$apply();
    });

    it('should call github.repos.getFromOrg and reject if github throws error', function (done) {
      spyOn(github.repos, 'getFromOrg');

      repoCollector.getReposFromOrganizations([{login: 'TestOrganization'}])
        .then(null, function () {
          done();
        });

      var callback = github.repos.getFromOrg.calls.argsFor(0)[1];
      callback({});
      $rootScope.$apply();
    });
  });

  describe('repoCollector.getReposFromUser', function () {

    it('should call github.repos.getAll and resolve', function (done) {
      spyOn(github.repos, 'getAll');

      repoCollector.getReposFromUser([1, 2, 3])
        .then(function (result) {
          expect(result).toBeDefined();
          expect(result.length).toBe(6);
          expect(result).toEqual([1, 2, 3, 4, 5, 6]);
          /*jshint camelcase:false*/
          expect(github.repos.getAll).toHaveBeenCalledWith({per_page: 100}, jasmine.any(Function));
          done();
        });

      var callback = github.repos.getAll.calls.argsFor(0)[1];
      callback(null, [4, 5, 6]);
      $rootScope.$apply();
    });

    it('should call github.repos.getAll and reject if github throws error', function (done) {
      spyOn(github.repos, 'getAll');

      repoCollector.getReposFromUser([1, 2, 3])
        .then(null, function () {
          done();
        });

      var callback = github.repos.getAll.calls.argsFor(0)[1];
      callback({});
      $rootScope.$apply();
    });
  });

  it('Should invalidate cache after a given time', function () {
    spyOn(repoCollector, 'getOrganizationsForUser').and.callFake(function () {
      return $q.when([{login: 'TestOrganization'}]);
    });
    spyOn(repoCollector, 'getReposFromOrganizations').and.callFake(function () {
      return $q.when([1, 2, 3]);
    });
    spyOn(repoCollector, 'getReposFromUser').and.callFake(function () {
      return $q.when([1, 2, 3]);
    });

    repoCollector.getAll();
    expect(repoCollector.getAll.cache).toBeDefined();
    expect(Object.keys(repoCollector.getAll.cache).length).toBe(1);
    var cacheExpireTime = 60 * 60 * 1000; //60min
    $interval.flush(cacheExpireTime);
    expect(Object.keys(repoCollector.getAll.cache).length).toBe(0);
  });
});