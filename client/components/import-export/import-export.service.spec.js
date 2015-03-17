describe('Service: github', function () {
  'use strict';

  beforeEach(module('GHReview'));
  beforeEach(module('EventsMock'));

  var importExport, filter, $rootScope;

  beforeEach(inject(function ($injector) {
    importExport = $injector.get('importExport');
    filter = $injector.get('filter');
    $rootScope = $injector.get('$rootScope');
  }));

  describe('.exportFilter', function(){

    it('Should call window.saveAs with correct parameter', function () {
      var filterToExport = filter.getNew();
      spyOn(window, 'saveAs');
      importExport.exportFilter('exportname.ext', filterToExport.options);
      expect(window.saveAs).toHaveBeenCalled();
      var fileName = window.saveAs.calls.argsFor(0)[1];
      var fileBlob = window.saveAs.calls.argsFor(0)[0];
      expect(fileName).toBe('exportname.ext');
      expect(fileBlob instanceof Blob).toBe(true);
      expect(fileBlob.type).toBe('application/json;charset=utf-8');
    });

  });

  describe('.importFilter', function(){

    it('Should resolve with list of filter options', function (done) {
      var filterToExport = filter.getNew();
      spyOn(window, 'saveAs');
      importExport.exportFilter('exportname.ext', [filterToExport.options]);
      var fileBlob = window.saveAs.calls.argsFor(0)[0];

      importExport.importFilter(fileBlob)
        .then(function(listOfFilterOptions){
          expect(listOfFilterOptions).toBeDefined();
          expect(listOfFilterOptions.length).toBeGreaterThan(0);
          expect(listOfFilterOptions[0].meta.id).toBe(filterToExport.getId());
          done();
        });

      //necessary because of the promise chain
      window.setTimeout(function(){
        $rootScope.$apply();
      }, 100);
    });

    it('Should reject with proper error if file is not a valid json', function (done) {
      var fileBlob = new Blob(['[}]'], {type: 'application/json;charset=utf-8'});

      importExport.importFilter(fileBlob)
        .then(null, function(error){
          expect(error).toBeDefined();
          done();
        });

      //necessary because of the promise chain
      window.setTimeout(function(){
        $rootScope.$apply();
      }, 100);
    });

  });

});