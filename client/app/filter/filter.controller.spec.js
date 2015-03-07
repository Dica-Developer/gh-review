describe('Controller: FilterController', function () {
  'use strict';

  var $rootScope, $scope, $controller, $q, $timeout, Filter, filterService, filterUtils;

  beforeEach(module('GHReview'));
  beforeEach(module('app/welcome/welcome.html'));

  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
    $q = $injector.get('$q');
    $timeout = $injector.get('$timeout');
    Filter = $injector.get('Filter');
    filterService = $injector.get('filter');
    filterUtils = $injector.get('filterUtils');
    spyOn(filterUtils, 'filterHealthCheck').and.returnValue($q.when());
    $scope = $rootScope.$new();
  }));

  it('Should be defined', function () {
    var controller = $controller('FilterController', {
      $scope: $scope,
      repoList: []
    });
    expect(controller).toBeDefined();
  });

  it('Should call filter.getById', function () {
    spyOn(filterService, 'getById').and.returnValue(new Filter());
    $controller('FilterController', {
      $scope: $scope,
      repoList: []
    });
    expect(filterService.getById).toHaveBeenCalled();
  });

  it('Should call filter.getById with given id', function () {
    spyOn(filterService, 'getById').and.returnValue(new Filter());
    $controller('FilterController', {
      $scope: $scope,
      repoList: [],
      $stateParams: {
        filterId: 'filter-id'
      }
    });
    expect(filterService.getById).toHaveBeenCalledWith('filter-id');
  });

  it('Should set $scope.filter', function () {
    var newFilter = new Filter();
    spyOn(filterService, 'getById').and.returnValue(newFilter);
    $controller('FilterController', {
      $scope: $scope,
      repoList: []
    });
    expect($scope.filter).toBe(newFilter);
  });

  it('Should set $scope variable to correct default values', function () {
    var newFilter = new Filter();
    spyOn(filterService, 'getById').and.returnValue(newFilter);
    $controller('FilterController', {
      $scope: $scope,
      repoList: []
    });

    expect($scope.branchList).toEqual([]);
    expect($scope.commits).toEqual([]);
    expect($scope.currentPage).toBe(1);
    expect($scope.availableFilterSincePattern).toEqual(['days', 'weeks', 'years']);
    expect($scope.availableFilterReviewStates).toEqual(['unseen', 'reviewed', 'approved']);
    expect($scope.showAdvanced).toBe(false);

    expect($scope.filterIsSaved).toEqual(jasmine.any(Function));
    expect($scope.saveFilter).toEqual(jasmine.any(Function));
    expect($scope.saveFilterAsNew).toEqual(jasmine.any(Function));
  });

  describe('$scope.getRepoTree', function () {
    var newFilter;
    beforeEach(function () {
      newFilter = new Filter();
      spyOn(filterService, 'getById').and.returnValue(newFilter);
      $controller('FilterController', {
        $scope: $scope,
        repoList: []
      });
    });

    it('Should call filter.getTree', function () {
      spyOn(newFilter, 'getTree').and.returnValue($q.when());
      $scope.getRepoTree();
      expect(newFilter.getTree).toHaveBeenCalled();
    });

    it('Should filter returned results by given argument', function () {
      spyOn(newFilter, 'getTree').and.returnValue($q.when([
        {path: 'client'},
        {path: 'component'},
        {path: 'commit'}
      ]));
      var result = $scope.getRepoTree('ient');
      $rootScope.$apply();
      expect(result.$$state.value.length).toBe(1);
      expect(result.$$state.value[0].path).toBe('client');

      result = $scope.getRepoTree('com');
      $rootScope.$apply();
      expect(result.$$state.value.length).toBe(2);
      expect(result.$$state.value[0].path).toBe('component');
      expect(result.$$state.value[1].path).toBe('commit');
    });
  });

  describe('$scope.reset', function () {
    var newFilter;
    beforeEach(function () {
      newFilter = new Filter();
      spyOn(filterService, 'getById').and.returnValue(newFilter);
      $controller('FilterController', {
        $scope: $scope,
        repoList: []
      });
    });

    it('Should call filter.reset', function () {
      spyOn(newFilter, 'reset');
      $scope.reset();
      expect(newFilter.reset).toHaveBeenCalled();
    });

    it('Should reset some $scope variables', function () {
      spyOn(newFilter, 'reset');
      $scope.branchList = [1, 2, 3];
      $scope.commits = [4, 5, 6];
      $scope.currentPage = 42;
      $scope.reset();
      expect($scope.branchList).toEqual([]);
      expect($scope.commits).toEqual([]);
      expect($scope.currentPage).toBe(1);
    });
  });

  describe('$scope.pathSelected', function () {
    var newFilter;
    beforeEach(function () {
      newFilter = new Filter();
      spyOn(filterService, 'getById').and.returnValue(newFilter);
      $controller('FilterController', {
        $scope: $scope,
        repoList: []
      });
    });

    it('Should set $scope.selectedPath to given value', function () {
      expect($scope.selectedPath).not.toBeDefined();
      $scope.pathSelected(null, 'givenPath');
      expect($scope.selectedPath).toBe('givenPath');
    });

  });

  describe('Watcher', function () {
    var newFilter, repos;
    beforeEach(function () {
      /*jshint camelcase:false*/
      repos = [{name: 'repo1', default_branch: 'master', owner: {login: 'owner1'}}, {
        name: 'repo2',
        default_branch: 'branch1',
        owner: {login: 'owner2'}
      }];
      newFilter = new Filter();
      spyOn(filterService, 'getById').and.returnValue(newFilter);
      spyOn(newFilter, 'getBranchList').and.returnValue($q.when([
        {name: 'master'},
        {name: 'branch1'},
        {name: 'branch2'}
      ]));
      spyOn(newFilter, 'getContributorList').and.returnValue($q.when([
        {login: 'author1'},
        {login: 'author2'},
        {login: 'author3'}
      ]));
      $controller('FilterController', {
        $scope: $scope,
        repoList: repos
      });
      $rootScope.$digest();
    });

    describe('selectedRepo', function () {

      it('Should only trigger if new value is not null and does not equal old value', function () {
        spyOn(newFilter, 'setRepo');
        $scope.selectedRepo = null;
        $rootScope.$digest();
        expect(newFilter.setRepo.calls.count()).toBe(0);

        $scope.selectedRepo = repos[0];
        $rootScope.$digest();
        expect(newFilter.setRepo.calls.count()).toBe(1);

        $scope.selectedRepo = repos[0];
        $rootScope.$digest();
        expect(newFilter.setRepo.calls.count()).toBe(1);
      });

      it('Should set correct filter values', function () {
        $scope.selectedRepo = repos[0];
        $rootScope.$digest();
        expect(newFilter.getRepo()).toBe(repos[0].name);
        expect(newFilter.getOwner()).toBe(repos[0].owner.login);
        /*jshint camelcase:false*/
        expect(newFilter.getBranch()).toBe(repos[0].default_branch);
        expect(newFilter.getAuthors()).toEqual([]);
        expect(newFilter.getPath()).toBeNull();
      });

      it('Should call filter.getBranchList and filter.getContributorList', function () {
        $scope.selectedRepo = repos[0];
        $rootScope.$digest();
        expect(newFilter.getBranchList).toHaveBeenCalled();
        expect(newFilter.getContributorList).toHaveBeenCalled();
      });

      it('Should set $scope.selectedBranch to repo default branch if filter has no branch set', function () {
        $scope.selectedRepo = repos[1];
        $rootScope.$digest();
        /*jshint camelcase:false*/
        expect($scope.selectedBranch).toBe(repos[1].default_branch);
      });

    });

    describe('selectedBranch', function () {

      it('Should only trigger if new value is not null and does not equal old value', function () {
        spyOn(newFilter, 'setBranch');
        $scope.selectedBranch = null;
        $rootScope.$digest();
        expect(newFilter.setBranch.calls.count()).toBe(0);

        $scope.selectedBranch = 'branch1';
        $rootScope.$digest();
        expect(newFilter.setBranch.calls.count()).toBe(1);

        $scope.selectedBranch = 'branch1';
        $rootScope.$digest();
        expect(newFilter.setBranch.calls.count()).toBe(1);
      });

      it('Should set correct filter values', function () {
        expect(newFilter.getBranch()).toBe('master');
        $scope.selectedBranch = 'branch1';
        $rootScope.$digest();
        expect(newFilter.getBranch()).toBe('branch1');
        expect(newFilter.getPath()).toBeNull();
      });

      it('Should set $scope.selectedBranch to given branch', function () {
        $scope.selectedBranch = 'branch2';
        $rootScope.$digest();
        /*jshint camelcase:false*/
        expect($scope.selectedBranch).toBe('branch2');
      });

    });

    describe('selectedContributor', function () {

      it('Should only trigger if new value is not null and does not equal old value', function () {
        spyOn(newFilter, 'addAuthor');
        $scope.selectedContributor = null;
        $rootScope.$digest();
        expect(newFilter.addAuthor.calls.count()).toBe(0);

        $scope.selectedContributor = 'branch1';
        $rootScope.$digest();
        expect(newFilter.addAuthor.calls.count()).toBe(1);

        $scope.selectedContributor = 'branch1';
        $rootScope.$digest();
        expect(newFilter.addAuthor.calls.count()).toBe(1);
      });

      it('Should set filter to given value', function () {
        expect(newFilter.getAuthors()).toEqual([]);
        $scope.selectedContributor = [
          {login: 'author1'},
          {login: 'author2'}
        ];
        $rootScope.$digest();
        expect(newFilter.getAuthors()).toEqual(['author1', 'author2']);
      });

    });

    describe('filterSinceAmount', function () {

      it('Should only trigger if new value is not null and does not equal old value', function () {
        spyOn(newFilter, 'setSince');
        $scope.filterSinceAmount = null;
        $rootScope.$digest();
        expect(newFilter.setSince.calls.count()).toBe(0);

        $scope.filterSinceAmount = 3;
        $rootScope.$digest();
        expect(newFilter.setSince.calls.count()).toBe(1);

        $scope.filterSinceAmount = 3;
        $rootScope.$digest();
        expect(newFilter.setSince.calls.count()).toBe(1);
      });

      it('Should set filter to given value', function () {
        expect(newFilter.getSince()).toEqual({amount: 2, pattern: 'weeks'});
        $scope.filterSinceAmount = 3;
        $rootScope.$digest();
        expect(newFilter.getSince()).toEqual({amount: 3, pattern: 'weeks'});
      });

    });

    describe('filterSincePattern', function () {

      it('Should only trigger if new value is not null and does not equal old value', function () {
        spyOn(newFilter, 'setSince');
        $scope.filterSincePattern = null;
        $rootScope.$digest();
        expect(newFilter.setSince.calls.count()).toBe(0);

        $scope.filterSincePattern = 'years';
        $rootScope.$digest();
        expect(newFilter.setSince.calls.count()).toBe(1);

        $scope.filterSincePattern = 'years';
        $rootScope.$digest();
        expect(newFilter.setSince.calls.count()).toBe(1);
      });

      it('Should set filter to given value', function () {
        expect(newFilter.getSince()).toEqual({amount: 2, pattern: 'weeks'});
        $scope.filterSincePattern = 'years';
        $rootScope.$digest();
        expect(newFilter.getSince()).toEqual({amount: 2, pattern: 'years'});
      });

    });

    describe('excludeOwnCommits', function () {

      it('Should only trigger if new value is not null and does not equal old value', function () {
        spyOn(newFilter, 'setExcludeOwnCommits');
        $scope.excludeOwnCommits = null;
        $rootScope.$digest();
        expect(newFilter.setExcludeOwnCommits.calls.count()).toBe(0);

        $scope.excludeOwnCommits = true;
        $rootScope.$digest();
        expect(newFilter.setExcludeOwnCommits.calls.count()).toBe(1);

        $scope.excludeOwnCommits = true;
        $rootScope.$digest();
        expect(newFilter.setExcludeOwnCommits.calls.count()).toBe(1);
      });

      it('Should set filter to given value', function () {
        expect(newFilter.getExcludeOwnCommits()).toBe(false);
        $scope.excludeOwnCommits = true;
        $rootScope.$digest();
        expect(newFilter.getExcludeOwnCommits()).toBe(true);
      });

    });

    describe('filterReviewState', function () {

      it('Should only trigger if new value does not equal old value', function () {
        spyOn(newFilter, 'setState');
        $scope.filterReviewState = null;
        $rootScope.$digest();
        expect(newFilter.setState.calls.count()).toBe(1);

        $scope.filterReviewState = 'unseen';
        $rootScope.$digest();
        expect(newFilter.setState.calls.count()).toBe(2);

        $scope.filterReviewState = 'unseen';
        $rootScope.$digest();
        expect(newFilter.setState.calls.count()).toBe(2);
      });

      it('Should set filter to given value', function () {
        expect(newFilter.getState()).not.toBeDefined();
        $scope.filterReviewState = 'unseen';
        $rootScope.$digest();
        expect(newFilter.getState()).toBe('unseen');
      });

    });

    describe('selectedPath', function () {

      it('Should only trigger if new value is not null and does not equal old value', function () {
        spyOn(newFilter, 'setPath');
        $scope.selectedPath = null;
        $rootScope.$digest();
        expect(newFilter.setPath.calls.count()).toBe(0);

        $scope.selectedPath = 'path';
        $rootScope.$digest();
        expect(newFilter.setPath.calls.count()).toBe(1);

        $scope.selectedPath = 'path';
        $rootScope.$digest();
        expect(newFilter.setPath.calls.count()).toBe(1);
      });

      it('Should set filter to given value', function () {
        expect(newFilter.getPath()).toBeNull();
        $scope.selectedPath = 'path';
        $rootScope.$digest();
        expect(newFilter.getPath()).toBe('path');
      });

    });

    describe('filterPath', function () {

      it('Should only trigger if new value is not null, does not equal old value and is empty', function () {
        spyOn(newFilter, 'setPath');
        $scope.filterPath = null;
        $rootScope.$digest();
        expect(newFilter.setPath.calls.count()).toBe(0);

        $scope.filterPath = 'path';
        $rootScope.$digest();
        expect(newFilter.setPath.calls.count()).toBe(0);

        $scope.filterPath = '';
        $rootScope.$digest();
        expect(newFilter.setPath.calls.count()).toBe(1);

        $scope.filterPath = '';
        $rootScope.$digest();
        expect(newFilter.setPath.calls.count()).toBe(1);

      });

      it('Should set filter to given value', function () {
        expect(newFilter.getPath()).toBeNull();
        $scope.filterPath = '';
        $rootScope.$digest();
        expect(newFilter.getPath()).toBe('');
      });

    });

    describe('currentPage', function () {

      it('Should only trigger if new value is not null and does not equal old value', function () {
        spyOn(newFilter, 'setCurrentPage');
        $scope.currentPage = null;
        $rootScope.$digest();
        expect(newFilter.setCurrentPage.calls.count()).toBe(0);

        $scope.currentPage = 42;
        $rootScope.$digest();
        expect(newFilter.setCurrentPage.calls.count()).toBe(1);

        $scope.currentPage = 42;
        $rootScope.$digest();
        expect(newFilter.setCurrentPage.calls.count()).toBe(1);
      });

      it('Should set filter to given value', function () {
        expect(newFilter.getCurrentPage()).toBe(1);
        $scope.currentPage = 42;
        $rootScope.$digest();
        expect(newFilter.getCurrentPage()).toBe(42);
      });

      it('Should call filter.getCommits after a timeout of 1000ms', function () {
        spyOn(newFilter, 'getCommits').and.returnValue($q.when([]));
        $scope.currentPage = 42;
        $rootScope.$digest();
        expect(newFilter.getCommits).not.toHaveBeenCalled();
        $timeout.flush(1000);
        expect(newFilter.getCommits).toHaveBeenCalled();
      });

    });

    describe('filter.lastEdited', function () {

      it('Should only trigger if new value is not null and does not equal old value', function () {
        spyOn(newFilter, 'getCommits').and.returnValue($q.when([]));
        newFilter.options.meta.lastEdited = null;
        $rootScope.$digest();
        $timeout.flush(1000);
        expect(newFilter.getCommits.calls.count()).toBe(0);

        newFilter.options.meta.lastEdited = 42;
        $rootScope.$digest();
        $timeout.flush(1000);
        expect(newFilter.getCommits.calls.count()).toBe(1);

        newFilter.options.meta.lastEdited = 42;
        $rootScope.$digest();
        $timeout.flush(1000);
        expect(newFilter.getCommits.calls.count()).toBe(1);
      });

      it('Should trigger after 1000ms timeout', function () {
        spyOn(newFilter, 'getCommits').and.returnValue($q.when([]));
        newFilter.options.meta.lastEdited = 42;
        $rootScope.$digest();
        $timeout.flush(100);
        expect(newFilter.getCommits).not.toHaveBeenCalled();
        $timeout.flush(900);
        expect(newFilter.getCommits).toHaveBeenCalled();
      });

    });

  });

  describe('new filter', function () {
    var newFilter;
    beforeEach(function () {
      newFilter = new Filter();
      spyOn(filterService, 'getById').and.returnValue(newFilter);
      $controller('FilterController', {
        $scope: $scope,
        repoList: []
      });
    });

    it('Should set defaults if filter is new', function () {
      expect($scope.filterSinceAmount).toBe(newFilter.getSince().amount);
      expect($scope.filterSincePattern).toBe(newFilter.getSince().pattern);
      expect($scope.filterPath).toBe(newFilter.getPath());

      expect($scope.selectedRepo).toBeNull();
      expect($scope.selectedBranch).toBeNull();
      expect($scope.selectedContributor).toBeNull();
      expect($scope.contributorList).toEqual([]);
      expect($scope.excludeOwnCommits).toBe(false);
    });
  });

  describe('Existing filter', function(){

    var newFilter, repos;
    beforeEach(function () {
      /*jshint camelcase:false*/
      repos = [{name: 'repo1', default_branch: 'master', owner: {login: 'owner1'}}, {
        name: 'repo2',
        default_branch: 'branch1',
        owner: {login: 'owner2'}
      }];
      newFilter = new Filter();
      delete newFilter.options.meta.isNew;
      newFilter.setOwner('owner2');
      newFilter.setRepo('repo2');
      newFilter.setBranch('branch1');
      newFilter.addAuthor('author2');
      newFilter.setExcludeOwnCommits(true);
      newFilter.setPath('components');
      spyOn(filterService, 'getById').and.returnValue(newFilter);
      spyOn(newFilter, 'getBranchList').and.returnValue($q.when([
        {name: 'master'},
        {name: 'branch1'},
        {name: 'branch2'}
      ]));
      spyOn(newFilter, 'getContributorList').and.returnValue($q.when([
        {login: 'author1'},
        {login: 'author2'},
        {login: 'author3'}
      ]));
      spyOn(newFilter, 'getCommits').and.returnValue($q.when([1,2,3]));
    });

    it('Should set all options correctly', function(){
      $controller('FilterController', {
        $scope: $scope,
        repoList: repos
      });
      $rootScope.$digest();
      $timeout.flush(1000);

      expect($scope.filterSinceAmount).toBe(newFilter.getSince().amount);
      expect($scope.filterSincePattern).toBe(newFilter.getSince().pattern);
      expect($scope.filterPath).toBe(newFilter.getPath());

      expect($scope.selectedRepo.name).toBe(newFilter.getRepo());
      expect($scope.selectedBranch).toBe(newFilter.getBranch());
      expect($scope.selectedContributor[0].login).toEqual(newFilter.getAuthors()[0]);
      expect($scope.excludeOwnCommits).toBe(newFilter.getExcludeOwnCommits());

      expect($scope.commits).toEqual([1,2,3]);
    });

  });
});