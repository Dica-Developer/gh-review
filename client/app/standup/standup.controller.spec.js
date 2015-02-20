describe('Controller: StandupController', function(){
  'use strict';

  beforeEach(module('GHReview'));

  var $rootScope, $controller, $scope, $q, newFilter;

  beforeEach(inject(function ($injector) {
    var filter = $injector.get('filter');

    $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
    $q = $injector.get('$q');
    $scope = $rootScope.$new();
    newFilter = filter.getNew();
  }));

  it('Should call filter.getCommitsForStandup', function(){
    spyOn(newFilter, 'getCommitsForStandup').and.returnValue($q.when());
    var filterId = newFilter.getId();
    $controller('StandupController', {
      $scope: $scope,
      $stateParams: {
        filterId: filterId
      }
    });

    expect(newFilter.getCommitsForStandup).toHaveBeenCalled();
  });

  it('Should set correct $scope variables before fetching', function(){
    spyOn(newFilter, 'getCommitsForStandup').and.returnValue($q.when());
    var filterId = newFilter.getId();
    $controller('StandupController', {
      $scope: $scope,
      $stateParams: {
        filterId: filterId
      }
    });

    expect($scope.filter).toBe(newFilter);
    expect($scope.fetchingCommits).toBe(true);
    expect($scope.commits).not.toBeDefined();
  });

  it('Should set correct $scope variables after fetching', function(){
    var commitList = [1, 2, 3];
    spyOn(newFilter, 'getCommitsForStandup').and.returnValue($q.when(commitList));
    var filterId = newFilter.getId();
    $controller('StandupController', {
      $scope: $scope,
      $stateParams: {
        filterId: filterId
      }
    });

    $rootScope.$apply();
    expect($scope.filter).toBe(newFilter);
    expect($scope.fetchingCommits).toBe(false);
    expect($scope.commits).toBe(commitList);
  });

});
