describe('Directive: commit-message-teaser', function () {
  'use strict';
  beforeEach(angular.mock.module('GHReview'));

  var $compile, $rootScope, $scope, _;

  beforeEach(inject(function ($injector) {
    $compile = $injector.get('$compile');
    _ = $injector.get('_');
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
  }));

  it('Should render full message', function () {
    $scope.commit = {
      message: _.range(54).join('')
    };
    var element = $compile('<commit-message-teaser message="commit.message"></commit-message-teaser>')($scope);
    $scope.$apply();
    var text = element.text();
    expect(text).toBe(_.range(54).join(''));
    expect(text.indexOf('...')).toBe(-1);
  });

  it('Should render cropped message and add "..."', function () {
    $scope.commit = {
      message: _.range(55).join('')
    };
    var element = $compile('<commit-message-teaser message="commit.message"></commit-message-teaser>')($scope);
    $scope.$apply();
    var text = element.text();
    expect(text.indexOf('...')).toBe(100);
  });

  it('Should render message as text instead of html', function () {
    $scope.commit = {
      message: '<img src="#" />'
    };
    var element = $compile('<commit-message-teaser message="commit.message"></commit-message-teaser>')($scope);
    $scope.$apply();
    var text = element.text();
    expect(element.find('img').length).toBe(0);
    expect(text).toBe('<img src="#" />');
  });

});