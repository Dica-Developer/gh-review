describe('Service: github-file', function () {
  'use strict';

  beforeEach(module('GHReview'));

  var ghFile, github, $rootScope;

  beforeEach(inject(function ($injector) {
    ghFile = $injector.get('ghFile');
    github = $injector.get('github');
    $rootScope = $injector.get('$rootScope');
  }));

  it('Should call github.search.code', function () {
    spyOn(github.repos, 'getContent');
    ghFile.getContent({});
    expect(github.repos.getContent).toHaveBeenCalled();
  });

  it('Should return promise and resolve if data exist', function (done) {
    spyOn(github.repos, 'getContent');
    ghFile.getContent({})
      .then(function (data) {
        expect(data).toBeDefined();
        expect(data.result).toBe('testResult');
        done();
      });
    var callback = github.repos.getContent.calls.argsFor(0)[1];
    callback(null, {
      data: {
        result: 'testResult'
      }
    });
    expect(github.repos.getContent).toHaveBeenCalled();
    $rootScope.$apply();
  });

  it('Should return promise and reject if error exist', function (done) {
    spyOn(github.repos, 'getContent');
    ghFile.getContent({})
      .then(null, function (error) {
        expect(error).toBeDefined();
        expect(error.name).toBe('Error');
        done();
      });
    var callback = github.repos.getContent.calls.argsFor(0)[1];
    callback({
      name: 'Error'
    }, null);
    expect(github.repos.getContent).toHaveBeenCalled();
    $rootScope.$apply();
  });

});