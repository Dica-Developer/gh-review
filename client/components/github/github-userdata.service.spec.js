describe('Service: github-userdata', function () {
  'use strict';

  beforeEach(module('GHReview'));

  var githubUserData, github, $rootScope;

  beforeEach(inject(function ($injector) {
    githubUserData = $injector.get('githubUserData');
    github = $injector.get('github');
    $rootScope = $injector.get('$rootScope');
  }));

  it('Should be defined', function () {
    expect(githubUserData).toBeDefined();
  });

  it('Should call "github.user.get"', function () {
    spyOn(github.user, 'get');
    githubUserData.get();
    expect(github.user.get).toHaveBeenCalled();
  });

  it('Should return promise and resolve if response has no errors', function (done) {
    spyOn(github.user, 'get');

    githubUserData.get()
      .then(function (data) {
        expect(data).toBeDefined();
        done();
      });

    var getCallback = github.user.get.calls.argsFor(0)[1];
    getCallback(null, {});

    $rootScope.$apply();
  });

  it('Should return promise and reject if response has errors', function (done) {
    spyOn(github.user, 'get');

    githubUserData.get()
      .then(function (data) {
        expect(data).toBeDefined();
        done();
      }, function (error) {
        expect(error.name).toBe('TestError');
        done();
      });

    var getCallback = github.user.get.calls.argsFor(0)[1];
    getCallback({
      name: 'TestError'
    }, null);

    $rootScope.$apply();
  });

  it('Should take cached userData instead calling github if userData already fetched', function (done) {
    spyOn(github.user, 'get');

    githubUserData.get()
      .then(function () {
        expect(github.user.get).toHaveBeenCalled();
      });

    var getCallback = github.user.get.calls.argsFor(0)[1];
    getCallback(null, {});
    $rootScope.$apply();

    githubUserData.get()
      .then(function () {
        expect(github.user.get.call.length).toBe(1);
        done();
      });
    $rootScope.$apply();
  });

});