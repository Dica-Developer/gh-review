describe('Service: filter', function () {
  'use strict';

  var filter, $log;

  beforeEach(module('GHReview'));
  beforeEach(module('eventsMock'));
  beforeEach(module('contributorCollectorMock'));
  beforeEach(module('branchCollectorMock'));
  beforeEach(module('treeCollectorMock'));

  beforeEach(inject(function ($injector) {
    localStorage.setItem('ghreview.filter', 'e0a35c44-1066-9a60-22f2-86bd825bc70c,2d3e5719-fc16-b69e-4a27-1cb2521fbeba');
    localStorage.setItem('ghreview.filter-2d3e5719-fc16-b69e-4a27-1cb2521fbeba', '{"sha":"master","customFilter":{"state":"reviewed"},"repo":"gh-review","user":"Dica-Developer","since":"2012-05-13T18:21:29.919Z","id":"2d3e5719-fc16-b69e-4a27-1cb2521fbebf"}');
    localStorage.setItem('ghreview.filter-e0a35c44-1066-9a60-22f2-86bd825bc70c', '{"sha":"master","customFilter":{},"repo":"forTestUseOnly","user":"jwebertest","since":"2014-04-14T16:41:48.746Z","id":"e0a35c44-1066-9a60-22f2-86bd825bc70c"}');
    filter = $injector.get('filter');
    $log = $injector.get('$log');
  }));

  afterEach(function () {
    localStorage.clear();
  });

  describe('.getAllFilter', function () {
    it('Should return all stored filter', function () {
      var allFilter = filter.getAll();
      expect(allFilter).toBeDefined();
      expect(allFilter.length).toBe(2);
    });

    it('Should return empty array if no filter is stored', function () {
      localStorage.clear();
      var allFilter = filter.getAll();
      expect(allFilter.length).toBe(0);
    });
  });

  describe('.getFilterById', function () {
    it('Should return specific filter', function () {
      var filterById = filter.getById('e0a35c44-1066-9a60-22f2-86bd825bc70c');
      expect(filterById).toBeDefined();
      expect(filterById.getId()).toBe('e0a35c44-1066-9a60-22f2-86bd825bc70c');
    });
  });

  describe('.getCloneOf', function () {
    it('Should return a clone of a given filter', function () {
      var filterById = filter.getById('e0a35c44-1066-9a60-22f2-86bd825bc70c'),
        clonedFilter = filter.getCloneOf(filterById);

      expect(clonedFilter).toBeDefined();
      expect(clonedFilter.options.meta.isClone).toBeDefined();
      expect(clonedFilter.options.meta.originalId).toBe(filterById.options.meta.id);
    });

    it('Should log error if given argument is not an instance of Filter', function () {
      spyOn($log, 'error');
      filter.getCloneOf({});
      expect($log.error).toHaveBeenCalledWith('No Filter');
    });
  });

  describe('.removeFilter', function () {
    it('Should remove specific filter', function () {
      filter.remove('e0a35c44-1066-9a60-22f2-86bd825bc70c');
      var removedFilter = localStorage.getItem('ghreview.filter-e0a35c44-1066-9a60-22f2-86bd825bc70c');
      expect(removedFilter).toBeNull();
    });

    it('Should remove id from filter list', function () {
      var filterList = localStorage.getItem('ghreview.filter').split(',');
      expect(filterList.length).toBe(2);
      filter.remove('e0a35c44-1066-9a60-22f2-86bd825bc70c');
      filterList = localStorage.getItem('ghreview.filter').split(',');
      expect(filterList.length).toBe(1);
    });
  });
});