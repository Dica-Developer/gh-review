describe('Service: github-freesearch', function () {
  'use strict';

  beforeEach(module('GHReview'));

  var ghSearch, authenticated, github, $rootScope;

  beforeEach(inject(function ($injector) {
    ghSearch = $injector.get('ghSearch');
    authenticated = $injector.get('authenticated');
    github = $injector.get('github');
    $rootScope = $injector.get('$rootScope');
  }));

  it('Should call github.search.code', function () {
    spyOn(github.search, 'code');
    ghSearch.query();
    expect(github.search.code).toHaveBeenCalled();
  });

  it('Should return promise and resolve if data exist', function (done) {
    spyOn(github.search, 'code');
    ghSearch.query()
      .then(function (data) {
        expect(data).toBeDefined();
        expect(data.result).toBe('testResult');
        done();
      });
    var callback = github.search.code.calls.argsFor(0)[1];
    callback(null, {
      result: 'testResult'
    });
    expect(github.search.code).toHaveBeenCalled();
    $rootScope.$apply();
  });

  it('Should return promise and reject if error exist', function (done) {
    spyOn(github.search, 'code');
    ghSearch.query()
      .then(null, function (error) {
        expect(error).toBeDefined();
        expect(error.name).toBe('Error');
        done();
      });
    var callback = github.search.code.calls.argsFor(0)[1];
    callback({
      name: 'Error'
    }, null);
    expect(github.search.code).toHaveBeenCalled();
    $rootScope.$apply();
  });

});