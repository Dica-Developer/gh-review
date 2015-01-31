describe('Directive: commit-header', function () {
  'use strict';
  beforeEach(module('GHReview'));
  beforeEach(module('commitMockModule'));
  beforeEach(module('app/directives/commit-header/commit-header-collabsible.html'));
  beforeEach(module('app/directives/avatar/avatar.html'));
  beforeEach(module('app/directives/formatted-date/formatted-date.html'));

  var $compile, $rootScope, $scope, _, commitsMock;

  beforeEach(inject(function ($injector) {
    $compile = $injector.get('$compile');
    _ = $injector.get('_');
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    commitsMock = $injector.get('commitsMock');
  }));

  it('should not collabsible if message does not hit 100 character', function () {
    $scope.commitResponse = commitsMock[0];
    $scope.commitResponse.commit.message = _.range(54).join('');
    var element = $compile('<commit-header commit="commitResponse.commit"></commit-header>')($scope);
    $scope.$apply();
    var text = element.find('h3').text(),
      accordion = element.find('accordion');

    expect(text).toBe(_.range(54).join(''));
    expect(text.indexOf('...')).toBe(-1);
    expect(accordion.length).toBe(0);
    expect($scope.commitHeaderStatus.shouldCollapse).toBe(false);
  });

  it('should collabsible if message has 100 or more character', function () {
    $scope.commitResponse = commitsMock[0];
    $scope.commitResponse.commit.message = _.range(55).join('');
    var element = $compile('<commit-header commit="commitResponse.commit"></commit-header>')($scope);
    $scope.$apply();
    var text = element.find('commit-message-teaser').text(),
      accordion = element.find('accordion');
    expect(text.indexOf('...')).toBeGreaterThan(-1);
    expect(accordion.length).toBe(1);
    expect($scope.commitHeaderStatus.shouldCollapse).toBe(true);
  });

});