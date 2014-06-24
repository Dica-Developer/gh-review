define([
    'angular',
    'angularMocks',
    'app'
], function (angular, mocks, app) {
    'use strict';

    xdescribe('directives', function () {
        beforeEach(mocks.module('GHReview.directives'));

        describe('menu', function () {
            it('Should render menu with login button if not logged in yet', function () {
                mocks.module(function ($provide) {
                    $provide.value('version', 'TEST_VER');
                });
                mocks.inject(function ($compile, $rootScope) {
                    var element = $compile('<span menu></span>')($rootScope);
                    expect(element.text()).toEqual();
                });
            });
        });
    });
});
