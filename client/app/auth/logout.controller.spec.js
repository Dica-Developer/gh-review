(function () {
  'use strict';

  describe('Controller: LogoutController', function () {
    var $controller, $state;
    $state = {go: jasmine.createSpy()};

    beforeEach(module('GHReview'));

    beforeEach(inject(function ($injector) {
      localStorage.setItem('ghreview.accessToken', 'a3109910c7c197a729d6bcf5935a7badfe19f825');
      $controller = $injector.get('$controller');
    }));

    afterEach(function () {
      localStorage.clear();
    });

    it('Should remove access token from local storage and change call $state.go', function () {
      expect(localStorage.getItem('ghreview.accessToken')).toBe('a3109910c7c197a729d6bcf5935a7badfe19f825');
      var LogoutController = $controller('LogoutController', {
        $state: $state
      });
      expect(LogoutController).toBeDefined();
      expect($state.go).toHaveBeenCalled();
      expect(localStorage.getItem('ghreview.accessToken')).toBeNull();
    });
  });

}());
