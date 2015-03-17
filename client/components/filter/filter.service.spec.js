describe('Service: filter', function () {
  'use strict';

  var filter, $log, $q, filterUtils, Events;

  beforeEach(module('GHReview'));
  beforeEach(module('contributorCollectorMock'));
  beforeEach(module('branchCollectorMock'));
  beforeEach(module('treeCollectorMock'));

  beforeEach(inject(function ($injector) {
    localStorage.setItem('ghreview.filter', 'e0a35c44-1066-9a60-22f2-86bd825bc70c,2d3e5719-fc16-b69e-4a27-1cb2521fbeba');
    localStorage.setItem('ghreview.filter-2d3e5719-fc16-b69e-4a27-1cb2521fbeba', '{"repo":"gh-review","user":"Dica-Developer","sha":"master","since":{"pattern":"weeks","amount":2},"until":{},"path":"","authors":[],"meta":{"isSaved":true,"lastEdited":1412547650986,"customFilter":{"excludeOwnCommits":false,"state":null},"id":"2d3e5719-fc16-b69e-4a27-1cb2521fbeba"}}');
    localStorage.setItem('ghreview.filter-e0a35c44-1066-9a60-22f2-86bd825bc70c', '{"sha":"master","customFilter":{},"repo":"forTestUseOnly","user":"jwebertest","since":"2014-04-14T16:41:48.746Z","meta":{"isSaved":true,"lastEdited":1412547650986,"customFilter":{"excludeOwnCommits":false,"state":null},"id":"e0a35c44-1066-9a60-22f2-86bd825bc70c"}}');
    filter = $injector.get('filter');
    $log = $injector.get('$log');
    $q = $injector.get('$q');
    filterUtils = $injector.get('filterUtils');
    spyOn(filterUtils, 'filterHealthCheck').and.returnValue($q.when());
    Events = $injector.get('Events');

    spyOn(Events.prototype, 'getEvents');
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
  
  describe('.getNewFromSettings', function () {
    var filterSettings = {'sha':'master','customFilter':{},'repo':'forTestUseOnly','user':'jwebertest','since':'2014-04-14T16:41:48.746Z','meta':{'isSaved':true,'lastEdited':1412547650986,'customFilter':{'excludeOwnCommits':false,'state':null},'id':'e0a35c44-1066-9a60-22f2-86bd825bc70c'}};
    
    it('Should remove id and use new if one exists', function () {
      var newFilter = filter.getNewFromSettings(filterSettings);
      expect(newFilter.getId()).not.toBe(filterSettings.meta.id);
      delete newFilter.options.meta.id;
      newFilter = filter.getNewFromSettings(newFilter.options);
      expect(newFilter.getId()).toBeDefined();
    });

  });
});