(function () {
  'use strict';

  describe('Controller: LogoutController', function () {
    var $controller, $state;
    $state = {go: jasmine.createSpy()};

    beforeEach(module('GHReview'));

    beforeEach(inject(function ($injector) {
      localStorage.setItem('ghreview.accessToken', '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
      $controller = $injector.get('$controller');
    }));

    afterEach(function () {
      localStorage.clear();
    });

    it('Should remove access token from local storage and change call $state.go', function () {
      expect(localStorage.getItem('ghreview.accessToken')).toBe('44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
      var LogoutController = $controller('LogoutController', {
        $state: $state
      });
      expect(LogoutController).toBeDefined();
      expect($state.go).toHaveBeenCalled();
      expect(localStorage.getItem('ghreview.accessToken')).toBeNull();
    });
  });

}());
