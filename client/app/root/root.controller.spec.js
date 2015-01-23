describe('Controller: RootController', function () {
  'use strict';

  beforeEach(module('GHReview'));

  describe('RootController', function () {

    it('Should go to state "listFilter" if at least one filter is defined', inject(function ($injector) {
      var state = $injector.get('$state');
      var stateSpy = spyOn(state, 'go');
      var filterSpy = {
        getAll: function () {
          return [1, 2];
        }
      };
      var $rootScope = $injector.get('$rootScope');
      var $scope = $rootScope.$new();
      var $controller = $injector.get('$controller');
      $controller('RootController', {
        '$scope': $scope,
        'filter': filterSpy
      });
      expect(stateSpy).toHaveBeenCalledWith('listFilter');
    }));

    it('Should go to state "addFilter" if no filter is defined', inject(function ($injector) {
      var state = $injector.get('$state');
      var stateSpy = spyOn(state, 'go');
      var filterSpy = {
        getAll: function () {
          return [];
        }
      };
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
});
