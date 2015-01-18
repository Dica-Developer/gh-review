(function () {
  'use strict';

  describe('Controller: LoginController', function () {

    beforeEach(module('GHReview'));

    it('Should set window.location.href to correct value', inject(function ($injector) {
      var $windowSpy = {location: {href: null}};
      var $rootScope = $injector.get('$rootScope');
      var $scope = $rootScope.$new();
      var $controller = $injector.get('$controller');
      $controller('LoginController', {
        '$scope': $scope,
        '$window': $windowSpy
      });
      expect($windowSpy.location.href).toBe('https://github.com/login/oauth/authorize?client_id=5082108e53d762d90c00&redirect_uri=http://localhost:9000/oauth/&scope=user, repo');
    }));
  });

}());
