/*global define, describe, it, expect, beforeEach, afterEach*/
define(['jquery', 'WhoAmI', 'UserModel'], function($, WhoAmI, User){
  'use strict';

  describe('#StatisticsView', function(){

    var sandbox, whoamiView;

    beforeEach(function(){
      sandbox = $('<div id="main">');
      sandbox.appendTo('body');
      whoamiView = new WhoAmI({
        model: new User()
      });
    });

    afterEach(function(){
      sandbox.remove();
      whoamiView = null;
    });

    it('Should be defined', function(){
      expect(WhoAmI).toBeDefined();
    });

    it('Should append the welcome message to the main div', function(){
      whoamiView.render();

      var ul = sandbox.find('.list-group');

      expect(ul.length).toBe(1);

    });

  });

});