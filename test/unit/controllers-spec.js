/*global inject*/
describe('#Controller', function () {
  'use strict';

  beforeEach(angular.mock.module('GHReview'));
  beforeEach(angular.mock.module('templates'));

  describe('FilterListController', function () {
    var $rootScope, $scope, controller, $state;

    beforeEach(inject(function ($injector) {
      localStorage.setItem('ghreview.filter', 'e0a35c44-1066-9a60-22f2-86bd825bc70c,2d3e5719-fc16-b69e-4a27-1cb2521fbeba');
      localStorage.setItem('ghreview.filter-2d3e5719-fc16-b69e-4a27-1cb2521fbeba', '{"sha":"master","customFilter":{"state":"reviewed"},"repo":"gh-review","user":"Dica-Developer","since":"2012-05-13T18:21:29.919Z","id":"2d3e5719-fc16-b69e-4a27-1cb2521fbebf"}');
      localStorage.setItem('ghreview.filter-e0a35c44-1066-9a60-22f2-86bd825bc70c', '{"sha":"master","customFilter":{},"repo":"forTestUseOnly","user":"jwebertest","since":"2014-04-14T16:41:48.746Z","id":"e0a35c44-1066-9a60-22f2-86bd825bc70c"}');
      localStorage.setItem('ghreview.accessToken', '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $state = $injector.get('$state');

      var $controller = $injector.get('$controller');
      controller = $controller('FilterListController', {
        '$scope': $scope
      });
    }));

    afterEach(function () {
      localStorage.clear();
    });

    it('Should be defined', function () {
      expect(controller).toBeDefined();
    });

    it('There should be 2 filter in the list', function () {
      expect($scope.filterList.length).toBe(2);
    });

    it('.removeFilter should delete filter with given id from localStorage', function () {
      //pre check with 2 filter
      expect($scope.filterList.length).toBe(2);
      var filterList = localStorage.getItem('ghreview.filter').split(',');
      var filter1 = localStorage.getItem('ghreview.filter-' + filterList[0]);
      var filter2 = localStorage.getItem('ghreview.filter-' + filterList[1]);
      expect(filterList.length).toBe(2);
      expect(filter1).not.toBeNull();
      expect(filter2).not.toBeNull();

      //remove filter call
      $scope.removeFilter(filterList[0]);

      //post check with 1 filter left
      expect($scope.filterList.length).toBe(1);
      filter1 = localStorage.getItem('ghreview.filter-' + filterList[0]);
      filter2 = localStorage.getItem('ghreview.filter-' + filterList[1]);
      expect(filter1).toBeNull();
      expect(filter2).not.toBeNull();
      filterList = localStorage.getItem('ghreview.filter').split(',');
      expect(filterList.length).toBe(1);
    });

    it('.removeFilter should call preventDefault if event is given', function () {
      var event = {
        preventDefault: jasmine.createSpy()
      };
      $scope.removeFilter('bla', event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('.editFilter should call $state.go', function () {
      spyOn($state, 'go');
      $scope.editFilter('filterId', void 0);
      expect($state.go).toHaveBeenCalledWith('editFilter', {
        filterId: 'filterId'
      });
    });

    it('.editFilter should call preventDefault and stopImmediatePropagation event is given', function () {
      spyOn($state, 'go');
      var event = {
        preventDefault: jasmine.createSpy(),
        stopImmediatePropagation: jasmine.createSpy()
      };
      $scope.editFilter('filterId', event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopImmediatePropagation).toHaveBeenCalled();
    });
  });

  describe('LogoutController', function () {
    var $controller, $state;
    $state = {go: jasmine.createSpy()};

    beforeEach(inject(function ($injector) {
      localStorage.setItem('ghreview.accessToken', '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
      $controller = $injector.get('$controller');
    }));

    afterEach(function () {
      localStorage.clear();
    });

    it('Should remove access token from local storage and change call $state.go', function () {
      expect(localStorage.getItem('ghreview.accessToken')).toBe('44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
      var LogoutController = $controller('LogoutController', {
        $state: $state
      });
      expect(LogoutController).toBeDefined();
      expect($state.go).toHaveBeenCalled();
      expect(localStorage.getItem('ghreview.accessToken')).toBeNull();
    });
  });

  describe('WhoAmIController', function () {
    var WhoAmIController, $scope, $controller, githubUserDataSpy, githubUserData, github;

    beforeEach(inject(function ($injector) {
      localStorage.setItem('ghreview.accessToken', '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
      githubUserData = $injector.get('githubUserData');
      $controller = $injector.get('$controller');
      github = $injector.get('github');
      var $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
    }));

    afterEach(function () {
      localStorage.clear();
    });

    it('Should be defined', function () {
      githubUserDataSpy = spyOn(githubUserData, 'get').and.returnValue({
        then: function () {
        }
      });
      WhoAmIController = $controller('WhoAmIController', {
        $scope: $scope
      });
      expect(WhoAmIController).toBeDefined();
    });

    it('Should call githubUserData', function () {
      githubUserDataSpy = spyOn(githubUserData, 'get').and.returnValue({
        then: function () {
        }
      });
      WhoAmIController = $controller('WhoAmIController', {
        $scope: $scope
      });
      expect(githubUserDataSpy).toHaveBeenCalled();
    });

    it('Should call github.user.get', function () {
      spyOn(github.user, 'get');
      WhoAmIController = $controller('WhoAmIController', {
        $scope: $scope
      });
      expect(github.user.get).toHaveBeenCalled();
    });

    it('Should apply response of github.user.get to $scope', function () {
      spyOn(github.user, 'get');
      WhoAmIController = $controller('WhoAmIController', {
        $scope: $scope
      });
      var getCallback = github.user.get.calls.argsFor(0)[1];
      getCallback(null, {
        login: 'testUser',
        name: 'testName'
      });
      $scope.$apply();
      expect($scope.userData).toBeDefined();
      expect($scope.userData.login).toBe('testUser');
      expect($scope.userData.name).toBe('testName');
    });

  });

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
