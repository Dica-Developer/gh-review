/*global inject*/
describe('Directive: commit-list', function () {
  'use strict';

  beforeEach(angular.mock.module('GHReview'));
  beforeEach(angular.mock.module('commitMockModule'));
  beforeEach(angular.mock.module('app/directives/commit-list/commit-list.html'));
  beforeEach(module('app/welcome/welcome.html'));

  var $rootScope, $scope, $controller, $q, $location, commits, commentCollector, filter;

  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $controller = $injector.get('$controller');
    $q = $injector.get('$q');
    $location = $injector.get('$location');
    commits = $injector.get('commits');
    commentCollector = $injector.get('commentCollector');

    var filterProvider = $injector.get('filterProvider');
    filter = filterProvider.getNew();
  }));

  it('Should call commentCollector.getCommitApproved on init', function () {
    spyOn(commentCollector, 'getCommitApproved').and.returnValue($q.reject());
    $controller('commitListDirectiveController', {
      $scope: $scope
    });
    expect(commentCollector.getCommitApproved).toHaveBeenCalled();
  });

  it('Should set $scope.sortedCommits', function () {
    spyOn(commentCollector, 'getCommitApproved').and.returnValue($q.reject());
    spyOn($location, 'hash').and.returnValue($q.reject());
    expect($scope.sortedCommits).not.toBeDefined();
    $controller('commitListDirectiveController', {
      $scope: $scope
    });
    $scope.commits = commits;
    $rootScope.$apply();
    expect($scope.sortedCommits).toBeDefined();
  });

  it('$scope.commitApproved should return true', function () {
    spyOn(commentCollector, 'getCommitApproved').and.returnValue($q.when({'7e3cc043458366a4205621bc2c006bafd6f6c4db': true}));
    $controller('commitListDirectiveController', {
      $scope: $scope
    });
    $rootScope.$apply();
    expect($scope.commitApproved('7e3cc043458366a4205621bc2c006bafd6f6c4db')).toBe(true);
  });

  it('$scope.commitApproved should return false', function () {
    spyOn(commentCollector, 'getCommitApproved').and.returnValue($q.when({'7e3cc043458366a4205621bc2c006bafd6f6c4db': true}));
    $controller('commitListDirectiveController', {
      $scope: $scope
    });
    $rootScope.$apply();
    expect($scope.commitApproved('10b2a797c7ff0f4d477439da88b2e8f45604e0e7')).toBe(false);
  });


  /**
   * sorted commit order by commit date time descending
   * '7e3cc043458366a4205621bc2c006bafd6f6c4db', '10b2a797c7ff0f4d477439da88b2e8f45604e0e7', 'b8ce653175caa3b397bc4618eb952a41b4e648c1'
   */
  describe('Key bindings', function () {
    var $state, hotkeys, fakeEvent;

    beforeEach(inject(function ($injector) {
      $state = $injector.get('$state');
      hotkeys = $injector.get('hotkeys');

      spyOn(commentCollector, 'getCommitApproved').and.returnValue($q.reject());

      fakeEvent = {
        target: {
          nodeName: 'FakeNode',
          className: 'FakeClass'
        },
        preventDefault: jasmine.createSpy()
      };
    }));

    it('Should bind "down" combo and call $location.hash', function () {
      spyOn($location, 'hash');
      $controller('commitListDirectiveController', {
        $scope: $scope,
        hotkeys: hotkeys
      });
      $scope.commits = commits;
      $rootScope.$apply();

      var combo = hotkeys.get('down');
      var comboCallback = combo.callback;
      comboCallback(fakeEvent);

      expect(combo).toBeDefined();
      expect(combo.description).toBe('Navigate through commits');
      expect(comboCallback).toEqual(jasmine.any(Function));
      expect($scope.selectedCommit).toBe('7e3cc043458366a4205621bc2c006bafd6f6c4db');
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
    });

    it('Should bind "down" combo and don\'t call $location.hash if it is the last commit in list', function () {
      spyOn($location, 'hash').and.returnValue('b8ce653175caa3b397bc4618eb952a41b4e648c1');
      $controller('commitListDirectiveController', {
        $scope: $scope,
        hotkeys: hotkeys
      });
      $scope.commits = commits;
      $rootScope.$apply();

      var combo = hotkeys.get('down');
      var comboCallback = combo.callback;
      comboCallback(fakeEvent);

      expect(combo).toBeDefined();
      expect(combo.description).toBe('Navigate through commits');
      expect(comboCallback).toEqual(jasmine.any(Function));
      expect($scope.selectedCommit).toBe('b8ce653175caa3b397bc4618eb952a41b4e648c1');
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
    });

    it('Should bind "up" combo and call $location.hash', function () {
      spyOn($location, 'hash').and.returnValue('10b2a797c7ff0f4d477439da88b2e8f45604e0e7');
      $controller('commitListDirectiveController', {
        $scope: $scope,
        hotkeys: hotkeys
      });
      $scope.commits = commits;
      $rootScope.$apply();

      var combo = hotkeys.get('up');
      var comboCallback = combo.callback;
      comboCallback(fakeEvent);

      expect(combo).toBeDefined();
      expect(combo.description).toBe('Navigate through commits');
      expect(comboCallback).toEqual(jasmine.any(Function));
      expect($scope.selectedCommit).toBe('7e3cc043458366a4205621bc2c006bafd6f6c4db');
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
    });

    it('Should bind "up" combo and don\'t call $location.hash if it is the first commit in list', function () {
      spyOn($location, 'hash').and.returnValue('7e3cc043458366a4205621bc2c006bafd6f6c4db');
      $controller('commitListDirectiveController', {
        $scope: $scope,
        hotkeys: hotkeys
      });
      $scope.commits = commits;
      $rootScope.$apply();

      var combo = hotkeys.get('up');
      var comboCallback = combo.callback;
      comboCallback(fakeEvent);

      expect(combo).toBeDefined();
      expect(combo.description).toBe('Navigate through commits');
      expect(comboCallback).toEqual(jasmine.any(Function));
      expect($scope.selectedCommit).toBe('7e3cc043458366a4205621bc2c006bafd6f6c4db');
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
    });

    it('Should bind "enter" combo but do nothing if no commit is selected', function () {
      spyOn($location, 'hash');
      $controller('commitListDirectiveController', {
        $scope: $scope,
        hotkeys: hotkeys
      });
      $scope.commits = commits;
      $rootScope.$apply();

      var stateSpy = spyOn($state, 'go');
      var combo = hotkeys.get('enter');
      var comboCallback = combo.callback;
      comboCallback(fakeEvent);

      expect(combo).toBeDefined();
      expect(combo.description).toBe('Navigate through commits');
      expect(comboCallback).toEqual(jasmine.any(Function));
      expect(stateSpy).not.toHaveBeenCalled();
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
    });

    it('Should bind "enter" combo navigate to selected commit', function () {
      filter.setOwner('TestOwner');
      filter.setRepo('TestRepo');
      spyOn($location, 'hash').and.returnValue('7e3cc043458366a4205621bc2c006bafd6f6c4db');
      $controller('commitListDirectiveController', {
        $scope: $scope,
        hotkeys: hotkeys
      });
      $scope.commits = commits;
      $scope.filter = filter;
      $rootScope.$apply();

      var stateSpy = spyOn($state, 'go');
      var combo = hotkeys.get('enter');
      var comboCallback = combo.callback;
      comboCallback(fakeEvent);

      expect(combo).toBeDefined();
      expect(combo.description).toBe('Navigate through commits');
      expect(comboCallback).toEqual(jasmine.any(Function));
      expect(stateSpy.calls.mostRecent().args[0]).toBe('commitBySha');
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
    });

    it('Should bind "left" combo and call $scope.getPreviousPage', function () {
      $controller('commitListDirectiveController', {
        $scope: $scope,
        hotkeys: hotkeys
      });
      $scope.commits = commits;
      $scope.filter = filter;
      $rootScope.$apply();

      filter.hasPreviousPage = true;
      $scope.getPreviousPage = jasmine.createSpy();

      var combo = hotkeys.get('left');
      var comboCallback = combo.callback;
      comboCallback(fakeEvent);

      expect(combo).toBeDefined();
      expect(combo.description).toBe('Previous page');
      expect(comboCallback).toEqual(jasmine.any(Function));
      expect($scope.getPreviousPage).toHaveBeenCalled();
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
    });

    it('Should bind "left" combo and don\'t call $scope.getPreviousPage if there is no previous page', function () {
      $controller('commitListDirectiveController', {
        $scope: $scope,
        hotkeys: hotkeys
      });
      $scope.commits = commits;
      $scope.filter = filter;
      $rootScope.$apply();

      filter.hasPreviousPage = false;
      $scope.getPreviousPage = jasmine.createSpy();

      var combo = hotkeys.get('left');
      var comboCallback = combo.callback;
      comboCallback(fakeEvent);

      expect(combo).toBeDefined();
      expect(combo.description).toBe('Previous page');
      expect(comboCallback).toEqual(jasmine.any(Function));
      expect($scope.getPreviousPage).not.toHaveBeenCalled();
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
    });

    it('Should bind "right" combo and call $scope.getNextPage', function () {
      $controller('commitListDirectiveController', {
        $scope: $scope,
        hotkeys: hotkeys
      });
      $scope.commits = commits;
      $scope.filter = filter;
      $rootScope.$apply();

      filter.hasNextPage = true;
      $scope.getNextPage = jasmine.createSpy();

      var combo = hotkeys.get('right');
      var comboCallback = combo.callback;
      comboCallback(fakeEvent);

      expect(combo).toBeDefined();
      expect(combo.description).toBe('Next page');
      expect(comboCallback).toEqual(jasmine.any(Function));
      expect($scope.getNextPage).toHaveBeenCalled();
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
    });

    it('Should bind "right" combo and don\'t call $scope.getNextPage if there is no next page', function () {
      $controller('commitListDirectiveController', {
        $scope: $scope,
        hotkeys: hotkeys
      });
      $scope.commits = commits;
      $scope.filter = filter;
      $rootScope.$apply();

      filter.hasNextPage = false;
      $scope.getNextPage = jasmine.createSpy();

      var combo = hotkeys.get('right');
      var comboCallback = combo.callback;
      comboCallback(fakeEvent);

      expect(combo).toBeDefined();
      expect(combo.description).toBe('Next page');
      expect(comboCallback).toEqual(jasmine.any(Function));
      expect($scope.getNextPage).not.toHaveBeenCalled();
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
    });
  });
});