/*global define, describe, it, expect, beforeEach, afterEach*/
define(['jquery', 'WelcomeView'], function($, WelcomeView){
  'use strict';

  describe('#StatisticsView', function(){

    var sandbox, welcomeView;

    beforeEach(function(){
      sandbox = $('<div id="main">');
      sandbox.appendTo('body');
      welcomeView = new WelcomeView();
    });

    afterEach(function(){
      sandbox.remove();
      welcomeView = null;
    });

    it('Should be defined', function(){
      expect(WelcomeView).toBeDefined();
    });

    it('Should append the welcome message to the main div', function(){
      welcomeView.render();

      var h1 = sandbox.find('h1');
      var h3 = sandbox.find('h3');
      var p = sandbox.find('p');

      expect(h1.length).toBe(1);
      expect(h1.text()).toBe('Welcome to gh-review');

      expect(h3.length).toBe(1);
      expect(h3.text()).toBe('You don\'t have setup a filter. Learn How To.');

      expect(p.length).toBe(1);
      expect(p.text()).toBe('Select under Repositories a repository and then use the filter buttons to isolate what you want to review of this repository.');

    });

  });

});