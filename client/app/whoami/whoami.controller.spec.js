(function () {
  'use strict';

  describe('Controller: WhoAmIController', function () {

    beforeEach(module('GHReview'));

    var whoAmIController, $scope, $controller, ghUser, github;

    beforeEach(inject(function ($injector) {
      localStorage.setItem('ghreview.accessToken', 'test-to-ken');
      ghUser = $injector.get('ghUser');
      $controller = $injector.get('$controller');
      github = $injector.get('github');
      spyOn(github.user, 'get');
      var $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      whoAmIController = $controller('WhoAmIController', {
        $scope: $scope
      });
    }));

    afterEach(function () {
      localStorage.clear();
      github.user.get.calls.reset();
    });

    it('Should be defined', function () {
      expect(whoAmIController).toBeDefined();
    });

    it('Should call ghUser', function () {
      var githubUserDataSpy = spyOn(ghUser, 'get').and.returnValue({
        then: function () {}
      });
      whoAmIController = $controller('WhoAmIController', {
        $scope: $scope
      });
      expect(githubUserDataSpy).toHaveBeenCalled();
    });

    it('Should call github.user.get', function () {
      expect(github.user.get).toHaveBeenCalled();
    });

    it('Should apply response of github.user.get to $scope', function () {
      var getCallback = github.user.get.calls.argsFor(0)[1];
      getCallback(null, {
        login: 'testUser',
        name: 'testName'
      });
      $scope.$apply();
      expect($scope.userData).toBeDefined();
      expect($scope.userData.login).toBe('testUser');
      expect($scope.userData.name).toBe('testName');
    });

  });
}());
