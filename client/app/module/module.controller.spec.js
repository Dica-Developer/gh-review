describe('Controller: ModuleFilterController', function () {
  'use strict';

  beforeEach(module('GHReview'));

  var $q, $scope, ghSearch;

  beforeEach(inject(function ($injector) {
    var $controller = $injector.get('$controller');
    var $rootScope = $injector.get('$rootScope');

    ghSearch = $injector.get('ghSearch');
    $q = $injector.get('$q');
    $scope = $rootScope.$new();
    $controller('ModuleFilterController', {$scope: $scope});
  }));

  it('Should have empty search string', function () {
    expect($scope.searchString).toBeDefined();
    expect($scope.searchString).toBe('');
  });

  it('Should call ghSearch.query when calling $scope.doSearch', function () {
    spyOn(ghSearch, 'query').and.returnValue($q.when({items: []}));
    $scope.doSearch();
    $scope.$apply();
    expect(ghSearch.query).toHaveBeenCalled();
  });

  it('Should set $scope.result to response of ghSearch.query request', function () {
    var defer = $q.defer();
    spyOn(ghSearch, 'query').and.returnValue(defer.promise);
    $scope.doSearch();
    expect($scope.result).toBeUndefined();
    var items = [1, 2, 3];
    defer.resolve({
      items: items
    });
    $scope.$apply();
    expect($scope.result).toBeDefined();
    expect($scope.result).toBe(items);
  });

});
