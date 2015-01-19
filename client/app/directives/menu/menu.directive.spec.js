describe('Directive: menu', function () {
  'use strict';

  beforeEach(module('GHReview'));
  beforeEach(module('app/directives/menu/menu.html'));

  var $compile, $rootScope, $q;

  beforeEach(inject(function ($injector) {
    var commentCollector = $injector.get('commentCollector');
    spyOn(commentCollector, 'init');
    spyOn(commentCollector, 'announceRepositories');

    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    $q = $injector.get('$q');
  }));

  afterEach(function () {
    localStorage.clear();
  });

  describe('not authenticated', function(){
    var gh;
    beforeEach(inject(function ($injector) {
      gh = $injector.get('github');
    }));
    it('Should render menu without user data', function () {
      var element = $compile('<div class="collapse navbar-collapse" id="ghr-top-menu" menu></div>')($rootScope);
      $rootScope.$digest();
      expect(element.find('a').text()).toBe('Sign in with Github');
    });
  });

  describe('Authenticated', function(){
    var gh;
    beforeEach(inject(function ($injector) {
      localStorage.setItem('ghreview.accessToken', '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
      gh = $injector.get('github');
      spyOn(gh.user, 'get');
    }));

    it('Should call github.user.get', function () {
      $compile('<div class="collapse navbar-collapse" id="ghr-top-menu" menu></div>')($rootScope);
      $rootScope.$digest();
      expect(gh.user.get).toHaveBeenCalled();
    });

    it('Should render authenticated menu', function () {
      var element = $compile('<div class="collapse navbar-collapse" id="ghr-top-menu" menu></div>')($rootScope);
      $rootScope.$digest();
      expect(angular.element(element.querySelectorAll('#userMenu')).find('li').length).toBe(8);
    });
  });
});