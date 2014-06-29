define([
    'angular',
    'angularMocks',
    'moment',
    'githubjs',
    'text!commitListPaginatorTmpl',
    'text!menuTmpl',
    'text!authenticatedMenuTmpl',
    'text!welcomeTmpl',
    'app'
], function (angular, mocks, moment, Github, commitListPaginatorTmpl, menuTmpl, authenticatedMenuTmpl, welcomeTmpl) {
    'use strict';

    beforeEach(angular.mock.module('GHReview'));

    describe('#Directives', function () {
        var $compile, $rootScope;

        beforeEach(mocks.inject(function ($injector, $templateCache) {
            $templateCache.put('templates/commitListPaginator.html', commitListPaginatorTmpl);
            $templateCache.put('templates/menu.html', menuTmpl);
            $templateCache.put('templates/authenticatedMenu.html', authenticatedMenuTmpl);
            $templateCache.put('templates/welcome.html', welcomeTmpl);
            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
        }));


        describe('formattedDate', function () {

            it('Should set date', function () {
                var date = moment().subtract('week', 2);
                var element = $compile('<small formatted-date date="' + date + '"></small>')($rootScope);
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

        describe('menu', function () {
            var $q, lSS, gh;
            beforeEach(mocks.inject(['$q', 'localStorageService', 'github', function (_$q_, localStorageService, github) {
                $q = _$q_;
                lSS = localStorageService;
                gh = github;
            }]));

            afterEach(function(){
                localStorage.clear();
            });

            it('Should render menu without user data if user is not authenticates', function () {
                var element = $compile('<div class="collapse navbar-collapse" id="ghr-top-menu" menu></div>')($rootScope);
                $rootScope.$digest();
                expect(element.find('a').text()).toBe('Sign in with Github');
            });

            it('Should call github.user.get if user is authenticated', function () {
                localStorage.setItem('ls.accessToken', '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
                spyOn(gh.api.user, 'get');
                $compile('<div class="collapse navbar-collapse" id="ghr-top-menu" menu></div>')($rootScope);
                $rootScope.$digest();
                expect(gh.api.user.get).toHaveBeenCalled();
            });

            it('Should render authenticated menu if user is authenticated', function () {
                localStorage.setItem('ls.accessToken', '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
                spyOn(gh.api.user, 'get');
                var element = $compile('<div class="collapse navbar-collapse" id="ghr-top-menu" menu></div>')($rootScope);
                $rootScope.$digest();
                expect(element.find('.navbar-right .dropdown-menu > li').length).toBe(7);
            });
        });
    });
});