define([
    'angular',
    'angularMocks',
    'app'
], function (angular, mocks) {
    'use strict';

    beforeEach(angular.mock.module('GHReview'));

    describe('#Controller', function () {


        describe('FilterListController', function () {
            var $rootScope, $scope, controller, $state;

            beforeEach(mocks.inject(function ($injector) {
                localStorage.setItem('ls.filter', 'e0a35c44-1066-9a60-22f2-86bd825bc70c,2d3e5719-fc16-b69e-4a27-1cb2521fbeba');
                localStorage.setItem('ls.filter-2d3e5719-fc16-b69e-4a27-1cb2521fbeba', '{"sha":"master","customFilter":{"state":"reviewed"},"repo":"gh-review","user":"Dica-Developer","since":"2012-05-13T18:21:29.919Z","id":"2d3e5719-fc16-b69e-4a27-1cb2521fbebf"}');
                localStorage.setItem('ls.filter-e0a35c44-1066-9a60-22f2-86bd825bc70c', '{"sha":" DAP-18276-rebranch","customFilter":{},"repo":"dap","user":"Datameer-Inc","since":"2014-04-14T16:41:48.746Z","id":"e0a35c44-1066-9a60-22f2-86bd825bc70c"}');
                localStorage.setItem('ls.accessToken', '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
                $state = $injector.get('$state');

                var $controller = $injector.get('$controller');
                controller = $controller('FilterListController', {'$scope': $scope});
            }));

            afterEach(function () {
                localStorage.clear();
            });

            it('Should be defined', function () {
                expect(controller).toBeDefined();
            });

            it('There should be 2 filter in the list', function () {
                expect($scope.filterList.length).toBe(2);
            });

            it('.removeFilter should delete filter with given id from localStorage', function () {
                //pre check with 2 filter
                expect($scope.filterList.length).toBe(2);
                var filterList = localStorage.getItem('ls.filter').split(',');
                var filter1 = localStorage.getItem('ls.filter-' + filterList[0]);
                var filter2 = localStorage.getItem('ls.filter-' + filterList[1]);
                expect(filterList.length).toBe(2);
                expect(filter1).not.toBeNull();
                expect(filter2).not.toBeNull();

                //remove filter call
                $scope.removeFilter(filterList[0]);

                //post check with 1 filter left
                expect($scope.filterList.length).toBe(1);
                filter1 = localStorage.getItem('ls.filter-' + filterList[0]);
                filter2 = localStorage.getItem('ls.filter-' + filterList[1]);
                expect(filter1).toBeNull();
                expect(filter2).not.toBeNull();
                filterList = localStorage.getItem('ls.filter').split(',');
                expect(filterList.length).toBe(1);
            });

            it('.removeFilter should call preventDefault if event is given', function () {
                var event = {
                    preventDefault: jasmine.createSpy()
                };
                $scope.removeFilter('bla', event);
                expect(event.preventDefault).toHaveBeenCalled();
            });

            it('.editFilter should call $state.go', function () {
                spyOn($state, 'go');
                $scope.editFilter('filterId', void 0);
                expect($state.go).toHaveBeenCalledWith('editFilter', { filterId : 'filterId' });
            });

            it('.editFilter should call preventDefault and stopImmediatePropagation event is given', function () {
                spyOn($state, 'go');
                var event = {
                    preventDefault: jasmine.createSpy(),
                    stopImmediatePropagation: jasmine.createSpy()
                };
                $scope.editFilter('filterId', event);
                expect(event.preventDefault).toHaveBeenCalled();
                expect(event.stopImmediatePropagation).toHaveBeenCalled();
            });
        });

        describe('WhoAmIController', function () {
            var WhoAmIController, $scope, $controller, githubUserDataSpy, githubUserData, github;

            beforeEach(mocks.inject(function ($injector) {
                localStorage.setItem('ls.accessToken', '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
                githubUserData = $injector.get('githubUserData');
                $controller = $injector.get('$controller');
                github= $injector.get('github');
                var $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
            }));

            afterEach(function () {
                localStorage.clear();
            });

            it('Should be defined', function () {
                githubUserDataSpy = spyOn(githubUserData, 'get').and.returnValue({then: function(){}});
                WhoAmIController = $controller('WhoAmIController', {
                    $scope: $scope
                });
                expect(WhoAmIController).toBeDefined();
            });

            it('Should call githubUserData', function () {
                githubUserDataSpy = spyOn(githubUserData, 'get').and.returnValue({then: function(){}});
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
                getCallback(null, {login: 'testUser', name: 'testName'});
                $scope.$apply();
                expect($scope.userData).toBeDefined();
                expect($scope.userData.login).toBe('testUser');
                expect($scope.userData.name).toBe('testName');
            });

        });


        describe('CommitListController', function () {
            var CommitListController, $scope, $controller,
                Filter, filter, referenceFilter, filterGetByIdSpy;

            beforeEach(mocks.inject(function ($injector) {
                localStorage.setItem('ls.filter', 'e0a35c44-1066-9a60-22f2-86bd825bc70c,2d3e5719-fc16-b69e-4a27-1cb2521fbeba');
                localStorage.setItem('ls.filter-2d3e5719-fc16-b69e-4a27-1cb2521fbeba', '{"sha":"master","customFilter":{"state":"reviewed"},"repo":"gh-review","user":"Dica-Developer","since":"2012-05-13T18:21:29.919Z","id":"2d3e5719-fc16-b69e-4a27-1cb2521fbebf"}');
                localStorage.setItem('ls.filter-e0a35c44-1066-9a60-22f2-86bd825bc70c', '{"sha":" DAP-18276-rebranch","customFilter":{},"repo":"dap","user":"Datameer-Inc","since":"2014-04-14T16:41:48.746Z","id":"e0a35c44-1066-9a60-22f2-86bd825bc70c"}');
                Filter = $injector.get('Filter');
                filter = $injector.get('filter');
                referenceFilter = new Filter('e0a35c44-1066-9a60-22f2-86bd825bc70c');
                filterGetByIdSpy = spyOn(filter, 'getById').and.returnValue(referenceFilter);
                $controller = $injector.get('$controller');
                var $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
            }));

            afterEach(function () {
                localStorage.clear();
            });

            it('Should be defined', function () {
                CommitListController = $controller('CommitListController', {
                    $scope: $scope,
                    commitsApproved: {}
                });
                expect(CommitListController).toBeDefined();
            });

            it('Should call filter.getById', function () {
                CommitListController = $controller('CommitListController', {
                    $scope: $scope,
                    commitsApproved: {}
                });
                expect(filterGetByIdSpy).toHaveBeenCalled();
            });

            it('Should collect owner and repo from filter', function () {
                spyOn(Filter.prototype, 'getOwner').and.callThrough();
                spyOn(Filter.prototype, 'getRepo').and.callThrough();
                CommitListController = $controller('CommitListController', {
                    $scope: $scope,
                    commitsApproved: {}
                });
                expect(Filter.prototype.getOwner).toHaveBeenCalled();
                expect(Filter.prototype.getRepo).toHaveBeenCalled();
            });

        });

        describe('FilterController', function () {
            var FilterController, $scope, $controller, Filter, spy = {};

            beforeEach(mocks.inject(function ($injector) {
                Filter = $injector.get('Filter');
                spy.getAllReposAndBranches = $injector.get('getAllReposAndBranches');
                $controller = $injector.get('$controller');
                var $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
            }));

            afterEach(function () {
                localStorage.clear();
            });

            it('Should be defined', function () {
                FilterController = $controller('FilterController', {
                    $scope: $scope,
                    commitsApproved: {}
                });
                expect(FilterController).toBeDefined();
            });

            it('Should call getAllReposAndBranches', function () {
                spyOn(spy, 'getAllReposAndBranches').and.returnValue({then: function(){}});
                FilterController = $controller('FilterController', {
                    $scope: $scope,
                    getAllReposAndBranches: spy.getAllReposAndBranches
                });
                expect(spy.getAllReposAndBranches).toHaveBeenCalled();
            });

        });

        describe('ModuleFilterController', function () {
            var $q, ModuleFilterController, $scope, $controller, github, spy = {};

            beforeEach(mocks.inject(function ($injector) {
                github = $injector.get('github');
                spy.githubFreeSearch = $injector.get('githubFreeSearch');
                $q = $injector.get('$q');
                $controller = $injector.get('$controller');
                var $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
            }));


            it('Should be defined', function () {
                ModuleFilterController = $controller('ModuleFilterController', {
                    $scope: $scope
                });
                expect(ModuleFilterController).toBeDefined();
            });

            it('Should have empty search string', function () {
                ModuleFilterController = $controller('ModuleFilterController', {
                    $scope: $scope
                });
                expect($scope.searchString).toBeDefined();
                expect($scope.searchString).toBe('');
            });

            it('Should call githubFreeSearch when calling $scope.doSearch', function () {
                spyOn(spy, 'githubFreeSearch').and.returnValue({then: function(){}});
                ModuleFilterController = $controller('ModuleFilterController', {
                    $scope: $scope,
                    githubFreeSearch: spy.githubFreeSearch
                });
                $scope.doSearch();
                $scope.$apply();
                expect(spy.githubFreeSearch).toHaveBeenCalled();
            });

            it('Should set $scope.reult to response of gitHubFreeSearch request', function () {
                var defer = $q.defer();
                spyOn(spy, 'githubFreeSearch').and.returnValue(defer.promise);
                ModuleFilterController = $controller('ModuleFilterController', {
                    $scope: $scope,
                    githubFreeSearch: spy.githubFreeSearch
                });
                $scope.doSearch();
                expect($scope.result).toBeUndefined();
                var items = [1, 2, 3];
                defer.resolve({items: items});
                $scope.$apply();
                expect($scope.result).toBeDefined();
                expect($scope.result).toBe(items);
            });

        });
    });
});