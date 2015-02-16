/*global inject*/
describe('Service: userPref', function () {
  'use strict';


  beforeEach(module('GHReview'));

  afterEach(function(){
    localStorage.clear();
  });

  describe('Without something stored', function(){
    var userPref;

    beforeEach(inject(function ($injector) {
      userPref = $injector.get('userPref');
    }));

    it('Should return empty object', function(){
      expect(userPref.getAll()).toEqual({});
    });

    describe('FilterList', function(){

      it('Should return null', function(){
        var filterListPreferences = userPref.getFilterList();
        expect(filterListPreferences).toBeNull();
        filterListPreferences = userPref.getFilterList('notExist');
        expect(filterListPreferences).toBeNull();
      });

      it('Should save new property to local storage', function(){
        var localStore = localStorage.getItem('ghreview.preferences');
        expect(localStore).toBeNull();
        userPref.setFilterList('testKey', 'testValue');
        localStore = localStorage.getItem('ghreview.preferences');
        localStore = JSON.parse(localStore);
        expect(localStore).not.toBeNull();
        expect(localStore.filterList).not.toBeNull();
        expect(localStore.filterList.testKey).toBe('testValue');
      });

    });

    describe('FileView', function(){

      it('Should return null', function(){
        var fileViewPreferences = userPref.getFileView();
        expect(fileViewPreferences).toBeNull();
        fileViewPreferences = userPref.getFileView('notExist');
        expect(fileViewPreferences).toBeNull();
      });

      it('Should save new property to local storage', function(){
        var localStore = localStorage.getItem('ghreview.preferences');
        expect(localStore).toBeNull();
        userPref.setFileView('testKey', 'testValue');
        localStore = localStorage.getItem('ghreview.preferences');
        localStore = JSON.parse(localStore);
        expect(localStore).not.toBeNull();
        expect(localStore.fileView).not.toBeNull();
        expect(localStore.fileView.testKey).toBe('testValue');
      });

    });

  });

  describe('With existing preferences', function(){

    var userPref;

    beforeEach(inject(function ($injector) {
      localStorage.setItem('ghreview.preferences', '{"filterList":{"grouping":"owner"},"fileView":{"highlightTheme":"solarized-light"}}');
      userPref = $injector.get('userPref');
    }));

    it('Should return all preferences', function(){
      var allPreferences = userPref.getAll();
      expect(allPreferences).toBeDefined();
      expect(allPreferences.filterList).toBeDefined();
      expect(allPreferences.fileView).toBeDefined();
    });

    describe('FilterList', function(){

      it('Should return all filter list preferences', function(){
        var filterListPreferences = userPref.getFilterList();
        expect(filterListPreferences).not.toBeNull();
      });

      it('Should return "owner"', function(){
        var filterListPreferences = userPref.getFilterList('grouping');
        expect(filterListPreferences).toBe('owner');
      });

      it('Should save changed property to local storage', function(){
        var localStore = localStorage.getItem('ghreview.preferences');
        localStore = JSON.parse(localStore);
        expect(localStore).not.toBeNull();
        expect(localStore.filterList).not.toBeNull();
        expect(localStore.filterList.grouping).toBe('owner');

        userPref.setFilterList('grouping', 'testValue');

        localStore = localStorage.getItem('ghreview.preferences');
        localStore = JSON.parse(localStore);
        expect(localStore).not.toBeNull();
        expect(localStore.filterList).not.toBeNull();
        expect(localStore.filterList.grouping).toBe('testValue');
      });

    });

    describe('FileView', function(){

      it('Should return all file view preferences', function(){
        var fileViewPreferences = userPref.getFileView();
        expect(fileViewPreferences).not.toBeNull();
      });

      it('Should return "solarized-light"', function(){
        var fileViewPreferences = userPref.getFileView('highlightTheme');
        expect(fileViewPreferences).toBe('solarized-light');
      });

      it('Should save changed property to local storage', function(){
        var localStore = localStorage.getItem('ghreview.preferences');
        localStore = JSON.parse(localStore);
        expect(localStore).not.toBeNull();
        expect(localStore.fileView).not.toBeNull();
        expect(localStore.fileView.highlightTheme).toBe('solarized-light');

        userPref.setFileView('highlightTheme', 'testValue');

        localStore = localStorage.getItem('ghreview.preferences');
        localStore = JSON.parse(localStore);
        expect(localStore).not.toBeNull();
        expect(localStore.fileView).not.toBeNull();
        expect(localStore.fileView.highlightTheme).toBe('testValue');
      });

    });

  });
});