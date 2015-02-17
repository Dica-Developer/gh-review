(function () {
  'use strict';

  describe('Controller: LogoutController', function () {
    var $controller, $state;
    $state = {go: jasmine.createSpy()};

    beforeEach(module('GHReview'));

    beforeEach(inject(function ($injector) {
      localStorage.setItem('ghreview.accessToken', '4a9df10171fe681c56803493d2b736254370559c');
      $controller = $injector.get('$controller');
    }));

    afterEach(function () {
      localStorage.clear();
    });

    it('Should remove access token from local storage and change call $state.go', function () {
      expect(localStorage.getItem('ghreview.accessToken')).toBe('4a9df10171fe681c56803493d2b736254370559c');
      var LogoutController = $controller('LogoutController', {
        $state: $state
      });
      expect(LogoutController).toBeDefined();
      expect($state.go).toHaveBeenCalled();
      expect(localStorage.getItem('ghreview.accessToken')).toBeNull();
    });
  });

}());
