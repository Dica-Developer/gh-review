describe('Directive: avatar', function () {
  'use strict';

  beforeEach(module('GHReview'));
  beforeEach(module('app/directives/avatar/avatar.html'));
  beforeEach(module('commitMockModule'));

  var $compile, $rootScope, $scope, commitMock;

  beforeEach(inject(function ($injector) {
    $compile = $injector.get('$compile');
    commitMock = $injector.get('commitsMock');
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
  }));

  it('Should render avatar link and img with complete data', function () {
    var element = $compile('<avatar commit="commitResponse"></avatar>')($scope);
    $scope.commitResponse = commitMock[0];
    $scope.$digest();
    expect(element.find('a').attr('title')).toBe('Sebastian Froehlich');
    expect(element.find('a').attr('href')).toBe('https://github.com/sebfroh');
    expect(element.find('img').attr('ng-src')).toBe('https://avatars.githubusercontent.com/u/818746?v=2');
    expect(element.find('img').attr('src')).toBe('https://avatars.githubusercontent.com/u/818746?v=2');
    expect(element.find('img').attr('height')).toBe('32px');
  });

  it('Should render avatar link and img with default values if committer property is is missing', function () {
    var element = $compile('<avatar commit="commitResponse"></avatar>')($scope);
    $scope.commitResponse = commitMock[0];
    /*jshint camelcase:false*/
    delete $scope.commitResponse.committer;
    $scope.$digest();
    expect(element.find('a').attr('title')).toBe('Sebastian Froehlich');
    expect(element.find('a').attr('href')).toBe('#');
    expect(element.find('img').attr('ng-src')).toBe('assets/images/icon-social-github-128.png');
    expect(element.find('img').attr('src')).toBe('assets/images/icon-social-github-128.png');
    expect(element.find('img').attr('height')).toBe('32px');
  });
});