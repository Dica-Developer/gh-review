(function () {
  'use strict';

  describe('Controller: WhoAmIController', function () {

    beforeEach(module('GHReview'));

    var WhoAmIController, $scope, $controller, githubUserDataSpy, ghUser, github;

    beforeEach(inject(function ($injector) {
      localStorage.setItem('ghreview.accessToken', '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
      ghUser = $injector.get('ghUser');
      $controller = $injector.get('$controller');
      github = $injector.get('github');
      var $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
    }));

    afterEach(function () {
      localStorage.clear();
    });

    it('Should be defined', function () {
      githubUserDataSpy = spyOn(ghUser, 'get').and.returnValue({
        then: function () {
        }
      });
      WhoAmIController = $controller('WhoAmIController', {
        $scope: $scope
      });
      expect(WhoAmIController).toBeDefined();
    });

    it('Should call ghUser', function () {
      githubUserDataSpy = spyOn(ghUser, 'get').and.returnValue({
        then: function () {
        }
      });
      WhoAmIController = $controller('WhoAmIController', {
        $scope: $scope
      });
      expect(githubUserDataSpy).toHaveBeenCalled();
    });

    it('Should call github.user.get', function () {
      spyOn(github.user, 'get');
      WhoAmIController = $controller('WhoAmIController', {
        $scope: $scope
      });
      expect(github.user.get).toHaveBeenCalled();
    });

    it('Should apply response of github.user.get to $scope', function () {
      spyOn(github.user, 'get');
      WhoAmIController = $controller('WhoAmIController', {
        $scope: $scope
      });
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
