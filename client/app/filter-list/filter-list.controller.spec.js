(function () {
  'use strict';

  describe('Controller: FilterListController', function () {
    var $rootScope, $scope, $controller, $state, _, importExport, events,
      filterOptions = [
        {'repo':'a','user':'b','sha':'c','since':{'pattern':'weeks','amount':2},'until':{},'path':'','authors':[],'meta':{'isSaved':true,'lastEdited':1412547650986,'customFilter':{'excludeOwnCommits':false,'state':'approved', 'id':'a'}}},
        {'repo':'a','user':'c','sha':'b','since':{'pattern':'weeks','amount':2},'until':{},'path':'','authors':[],'meta':{'isSaved':true,'lastEdited':1412547650986,'customFilter':{'excludeOwnCommits':false,'state':'unseen', 'id':'b'}}},
        {'repo':'b','user':'c','sha':'a','since':{'pattern':'weeks','amount':2},'until':{},'path':'','authors':[],'meta':{'isSaved':true,'lastEdited':1412547650986,'customFilter':{'excludeOwnCommits':false,'state':'reviewed', 'id':'c'}}},
        {'repo':'b','user':'a','sha':'c','since':{'pattern':'weeks','amount':2},'until':{},'path':'','authors':[],'meta':{'isSaved':true,'lastEdited':1412547650986,'customFilter':{'excludeOwnCommits':false,'state':null, 'id':'d'}}},
        {'repo':'c','user':'a','sha':'b','since':{'pattern':'weeks','amount':2},'until':{},'path':'','authors':[],'meta':{'isSaved':true,'lastEdited':1412547650986,'customFilter':{'excludeOwnCommits':false,'state':'approved', 'id':'e'}}},
        {'repo':'c','user':'b','sha':'a','since':{'pattern':'weeks','amount':2},'until':{},'path':'','authors':[],'meta':{'isSaved':true,'lastEdited':1412547650986,'customFilter':{'excludeOwnCommits':false,'state':'reviewed', 'id':'f'}}}
      ];


    beforeEach(module('GHReview'));

    beforeEach(inject(function($injector){
      localStorage.setItem('ghreview.accessToken', 'a3109910c7c197a729d6bcf5935a7badfe19f825');
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $state = $injector.get('$state');
      $controller = $injector.get('$controller');
      _ = $injector.get('_');
      importExport = $injector.get('importExport');
      events = $injector.get('events');
      spyOn(events, 'getAll');
    }));

    afterEach(function(){
      localStorage.clear();
    });

    describe('grouping list', function(){
      var filterList, userPref, filter, $log;

      beforeEach(inject(function($injector){
        userPref = $injector.get('userPref');
        filter = $injector.get('filter');
        $log = $injector.get('$log');
        filterList = _.map(filterOptions, filter.getNewFromSettings, filter);
        spyOn(filter, 'getAll').and.returnValue(filterList);
      }));

      it('Should set grouping option to stored value', function(){
        spyOn(userPref, 'getFilterList').and.returnValue({
          grouping: 'owner'
        });
        $controller('FilterListController', {
          '$scope': $scope
        });
        expect($scope.selectedGrouping.value).toBe('owner');
      });

      describe('grouping', function(){
        var controller;
        beforeEach(function(){
          controller = $controller('FilterListController', {
            '$scope': $scope
          });
        });

        it('Should group filter by "repo"', function(){
          $scope.selectedGrouping = $scope.groupingOptions[0];
          $rootScope.$digest();
          expect($scope.filterList.length).toBe(3);
          expect($scope.filterList[0][0].getRepo()).toBe('c');
          expect($scope.filterList[0][1].getRepo()).toBe('c');

          expect($scope.filterList[1][0].getRepo()).toBe('b');
          expect($scope.filterList[1][1].getRepo()).toBe('b');

          expect($scope.filterList[2][0].getRepo()).toBe('a');
          expect($scope.filterList[2][1].getRepo()).toBe('a');
        });

        it('Should group filter by "state"', function(){
          $scope.selectedGrouping = $scope.groupingOptions[1];
          $rootScope.$digest();
          expect($scope.filterList.length).toBe(4);

          expect($scope.filterList[0][0].getState()).toBe('reviewed');
          expect($scope.filterList[0][1].getState()).toBe('reviewed');

          expect($scope.filterList[1][0].getState()).toBe('approved');
          expect($scope.filterList[1][1].getState()).toBe('approved');

          expect($scope.filterList[2][0].getState()).toBeNull();

          expect($scope.filterList[3][0].getState()).toBe('unseen');
        });

        it('Should group filter by "owner"', function(){
          $scope.selectedGrouping = $scope.groupingOptions[2];
          $rootScope.$digest();
          expect($scope.filterList.length).toBe(3);
          expect($scope.filterList[0][0].getOwner()).toBe('a');
          expect($scope.filterList[0][1].getOwner()).toBe('a');

          expect($scope.filterList[1][0].getOwner()).toBe('c');
          expect($scope.filterList[1][1].getOwner()).toBe('c');

          expect($scope.filterList[2][0].getOwner()).toBe('b');
          expect($scope.filterList[2][1].getOwner()).toBe('b');
        });

        it('Should log error if provided value is unexpected and set grouping to "repo"', function(){
          spyOn($log, 'error');
          $scope.groupingOptions.push({
            value: 'unexpected',
            label: 'unexpected'
          });
          $scope.selectedGrouping = $scope.groupingOptions[3];
          $rootScope.$digest();

          expect($log.error).toHaveBeenCalledWith('Value for filter group unknown: unexpected');

          expect($scope.filterList.length).toBe(3);
          expect($scope.filterList[0][0].getRepo()).toBe('c');
          expect($scope.filterList[0][1].getRepo()).toBe('c');

          expect($scope.filterList[1][0].getRepo()).toBe('b');
          expect($scope.filterList[1][1].getRepo()).toBe('b');

          expect($scope.filterList[2][0].getRepo()).toBe('a');
          expect($scope.filterList[2][1].getRepo()).toBe('a');
        });
      });

    });

    describe('with filter', function(){
      var controller;
      beforeEach(function () {
        localStorage.setItem('ghreview.filter', 'e0a35c44-1066-9a60-22f2-86bd825bc70c,2d3e5719-fc16-b69e-4a27-1cb2521fbeba');
        localStorage.setItem('ghreview.filter-2d3e5719-fc16-b69e-4a27-1cb2521fbeba', '{"repo":"gh-review","user":"Dica-Developer","sha":"master","since":{"pattern":"weeks","amount":2},"until":{},"path":"","authors":[],"meta":{"isSaved":true,"lastEdited":1412547650986,"customFilter":{"excludeOwnCommits":false,"state":null},"id":"2d3e5719-fc16-b69e-4a27-1cb2521fbeba"}}');
        localStorage.setItem('ghreview.filter-e0a35c44-1066-9a60-22f2-86bd825bc70c', '{"sha":"master","customFilter":{},"repo":"forTestUseOnly","user":"jwebertest","since":"2014-04-14T16:41:48.746Z","meta":{"isSaved":true,"lastEdited":1412547650986,"customFilter":{"excludeOwnCommits":false,"state":null},"id":"e0a35c44-1066-9a60-22f2-86bd825bc70c"}}');
        controller = $controller('FilterListController', {
          '$scope': $scope
        });
      });

      it('Should be defined', function () {
        expect(controller).toBeDefined();
      });

      it('There should be 2 filter in the list', function () {
        expect($scope.filterList.length).toBe(2);
      });

      describe('.removeFilter', function(){

        it('should delete filter with given id from localStorage', function () {
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

        it('should call preventDefault if event is given', function () {
          var event = {
            preventDefault: jasmine.createSpy()
          };
          $scope.removeFilter('bla', event);
          expect(event.preventDefault).toHaveBeenCalled();
        });

      });

      describe('.editFilter', function(){

        it('should call $state.go', function () {
          spyOn($state, 'go');
          $scope.editFilter('filterId', void 0);
          expect($state.go).toHaveBeenCalledWith('editFilter', {
            filterId: 'filterId'
          });
        });

        it('should call preventDefault and stopImmediatePropagation event is given', function () {
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

      describe('.export', function(){

        it('Should call importExport.exportFilter', function(){
          spyOn(importExport, 'exportFilter');
          $scope.exportFilter();
          expect(importExport.exportFilter).toHaveBeenCalled();
          expect(importExport.exportFilter.calls.argsFor(0).length).toBe(2);
          expect(importExport.exportFilter.calls.argsFor(0)[0]).toBe($scope.exportName);
        });

      });
    });

    describe('without filter', function(){

      it('should redirect to addFilter if no filter exists', function(){
        spyOn($state, 'go');
        $controller('FilterListController', {
          '$scope': $scope
        });
        expect($state.go).toHaveBeenCalledWith('addFilter');
      });
    });
  });
}());
