describe('Directive: avatar', function () {
  'use strict';

  beforeEach(module('GHReview'));
  beforeEach(module('app/directives/avatar/avatar.html'));

  var $compile, $rootScope, $scope;

  beforeEach(inject(function ($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
  }));

  it('Should render avatar link and img with complete data', function () {
    var element = $compile('<avatar commit="commit.committer"></avatar>')($scope);
    $scope.commit = {
      committer: {
        name: 'TestName',
        avatar: 'https://avatars2.githubusercontent.com/u/1409907?v=2&s=200',
        committerLink: 'committerLink'
      }
    };
    $scope.$digest();
    expect(element.find('a').attr('title')).toBe('TestName');
    expect(element.find('a').attr('href')).toBe('committerLink');
    expect(element.find('img').attr('ng-src')).toBe('https://avatars2.githubusercontent.com/u/1409907?v=2&s=200');
    expect(element.find('img').attr('src')).toBe('https://avatars2.githubusercontent.com/u/1409907?v=2&s=200');
    expect(element.find('img').attr('height')).toBe('32px');
  });

  it('Should render avatar link and img with committerLink is missing', function () {
    var element = $compile('<avatar commit="commit.committer"></avatar>')($scope);
    $scope.commit = {
      committer: {
        name: 'TestName',
        avatar: 'https://avatars2.githubusercontent.com/u/1409907?v=2&s=200'
      }
    };
    $scope.$digest();
    expect(element.find('a').attr('title')).toBe('TestName');
    expect(element.find('a').attr('href')).toBe('#');
    expect(element.find('img').attr('ng-src')).toBe('https://avatars2.githubusercontent.com/u/1409907?v=2&s=200');
    expect(element.find('img').attr('src')).toBe('https://avatars2.githubusercontent.com/u/1409907?v=2&s=200');
    expect(element.find('img').attr('height')).toBe('32px');
  });
});