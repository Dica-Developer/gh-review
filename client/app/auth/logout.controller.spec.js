(function () {
  'use strict';

  describe('Controller: LogoutController', function () {
    var $controller, $state;
    $state = {go: jasmine.createSpy()};

    beforeEach(module('GHReview'));

    beforeEach(inject(function ($injector) {
      localStorage.setItem('ghreview.accessToken', '6867f021346fd59d3df8972b186c5ded726ad4da');
      $controller = $injector.get('$controller');
    }));

    afterEach(function () {
      localStorage.clear();
    });

    it('Should remove access token from local storage and change call $state.go', function () {
      expect(localStorage.getItem('ghreview.accessToken')).toBe('6867f021346fd59d3df8972b186c5ded726ad4da');
      var LogoutController = $controller('LogoutController', {
        $state: $state
      });
      expect(LogoutController).toBeDefined();
      expect($state.go).toHaveBeenCalled();
      expect(localStorage.getItem('ghreview.accessToken')).toBeNull();
    });
  });

}());
