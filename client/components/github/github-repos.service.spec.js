describe('Service: github-repos', function () {
  'use strict';

  beforeEach(module('GHReview'));

  var getAllAvailableRepos, githubUserData, github, $rootScope;

  beforeEach(inject(function ($injector) {
    getAllAvailableRepos = $injector.get('getAllAvailableRepos');
    githubUserData = $injector.get('githubUserData');
    github = $injector.get('github');
    $rootScope = $injector.get('$rootScope');
  }));

  it('Should be defined', function () {
    getAllAvailableRepos();
    expect(getAllAvailableRepos).toBeDefined();
  });

  it('Should call github.repos.getAll', function () {
    spyOn(github.repos, 'getAll');
    getAllAvailableRepos();
    $rootScope.$apply();
    expect(github.repos.getAll).toHaveBeenCalled();
  });

  it('Should return promise and resolve if data exist', function (done) {
    spyOn(github.repos, 'getAll');
    getAllAvailableRepos()
      .then(function (data) {
        expect(data).toBeDefined();
        done();
      });

    $rootScope.$apply();

    var getAllAvailableReposCallback = github.repos.getAll.calls.argsFor(0)[1];
    getAllAvailableReposCallback(null, {});
    $rootScope.$apply();
  });

  it('Should return promise and reject if error exist', function (done) {
    spyOn(github.repos, 'getAll');
    getAllAvailableRepos()
      .then(null, function (data) {
        expect(data).toBeDefined();
        expect(data.name).toBe('Error');
        done();
      });

    $rootScope.$apply();

    var getAllAvailableReposCallback = github.repos.getAll.calls.argsFor(0)[1];
    getAllAvailableReposCallback({
      name: 'Error'
    }, null);
    $rootScope.$apply();
  });

});