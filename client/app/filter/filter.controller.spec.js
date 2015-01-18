/*global inject*/
describe('#Controller', function () {
  'use strict';
  describe('FilterController', function () {

    beforeEach(angular.mock.module('GHReview'));

    describe('With new filter', function () {
      var $rootScope, $scope, $q, _$injector;

      beforeEach(inject(function ($injector) {
        _$injector = $injector;
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        $q = $injector.get('$q');
      }));

      afterEach(function () {
        localStorage.clear();
      });

      it('Should call filterProvider.getNew if no filter id is given', function () {
        var filterProvider = _$injector.get('filterProvider');

        spyOn(filterProvider, 'getNew').and.callThrough();

        var $controller = _$injector.get('$controller');
        $controller('FilterController', {
          '$scope': $scope,
          filterProvider: filterProvider
        });

        expect(filterProvider.getNew).toHaveBeenCalled();
      });

      it('Should set filter since to "2 weeks"', function () {
        var filterProvider = _$injector.get('filterProvider');
        var mockedFilter = filterProvider.getNew();
        spyOn(filterProvider, 'getNew').and.returnValue(mockedFilter);

        var $controller = _$injector.get('$controller');
        $controller('FilterController', {
          '$scope': $scope,
          filterProvider: filterProvider
        });

        expect(mockedFilter.getSince()).toEqual({ pattern: 'weeks', amount: 2 });
      });

      it('Should call repoCollector.getAll and set "$scope.fetchingRepos" to true', function () {
        var repoCollector = _$injector.get('repoCollector');
        spyOn(repoCollector, 'getAll').and.returnValue($q.reject());

        var $controller = _$injector.get('$controller');
        $controller('FilterController', {
          '$scope': $scope,
          repoCollector: repoCollector
        });

        $rootScope.$apply();

        expect($scope.fetchingRepos).toBe(true);
        expect(repoCollector.getAll).toHaveBeenCalled();
      });

      it('Should set $scope variables and "$scope.fetchingRepos" to true', function () {
        var repoCollector = _$injector.get('repoCollector');
        var filterProvider = _$injector.get('filterProvider');
        var mockedFilter = filterProvider.getNew();

        spyOn(repoCollector, 'getAll').and.returnValue($q.when([
          { name: 'TestRepo' }
        ]));
        spyOn(filterProvider, 'getNew').and.returnValue(mockedFilter);

        var $controller = _$injector.get('$controller');
        $controller('FilterController', {
          '$scope': $scope,
          repoCollector: repoCollector,
          filterProvider: filterProvider
        });

        $rootScope.$apply();

        expect($scope.fetchingRepos).toBe(false);
        expect(repoCollector.getAll).toHaveBeenCalled();
        expect($scope.scope).toBe($scope);
        expect($scope.currentPage).toBe(1);
        expect($scope.excludeOwnCommits).toBe(false);
        expect($scope.filterPath).toBeNull();
        expect($scope.showAdvanced).toBe(false);
        expect($scope.filter).toBe(mockedFilter);
        expect($scope.allRepos).toEqual([
          { name: 'TestRepo' }
        ]);
        expect($scope.branches).toBeNull();
        expect($scope.contributorList).toBeNull();
        expect($scope.repoTree).toBeNull();
        expect($scope.availableFilterSincePattern).toEqual(['days', 'weeks', 'years']);
        expect($scope.availableFilterReviewStates).toEqual(['unseen', 'reviewed', 'approved']);
        expect($scope.filterReviewState).toBeNull();
      });

      describe('Scope helper functions', function () {
        var mockedFilter, controller;
        beforeEach(function () {
          var repoCollector = _$injector.get('repoCollector');
          var filterProvider = _$injector.get('filterProvider');
          mockedFilter = filterProvider.getNew();

          spyOn(repoCollector, 'getAll').and.returnValue($q.when([
            { name: 'TestRepo' }
          ]));
          spyOn(filterProvider, 'getNew').and.returnValue(mockedFilter);

          var $controller = _$injector.get('$controller');
          controller = $controller('FilterController', {
            '$scope': $scope,
            repoCollector: repoCollector,
            filterProvider: filterProvider
          });
        });

        it('$scope.repoGroupFn should return correct value', function () {
          var testItem = {
            owner: {
              login: 'TestOwner'
            }
          };

          var returnValue = $scope.repoGroupFn(testItem);
          expect(returnValue).toBe('TestOwner');
        });

        it('$scope.filterIsSaved should return correct value', function () {

          expect($scope.filterIsSaved()).toBe(false);
          mockedFilter.options.meta.isSaved = true;
          expect($scope.filterIsSaved()).toBe(true);
        });

        it('$scope.saveFilter should call Filter.save', function () {
          spyOn(mockedFilter, 'save');
          $scope.saveFilter();
          expect(mockedFilter.save).toHaveBeenCalled();
        });

        it('$scope.reset should call filter.reset and reset all $scope variables', function () {
          $scope.selectedRepo = 'TestRepo';
          $scope.selectedBranch = 'TestBranch';
          $scope.branchSelection = [1, 2, 3];
          $scope.contributor = ['TestAuthor'];
          $scope.contributorList = [1, 2, 3];
          $scope.commits = [1, 2, 3];
          $scope.repoTree = [1, 2, 3];
          spyOn(mockedFilter, 'reset');
          spyOn(controller, 'setRepos');

          $scope.reset();
          expect($scope.selectedRepo).toBeNull();
          expect($scope.selectedBranch).toBeNull();
          expect($scope.branchSelection).toBeNull();
          expect($scope.contributorList.length).toBe(0);
          expect($scope.commits).toBeNull();
          expect($scope.repoTree).toBeNull();
          expect(mockedFilter.reset).toHaveBeenCalled();
          expect(controller.setRepos).toHaveBeenCalled();
        });

        it('$scope.updateCommits should call different filter setter, set $scope.settingsUpdated to false and call .getCommitList', function () {
          spyOn(mockedFilter, 'addAuthor');
          spyOn(mockedFilter, 'setSince');
          spyOn(mockedFilter, 'setExcludeOwnCommits');
          spyOn(mockedFilter, 'setState');
          spyOn(mockedFilter, 'setPath');
          spyOn(controller, 'getCommitList');

          $scope.settingsUpdated = true;
          expect($scope.settingsUpdated).toBe(true);

          $scope.updateCommits();

          expect(mockedFilter.addAuthor).toHaveBeenCalled();
          expect(mockedFilter.setSince).toHaveBeenCalled();
          expect(mockedFilter.setExcludeOwnCommits).toHaveBeenCalled();
          expect(mockedFilter.setState).toHaveBeenCalled();
          expect(mockedFilter.setPath).toHaveBeenCalled();
          expect(controller.getCommitList).toHaveBeenCalled();
          expect($scope.settingsUpdated).toBe(false);
        });
      });

      describe('Controller functions', function () {
        var filterProvider, repoCollector, mockedFilter, controller, stateParams = {};
        beforeEach(function () {
          repoCollector = _$injector.get('repoCollector');
          filterProvider = _$injector.get('filterProvider');
          mockedFilter = filterProvider.getNew();

          spyOn(repoCollector, 'getAll').and.returnValue($q.when([
            { name: 'TestRepo' }
          ]));
          spyOn(filterProvider, 'getNew').and.returnValue(mockedFilter);
          spyOn(filterProvider, 'get').and.returnValue(mockedFilter);

          var $controller = _$injector.get('$controller');
          controller = $controller('FilterController', {
            '$scope': $scope,
            repoCollector: repoCollector,
            filterProvider: filterProvider,
            $stateParams: stateParams
          });
        });

        it('controller.isExistingFilter should reject if stateParams has no filter id', function (done) {
          controller.isExistingFilter()
            .then(null, function () {
              expect(filterProvider.getNew).toHaveBeenCalled();
              done();
            });

          $rootScope.$apply();
        });

        it('controller.isExistingFilter should resolve if stateParams has filter id', function (done) {
          stateParams.filterId = 'filterId';
          controller.isExistingFilter()
            .then(function () {
              expect(filterProvider.get).toHaveBeenCalledWith('filterId');
              delete stateParams.filterId;
              done();
            });

          $rootScope.$apply();
        });

        it('controller.getContributorList should call filter.getContributorList and controller.setContributorList', function (done) {
          spyOn(mockedFilter, 'getContributorList').and.returnValue($q.when());
          spyOn(controller, 'setContributorList').and.returnValue($q.when());
          controller.getContributorList()
            .then(function () {
              expect(mockedFilter.getContributorList).toHaveBeenCalled();
              expect(controller.setContributorList).toHaveBeenCalled();
              done();
            });

          $rootScope.$apply();
        });

        it('controller.setContributorList should set $scope.contributorList to given value', function (done) {
          expect($scope.contributorList).not.toBeDefined();
          controller.setContributorList([1, 2, 3])
            .then(function () {
              expect($scope.contributorList).toEqual([1, 2, 3]);
              done();
            });

          $rootScope.$apply();
        });

        it('controller.getCommitList should set $scope.fetchingCommits to true, $scope.commits to [] and call filter.getCommits', function () {
          $scope.commits = [1, 2, 3];
          expect($scope.fetchingCommits).not.toBeDefined();
          expect($scope.commits).toEqual([1, 2, 3]);
          spyOn(mockedFilter, 'getCommits').and.returnValue($q.reject());
          controller.getCommitList([1, 2, 3]);
          expect($scope.fetchingCommits).toBe(true);
          expect($scope.commits).toEqual([]);
          expect(mockedFilter.getCommits).toHaveBeenCalled();
        });

        it('controller.setBranchSelection should set $scope.fetchingBranches to false, $scope.branches to given value', function () {
          var branches = [
            {name: 'master'},
            {name: 'branch1'}
          ];
          $scope.selectedRepo = {
            'default_branch': 'master'
          };

          expect($scope.fetchingBranches).not.toBeDefined();
          expect($scope.branches).not.toBeDefined();

          controller.setBranchSelection(branches);

          expect($scope.fetchingBranches).toBe(false);
          expect($scope.branches).toBe(branches);
          expect($scope.branchSelection.length).toBe(2);
          expect($scope.selectedBranch).toBe('master');
        });

        it('controller.handleExistingFilter should call filter.getBranchList, .getContributorList, .getTree and repoCollector.getAll', function () {
          spyOn(mockedFilter, 'getBranchList').and.returnValue($q.reject());
          spyOn(mockedFilter, 'getContributorList').and.returnValue($q.reject());
          spyOn(mockedFilter, 'getTree').and.returnValue($q.reject());
          spyOn(controller, 'setScopeVariables').and.returnValue($q.when());

          controller.handleExistingFilter();
          $rootScope.$apply();

          expect(mockedFilter.getBranchList).toHaveBeenCalled();
          expect(mockedFilter.getContributorList).toHaveBeenCalled();
          expect(mockedFilter.getTree).toHaveBeenCalled();
          expect(controller.setScopeVariables).toHaveBeenCalled();
        });

        it('controller.handleError check for handling supplied error', function () {
          controller.handleError({message:'This is a error.'});

          expect($scope.error).toBe(JSON.stringify({message:'This is a error.'}));
          expect($scope.showError).toBe(true);
          expect($scope.showDefaultError).toBe(false);
        });

        it('controller.handleError check for handling none supplied error', function () {
          controller.handleError();

          expect($scope.error).toBeUndefined();
          expect($scope.showError).toBe(false);
          expect($scope.showDefaultError).toBe(true);
        });
      });

      describe('Watcher', function () {
        var controller;

        beforeEach(function () {
          var repoCollector = _$injector.get('repoCollector');
          var filterProvider = _$injector.get('filterProvider');
          var mockedFilter = filterProvider.getNew();

          spyOn(repoCollector, 'getAll').and.returnValue($q.when([
            { name: 'TestRepo' }
          ]));
          spyOn(filterProvider, 'getNew').and.returnValue(mockedFilter);

          var $controller = _$injector.get('$controller');
          controller = $controller('FilterController', {
            '$scope': $scope,
            repoCollector: repoCollector,
            filterProvider: filterProvider
          });

          spyOn(controller, 'checkIfSettingAreUpdated').and.callThrough();
          $rootScope.$apply();
        });

        it('$scope.selectedContributor', function () {
          $scope.contributorList = [
            {login: 'TestAuthor'}
          ];
          $scope.selectedContributor = ['TestAuthor'];
          $scope.filter.addAuthor('TestAuthor2');
          $rootScope.$digest();

          expect(controller.checkIfSettingAreUpdated.calls.mostRecent().args[0]).toEqual(['TestAuthor']);
          expect(controller.checkIfSettingAreUpdated.calls.mostRecent().args[1]).toEqual([]);
          expect($scope.settingsUpdated).toBe(true);
        });

        it('$scope.filterSinceAmount', function () {
          $scope.filterSinceAmount = 3;
          $rootScope.$digest();

          expect(controller.checkIfSettingAreUpdated.calls.mostRecent().args[0]).toBe(3);
          expect(controller.checkIfSettingAreUpdated.calls.mostRecent().args[1]).toBe(2);
          expect($scope.settingsUpdated).toBe(true);
        });

        it('$scope.filterSincePattern', function () {
          $scope.filterSincePattern = $scope.availableFilterSincePattern[0];
          $rootScope.$digest();

          expect(controller.checkIfSettingAreUpdated.calls.mostRecent().args[0]).toBe('days');
          expect(controller.checkIfSettingAreUpdated.calls.mostRecent().args[1]).toBe('weeks');
          expect($scope.settingsUpdated).toBe(true);
        });

        it('$scope.excludeOwnCommits', function () {
          $scope.excludeOwnCommits = true;
          $rootScope.$digest();

          expect(controller.checkIfSettingAreUpdated.calls.mostRecent().args[0]).toBe(true);
          expect(controller.checkIfSettingAreUpdated.calls.mostRecent().args[1]).toBe(false);
          expect($scope.settingsUpdated).toBe(true);
        });

        it('$scope.filterReviewState', function () {
          $scope.filterReviewState = $scope.availableFilterReviewStates[1];
          $rootScope.$digest();

          expect(controller.checkIfSettingAreUpdated.calls.mostRecent().args[0]).toBe('reviewed');
          expect(controller.checkIfSettingAreUpdated.calls.mostRecent().args[1]).toBeNull();
          expect($scope.settingsUpdated).toBe(true);

          $scope.filterReviewState = null;
          $scope.filter.setState('reviewed');
          $rootScope.$digest();

          expect(controller.checkIfSettingAreUpdated.calls.mostRecent().args[0]).toBeNull('reviewed');
          expect(controller.checkIfSettingAreUpdated.calls.mostRecent().args[1]).toBe('reviewed');
          expect($scope.settingsUpdated).toBe(true);
        });

        it('$scope.filterPath', function () {
          $scope.filterPath = '/path/to/nowhere';
          $rootScope.$digest();

          expect(controller.checkIfSettingAreUpdated.calls.mostRecent().args[0]).toBe('/path/to/nowhere');
          expect(controller.checkIfSettingAreUpdated.calls.mostRecent().args[1]).toBeNull();
          expect($scope.settingsUpdated).toBe(true);
        });
      });

    });
  });
});