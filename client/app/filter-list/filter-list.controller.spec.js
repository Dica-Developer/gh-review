(function () {
  'use strict';

  describe('Controller: FilterListController', function () {
    var $rootScope, $scope, $controller, $state;

    beforeEach(module('GHReview'));
    beforeEach(module('eventsMock'));
    beforeEach(module('contributorCollectorMock'));
    beforeEach(module('branchCollectorMock'));
    beforeEach(module('treeCollectorMock'));

    beforeEach(inject(function($injector){
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $state = $injector.get('$state');
      $controller = $injector.get('$controller');
    }));

    describe('with filter', function(){
      var controller;
      beforeEach(function () {
        localStorage.setItem('ghreview.filter', 'e0a35c44-1066-9a60-22f2-86bd825bc70c,2d3e5719-fc16-b69e-4a27-1cb2521fbeba');
        localStorage.setItem('ghreview.filter-2d3e5719-fc16-b69e-4a27-1cb2521fbeba', '{"sha":"master","customFilter":{"state":"reviewed"},"repo":"gh-review","user":"Dica-Developer","since":"2012-05-13T18:21:29.919Z","id":"2d3e5719-fc16-b69e-4a27-1cb2521fbebf"}');
        localStorage.setItem('ghreview.filter-e0a35c44-1066-9a60-22f2-86bd825bc70c', '{"sha":"master","customFilter":{},"repo":"forTestUseOnly","user":"jwebertest","since":"2014-04-14T16:41:48.746Z","id":"e0a35c44-1066-9a60-22f2-86bd825bc70c"}');
        localStorage.setItem('ghreview.accessToken', 'test-to-ken');
        controller = $controller('FilterListController', {
          '$scope': $scope
        });
      });

      afterEach(function () {
        localStorage.clear();
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
