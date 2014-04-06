/*global define, describe, it, expect, spyOn*/
define(['ModulesOverview', 'Search'], function(ModulesOverview, Search){
  'use strict';

  describe('ModulesOverview', function(){

    it('Should be defined', function(){
      expect(ModulesOverview).toBeDefined();
    });

    it('.render should call new Search', function(){
      var searchInitSpy = spyOn(Search.prototype, 'initialize');
      var modulesOverview = new ModulesOverview();
      modulesOverview.render();
      expect(searchInitSpy).toHaveBeenCalled();
    });

    it('.render should call Search.render', function(){
      var searchRenderSpy = spyOn(Search.prototype, 'render');
      var modulesOverview = new ModulesOverview();
      modulesOverview.render();
      expect(searchRenderSpy).toHaveBeenCalled();
    });

  });

});
