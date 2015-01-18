(function () {
  'use strict';

  describe('Controller: WhoAmI', function () {

    // load the controller's module
    beforeEach(module('GHReview'));

    var WhoAmICtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      WhoAmICtrl = $controller('WhoAmI', {
        $scope: scope
      });
    }));

    it('should ...', function () {
      expect(1).toEqual(1);
    });
  });
}());
