/*global define, describe, it, expect, spyOn*/
define(['jquery', 'app', 'Search'], function($, app, Search){
  'use strict';

  describe('#Search', function(){
    var sandbox = null, searchTextInput = null, searchApplyButton = null, searchView = null;

    beforeEach(function(){
      sandbox = $('<div id="search">');
      sandbox.appendTo('body');
      searchTextInput = $('<input type="text" id="searchValue" />');
      searchApplyButton = $('<button type="button" id="searchButton"></button>');
      searchTextInput.appendTo(sandbox);
      searchApplyButton.appendTo(sandbox);
      searchView = new Search();
    });

    afterEach(function(){
      sandbox.remove();
      searchView = null;
    });

    it('should be defined', function(){
      expect(Search).toBeDefined();
    });

    xit('click on searchButton should call Search.search', function(done){
      var searchSpy = spyOn(Search.prototype, 'search');
      searchTextInput.val('testString');
      searchApplyButton.trigger('click');
      //It seems the trigger event needs a while to be catched
      //TODO find another solution instead of timeout
      setTimeout(function(){
        expect(searchSpy).toHaveBeenCalled();
        done();
      }, 500);
    });

    it('Search#search should call github api', function(){
      var searchSpy = spyOn(app.github.search, 'code');
      searchTextInput.val('testString');
      searchView.search();
      expect(searchSpy).toHaveBeenCalled();
      expect(app.github.search.code.calls.argsFor(0)[0]).toEqual({q: 'testString'});
    });

    it('Search#callback should call render', function(){
      var renderSpy = spyOn(searchView, 'render');
      searchView.callback();
      expect(renderSpy).toHaveBeenCalled();
    });

    it('Search#render should render properly even without any results', function(){
      searchView.render();
      expect($('#commitList').length).toBe(1);
    });

    it('Search#render should render results', function(){
      var results = {
        items: [
          {
            repository: {
              owner: {
                login: 'a'
              },
              name: 'aPLus'
            },
            path: 'pathToaPlus'
          },
          {
            repository: {
              owner: {
                login: 'b'
              },
              name: 'bPLus'
            },
            path: 'pathTobPlus'
          }
        ]
      };
      searchView.render(results);
      expect($('#commitList').find('a').length).toBe(2);
    });

  });

});
