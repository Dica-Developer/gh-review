/*global inject*/
describe('#Controller', function () {
  'use strict';

  beforeEach(angular.mock.module('GHReview'));
  beforeEach(angular.mock.module('templates'));

  describe('ModuleFilterController', function () {
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

  describe('RootController', function () {

    it('Should go to state "listFilter" if at least one filter is defined', inject(function($injector){
      var state = $injector.get('$state');
      var stateSpy = spyOn(state, 'go');
      var filterSpy = {getAll: function(){
        return [1,2];
      }};
      var $rootScope = $injector.get('$rootScope');
      var $scope = $rootScope.$new();
      var $controller = $injector.get('$controller');
      $controller('RootController', {
        '$scope': $scope,
        'filter': filterSpy
      });
      expect(stateSpy).toHaveBeenCalledWith('listFilter');
    }));

    it('Should go to state "addFilter" if no filter is defined', inject(function($injector){
      var state = $injector.get('$state');
      var stateSpy = spyOn(state, 'go');
      var filterSpy = {getAll: function(){
        return [];
      }};
      var $rootScope = $injector.get('$rootScope');
      var $scope = $rootScope.$new();
      var $controller = $injector.get('$controller');
      $controller('RootController', {
        '$scope': $scope,
        'filter': filterSpy
      });
      expect(stateSpy).toHaveBeenCalledWith('addFilter');
    }));

  });

  describe('LoginController', function () {

    it('Should set window.location.href to correct value', inject(function ($injector) {
      var $windowSpy = {location: {href: null}};
      var $rootScope = $injector.get('$rootScope');
      var $scope = $rootScope.$new();
      var $controller = $injector.get('$controller');
      $controller('LoginController', {
        '$scope': $scope,
        '$window': $windowSpy
      });
      expect($windowSpy.location.href).toBe('https://github.com/login/oauth/authorize?client_id=5082108e53d762d90c00&redirect_uri=http://localhost:9000/oauth/&scope=user, repo');
    }));
  });

  describe('MenuDirectiveController', function () {

    describe('$scope.name', function(){

      var $rootScope, $scope, controller, $q;

      beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        $q = $injector.get('$q');

        var $controller = $injector.get('$controller');
        controller = $controller('menuDirectiveController', {
          '$scope': $scope,
          'authenticated': {get: function(){
            return true;
          }},
          'collectComments': function(){},
          'githubUserData': {
            get: function(){
              var defer = $q.defer();
              defer.resolve({name: 'TestUser'});
              return defer.promise;
            }
          }
        });
      }));

      it('Should call "githubUserData.get" and set $scope.name to returned value', function(){
        $rootScope.$digest();
        expect($scope.name).toBe('TestUser');
      });

    });

    describe('Key bindings', function(){
      var $rootScope, $scope, controller, stateSpy, hotkeys, fakeEvent;

      beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        var $state = $injector.get('$state');
        var $q = $injector.get('$q');
        stateSpy = spyOn($state, 'go');
        hotkeys = $injector.get('hotkeys');

        var $controller = $injector.get('$controller');
        controller = $controller('menuDirectiveController', {
          '$scope': $scope,
          '$state': $state,
          'hotkeys': hotkeys,
          'authenticated': {get: function(){
            return true;
          }},
          'collectComments': function(){},
          'githubUserData': {
            get: function(){
              var defer = $q.defer();
              defer.resolve({name: 'TestUser'});
              return defer.promise;
            }
          }
        });

        fakeEvent = {
          target: {
            nodeName: 'FakeNode',
            className: 'FakeClass'
          },
          preventDefault: jasmine.createSpy()
        };
      }));

      it('Should bind "g f" combo and call state.go("listFilter")', function(){
        var combo = hotkeys.get('g f');
        var comboCallback = combo.callback;
        comboCallback(fakeEvent);

        expect(combo).toBeDefined();
        expect(combo.description).toBe('Go to filter list');
        expect(comboCallback).toEqual(jasmine.any(Function));
        expect(stateSpy).toHaveBeenCalledWith('listFilter');
        expect(fakeEvent.preventDefault).toHaveBeenCalled();
      });

      it('Should bind "g m" combo and call state.go("modules")', function(){
        var combo = hotkeys.get('g m');
        var comboCallback = combo.callback;
        comboCallback(fakeEvent);

        expect(combo).toBeDefined();
        expect(combo.description).toBe('Go to module search');
        expect(comboCallback).toEqual(jasmine.any(Function));
        expect(stateSpy).toHaveBeenCalledWith('modules');
        expect(fakeEvent.preventDefault).toHaveBeenCalled();
      });

      it('Should bind "g w" combo and call state.go("whoami")', function(){
        var combo = hotkeys.get('g w');
        var comboCallback = combo.callback;
        comboCallback(fakeEvent);

        expect(combo).toBeDefined();
        expect(combo.description).toBe('Go to "Who Am I" page');
        expect(comboCallback).toEqual(jasmine.any(Function));
        expect(stateSpy).toHaveBeenCalledWith('whoami');
        expect(fakeEvent.preventDefault).toHaveBeenCalled();
      });

      it('Should bind ": q" combo and call state.go("logout")', function(){
        var combo = hotkeys.get(': q');
        var comboCallback = combo.callback;
        comboCallback(fakeEvent);

        expect(combo).toBeDefined();
        expect(combo.description).toBe('Logout');
        expect(comboCallback).toEqual(jasmine.any(Function));
        expect(stateSpy).toHaveBeenCalledWith('logout');
        expect(fakeEvent.preventDefault).toHaveBeenCalled();
      });
    });
  });
});
