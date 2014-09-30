define([
  'angular',
  'angularMocks',
  'app'
], function (angular, mocks) {
  'use strict';

  beforeEach(angular.mock.module('GHReview'));


  describe('FilterController', function () {
    var $rootScope, $scope, controller, $state;

    beforeEach(mocks.inject(function ($injector) {
      localStorage.setItem('ls.filter', 'e0a35c44-1066-9a60-22f2-86bd825bc70c');
      localStorage.setItem('ls.filter-e0a35c44-1066-9a60-22f2-86bd825bc70c', '{"sha":"master","customFilter":{},"repo":"forTestUseOnly","user":"jwebertest","since":"2014-04-14T16:41:48.746Z","id":"e0a35c44-1066-9a60-22f2-86bd825bc70c"}');
      localStorage.setItem('ls.accessToken', '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $state = $injector.get('$state');

      var $controller = $injector.get('$controller');
      controller = $controller('FilterController', {
        '$scope': $scope,
        'getAllRepos': function(){
          return {
            then: function(){}
          };
        }
      });
    }));

    afterEach(function () {
      localStorage.clear();
    });

    it('Should be defined', function () {
      expect(controller).toBeDefined();
    });

    describe('Scope values', function(){

      it('Should have default value on start up', function(){
        expect($scope.allRepos).toBe(false);
        expect($scope.selectedRepo).toBeNull();
        expect($scope.selectedBranch).toBeNull();
        expect($scope.branchSelection).toBeNull();
        expect($scope.contributor).toBeNull();
        expect($scope.contributorList).toBeNull();
        expect($scope.commits).toBeNull();
        expect($scope.fetchingRepos).toBe(true);
        expect($scope.fetchingBranches).toBe(false);
        expect($scope.fetchingCommits).toBe(true);
        expect($scope.availableFilterSincePattern).toEqual(['days', 'weeks', 'years']);
        expect($scope.filterSinceAmount).toBe(2);
        expect($scope.filterSincePattern).toBe('weeks');
      });

    });

  });
});
