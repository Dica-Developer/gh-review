define(function (require) {
    'use strict';

    var angular = require('angular'),
        _ = require('lodash'),
        mocks = require('angularMocks'),
        moment = require('moment'),
        Github = require('githubjs'),
        commitListPaginatorTmpl = require('text!commitListPaginatorTmpl'),
        menuTmpl = require('text!menuTmpl'),
        authenticatedMenuTmpl = require('text!authenticatedMenuTmpl'),
        welcomeTmpl = require('text!welcomeTmpl');


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

            afterEach(function () {
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

        describe('avatar', function () {
            var $scope;
            beforeEach(function () {
                $scope = $rootScope.$new();
            });

            it('Should render avatar link and img with complete data', function () {
                var element = $compile('<avatar commit="commit.committer"></avatar>')($scope);
                $scope.commit = {
                    committer: {
                        name: 'TestName',
                        avatar: 'AvatarLink',
                        committerLink: 'committerLink'
                    }
                };
                $scope.$digest();
                expect(element.find('a').attr('title')).toBe('TestName');
                expect(element.find('a').attr('href')).toBe('committerLink');
                expect(element.find('img').attr('ng-src')).toBe('AvatarLink');
                expect(element.find('img').attr('src')).toBe('AvatarLink');
                expect(element.find('img').attr('height')).toBe('32px');
            });

            it('Should render avatar link and img with committerLink is missing', function () {
                var element = $compile('<avatar commit="commit.committer"></avatar>')($scope);
                $scope.commit = {
                    committer: {
                        name: 'TestName',
                        avatar: 'AvatarLink'
                    }
                };
                $scope.$digest();
                expect(element.find('a').attr('title')).toBe('TestName');
                expect(element.find('a').attr('href')).toBe('#');
                expect(element.find('img').attr('ng-src')).toBe('AvatarLink');
                expect(element.find('img').attr('src')).toBe('AvatarLink');
                expect(element.find('img').attr('height')).toBe('32px');
            });
        });

        describe('comment', function () {

            describe('existing comment', function () {
                var $scope;
                beforeEach(mocks.inject(function ($injector) {
                    $scope = $rootScope.$new();
                    var Comment = $injector.get('Comment');
                    /*jshint camelcase:false*/
                    $scope.comment = new Comment({
                        body_html: '<p>Line comment test</p>',
                        commit_id: '9dc35ebda672c3a0443d0af3fa54fda0372cdcd2',
                        created_at: '2014-06-05T14:19:31Z',
                        html_url: 'https://github.com/Dica-Developer/gh-review/commit/9dc35ebda672c3a0443d0af3fa54fda0372cdcd2#commitcomment-6569207',
                        id: 6569207,
                        line: 39,
                        path: 'app/templates/_filter.html',
                        position: 6,
                        updated_at: '2014-06-05T14:19:31Z',
                        url: 'https://api.github.com/repos/Dica-Developer/gh-review/comments/6569207'
                    });
                }));
                it('Should render comment', function () {
                    var element = $compile('<div class="lineComment panel panel-default" content="comment" mode="comment.mode" comment></div>')($scope);
                    $scope.$digest();
                    expect(element.find('.panel-body').text()).toBe('Line comment test');
                });

                it('Should render edit and remove buttons', function () {
                    var element = $compile('<div class="lineComment panel panel-default" content="comment" mode="comment.mode" comment></div>')($scope);
                    $scope.$digest();
                    expect(element.find('button > .glyphicon-pencil').length).toBe(1);
                    expect(element.find('button > .glyphicon-remove-circle').length).toBe(1);
                });
            });


            describe('new comment', function () {
                var $scope;
                beforeEach(mocks.inject(function ($injector) {
                    $scope = $rootScope.$new();
                    var Comment = $injector.get('Comment');
                    /*jshint camelcase:false*/
                    $scope.comment = new Comment({
                        mode: 'edit',
                        line: 39,
                        path: 'app/templates/_filter.html',
                        position: 6
                    });
                }));

                it('Should render comment', function () {
                    var element = $compile('<div class="lineComment panel panel-default" content="comment" mode="comment.mode" comment></div>')($scope);
                    $scope.$digest();
                    expect(element.find('textarea').text()).toBe('');
                    expect(element.find('textarea').length).toBe(1);
                });

                it('Should render cancel, preview and save buttons', function () {
                    var element = $compile('<div class="lineComment panel panel-default" content="comment" mode="comment.mode" comment></div>')($scope);
                    $scope.$digest();
                    expect(element.find('#cancelComment').length).toBe(1);
                    expect(element.find('#previewComment').length).toBe(1);
                    expect(element.find('#submitLineComment').length).toBe(1);
                    expect(element.find('#cancelComment').text()).toBe('Cancel');
                    expect(element.find('#previewComment').text()).toBe('Preview');
                    expect(element.find('#submitLineComment').text()).toBe('Add');
                });
            });

            describe('preview comment', function () {
                var $scope;
                beforeEach(mocks.inject(function ($injector) {
                    $scope = $rootScope.$new();
                    var Comment = $injector.get('Comment');
                    /*jshint camelcase:false*/
                    $scope.comment = new Comment({
                        mode: 'preview',
                        line: 39,
                        path: 'app/templates/_filter.html',
                        position: 6,
                        previewHtml: '<p>Test</p>'
                    });
                }));
                it('Should render comment', function () {
                    var element = $compile('<div class="lineComment panel panel-default" content="comment" mode="comment.mode" comment></div>')($scope);
                    $scope.$digest();
                    expect(element.find('p').text()).toBe('Test');
                    expect(element.find('p').length).toBe(1);
                });

                xit('Should render cancel, preview and save buttons', function () {
                    var element = $compile('<div class="lineComment panel panel-default" content="comment" mode="comment.mode" comment></div>')($scope);
                    $scope.$digest();
                    expect(element.find('#cancelComment').length).toBe(1);
                    expect(element.find('#previewComment').length).toBe(1);
                    expect(element.find('#submitLineComment').length).toBe(1);
                    expect(element.find('#cancelComment').text()).toBe('Cancel');
                    expect(element.find('#previewComment').text()).toBe('Preview');
                    expect(element.find('#submitLineComment').text()).toBe('Add');
                });
            });
        });

        describe('commitMessageTeaser', function () {
            var $scope;
            beforeEach(function () {
                $scope = $rootScope.$new();
            });
            it('Should render full message', function () {
                $scope.commit = {
                    message: _.range(54).join('')
                };
                var element = $compile('<commit-message-teaser message="commit.message"></commit-message-teaser>')($scope);
                $scope.$apply();
                var text = element.find('.panel-title').text();
                expect(text).toBe(_.range(54).join(''));
                expect(element.find('.panel-title').length).toBe(1);
                expect(text.indexOf('...')).toBe(-1);
            });

            it('Should render cropped message and add "..."', function () {
                $scope.commit = {
                    message: _.range(55).join('')
                };
                var element = $compile('<commit-message-teaser message="commit.message"></commit-message-teaser>')($scope);
                $scope.$apply();
                var text = element.find('.panel-title').text();
                expect(element.find('.panel-title').length).toBe(1);
                expect(text.indexOf('...')).toBe(100);
            });

            it('Should render message as text instead of html', function () {
                $scope.commit = {
                    message: '<img src="#" />'
                };
                var element = $compile('<commit-message-teaser message="commit.message"></commit-message-teaser>')($scope);
                $scope.$apply();
                var text = element.find('.panel-title').text();
                expect(element.find('img').length).toBe(0);
                expect(text).toBe('<img src="#" />');
            });

        });
    });
});