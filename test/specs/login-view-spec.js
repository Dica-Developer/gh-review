/*global define, describe, it, expect, spyOn*/
define(['app', 'LoginView'], function(app, LoginView){
  'use strict';

  describe('#LoginView', function(){

    it('Should be defined', function(){
      expect(LoginView).toBeDefined();
    });

    it('.initialize should call .render', function(){
      var renderSpy = spyOn(LoginView.prototype, 'render');
      new LoginView();
      expect(renderSpy).toHaveBeenCalled();
    });

    it('.render should call router.navigate', function(){
      var renderSpy = spyOn(LoginView.prototype, 'render');
      new LoginView();
      expect(renderSpy).toHaveBeenCalled();
    });

  });

});
