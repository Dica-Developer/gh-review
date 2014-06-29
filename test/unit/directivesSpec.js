define([
    'angular',
    'angularMocks',
    'moment',
    'text!commitListPaginatorTmpl',
    'app'
], function (angular, mocks, moment, commitListPaginatorTmpl) {
    'use strict';

    beforeEach(function(){
        angular.mock.module('GHReview');
    });

    describe('#Directives', function () {
        var $compile, $rootScope;

        beforeEach(mocks.inject(function ($injector, $templateCache) {
            $templateCache.put('templates/commitListPaginator.html', commitListPaginatorTmpl);
            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
        }));


        describe('formattedDate', function () {

            it('Should set date', function () {
                var date = moment().subtract('week', 2);
                var element = $compile('<small formatted-date date="'+ date +'"></small>')($rootScope);
                $rootScope.$digest();
                expect(element.text()).toBe('14 days ago');
                expect(element.find('span').attr('tooltip')).toBe(moment(date).format('llll'));
            });

        });

        describe('commitListPaginator', function () {

            it('Should enable first button', function () {
                $rootScope.hasFirst = true;
                var element = $compile('<commit-list-paginator></commit-list-paginator>')($rootScope);
                $rootScope.$digest();
                expect(element.find('.first').is(':disabled')).toBeFalsy();
                expect(element.find('.previous').is(':disabled')).toBeTruthy();
                expect(element.find('.next').is(':disabled')).toBeTruthy();
            });

            it('Should enable previous button', function () {
                $rootScope.hasPrevious = true;
                var element = $compile('<commit-list-paginator></commit-list-paginator>')($rootScope);
                $rootScope.$digest();
                expect(element.find('.first').is(':disabled')).toBeTruthy();
                expect(element.find('.previous').is(':disabled')).toBeFalsy();
                expect(element.find('.next').is(':disabled')).toBeTruthy();
            });

            it('Should enable previous next', function () {
                $rootScope.hasNext = true;
                var element = $compile('<commit-list-paginator></commit-list-paginator>')($rootScope);
                $rootScope.$digest();
                expect(element.find('.first').is(':disabled')).toBeTruthy();
                expect(element.find('.previous').is(':disabled')).toBeTruthy();
                expect(element.find('.next').is(':disabled')).toBeFalsy();
            });

        });
    });
});