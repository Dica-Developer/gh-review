describe('Service: repoCollector', function () {
  'use strict';

  var Modal, $rootScope, filter;

  beforeEach(module('GHReview'));
  beforeEach(module('components/modal/select-filter-to-import.html'));
  beforeEach(module('app/directives/formatted-date/formatted-date.html'));


  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    Modal = $injector.get('Modal');
    filter = $injector.get('filter');
  }));

  it('Should be defined', function () {
    expect(Modal).toBeDefined();
  });

  describe('.selectFilterToImport', function () {

    it('Should return function to open modal', function(){
      var modal = Modal.selectFilterToImport();
      expect(modal).toEqual(jasmine.any(Function));
    });

  });

});