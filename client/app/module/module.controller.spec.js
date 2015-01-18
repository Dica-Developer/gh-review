(function () {
  'use strict';

  describe('Controller: ModuleFilterController', function () {

    beforeEach(module('GHReview'));

    var $q, ModuleFilterController, $scope, $controller, github, spy = {};

    beforeEach(inject(function ($injector) {
      github = $injector.get('github');
      spy.githubFreeSearch = $injector.get('githubFreeSearch');
      $q = $injector.get('$q');
      $controller = $injector.get('$controller');
      var $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
    }));

    it('Should be defined', function () {
      ModuleFilterController = $controller('ModuleFilterController', {
        $scope: $scope
      });
      expect(ModuleFilterController).toBeDefined();
    });

    it('Should have empty search string', function () {
      ModuleFilterController = $controller('ModuleFilterController', {
        $scope: $scope
      });
      expect($scope.searchString).toBeDefined();
      expect($scope.searchString).toBe('');
    });

    it('Should call githubFreeSearch when calling $scope.doSearch', function () {
      spyOn(spy, 'githubFreeSearch').and.returnValue({
        then: function () {
        }
      });
      ModuleFilterController = $controller('ModuleFilterController', {
        $scope: $scope,
        githubFreeSearch: spy.githubFreeSearch
      });
      $scope.doSearch();
      $scope.$apply();
      expect(spy.githubFreeSearch).toHaveBeenCalled();
    });

    it('Should set $scope.reult to response of gitHubFreeSearch request', function () {
      var defer = $q.defer();
      spyOn(spy, 'githubFreeSearch').and.returnValue(defer.promise);
      ModuleFilterController = $controller('ModuleFilterController', {
        $scope: $scope,
        githubFreeSearch: spy.githubFreeSearch
      });
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

}());
