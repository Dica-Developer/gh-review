define([
    'angular',
    'angularMocks'
], function (angular, mocks) {
    'use strict';

    xdescribe('FilterListController', function () {
        var FilterListController, scope;

        beforeEach(function () {
            localStorage.setItem('ls.filter', 'e0a35c44-1066-9a60-22f2-86bd825bc70c,2d3e5719-fc16-b69e-4a27-1cb2521fbeba');
            localStorage.setItem('ls.filter-2d3e5719-fc16-b69e-4a27-1cb2521fbeba', '{"sha":"master","customFilter":{"state":"reviewed"},"repo":"gh-review","user":"Dica-Developer","since":"2012-05-13T18:21:29.919Z","id":"2d3e5719-fc16-b69e-4a27-1cb2521fbebf"}');
            localStorage.setItem('ls.filter-e0a35c44-1066-9a60-22f2-86bd825bc70c', '{"sha":" DAP-18276-rebranch","customFilter":{},"repo":"dap","user":"Datameer-Inc","since":"2014-04-14T16:41:48.746Z","id":"e0a35c44-1066-9a60-22f2-86bd825bc70c"}');

            localStorage.setItem('ls.token', '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
            mocks.module('GHReview');
            mocks.inject(function ($rootScope, $controller, getFilter) {
                scope = $rootScope.$new();
                FilterListController = $controller('FilterListController', {
                    $scope: scope,
                    getFilter: getFilter
                });
            });
        });

        afterEach(function () {
            localStorage.clear();
        });

        it('Should be defined', function () {
            expect(FilterListController).toBeDefined();
        });

        it('There should be 2 filter in the list', function () {
            expect(scope.filterList.length).toBe(2);
        });
    });

    xdescribe('WhoAmIController', function () {
        var WhoAmIController, scope, originalTimeout;

        beforeEach(function () {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            localStorage.setItem('ls.accessToken', '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
            mocks.module('GHReview.controllers');
            mocks.module('GHReview.services');
            mocks.module('LocalStorageModule');
            mocks.inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                WhoAmIController = $controller('WhoAmIController', {
                    $scope: scope
                });
            });
        });

        afterEach(function () {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            localStorage.clear();
        });

        it('Should be defined', function () {
            expect(WhoAmIController).toBeDefined();
        });

    });
});