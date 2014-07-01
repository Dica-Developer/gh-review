define([
    'angular',
    'angularMocks',
    'githubjs',
    'app'
], function (angular, mocks, Github) {
    'use strict';

    beforeEach(angular.mock.module('GHReview'));

    describe('#Services', function () {


        describe('authenticated', function () {
            var authenticated;

            beforeEach(mocks.inject(function ($injector) {
                authenticated = $injector.get('authenticated');
            }));

            afterEach(function () {
                localStorage.clear();
            });

            it('.get should return false if no access token is stored', function () {
                expect(authenticated.get()).toBeFalsy();
            });

            it('.get should return true if access token is stored', function () {
                localStorage.setItem('ls.accessToken', '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
                expect(authenticated.get()).toBeTruthy();
            });

            it('.set should store access token to local storage', function () {
                authenticated.set({'access_token': 'test-to-ken'});
                expect(localStorage.length).toBe(1);
                expect(localStorage['ls.accessToken']).toBe('test-to-ken');
            });

        });

        describe('.github', function () {
            var github;

            beforeEach(mocks.inject(function ($injector) {
                github = $injector.get('github');
            }));

            afterEach(function () {
                localStorage.clear();
            });

            it('Should store access token to local storage', function () {
                expect(github instanceof Github).toBeTruthy();
            });

        });

        describe('.githubUserData', function () {
            var githubUserData, github, $rootScope;

            beforeEach(mocks.inject(function ($injector) {
                githubUserData = $injector.get('githubUserData');
                github = $injector.get('github');
                $rootScope = $injector.get('$rootScope');
            }));

            it('Should be defined', function () {
                expect(githubUserData).toBeDefined();
            });

            it('Should call "github.user.get"', function () {
                spyOn(github.user, 'get');
                githubUserData.get();
                expect(github.user.get).toHaveBeenCalled();
            });

            it('Should return promise and resolve if response has no errors', function (done) {
                spyOn(github.user, 'get');

                githubUserData.get()
                    .then(function (data) {
                        expect(data).toBeDefined();
                        done();
                    });

                var getCallback = github.user.get.calls.argsFor(0)[1];
                getCallback(null, {});

                $rootScope.$apply();
            });

            it('Should return promise and reject if response has errors', function (done) {
                spyOn(github.user, 'get');

                githubUserData.get()
                    .then(function (data) {
                        expect(data).toBeDefined();
                        done();
                    }, function (error) {
                        expect(error.name).toBe('TestError');
                        done();
                    });

                var getCallback = github.user.get.calls.argsFor(0)[1];
                getCallback({name: 'TestError'}, null);

                $rootScope.$apply();
            });

        });

        describe('.commits', function () {

            describe('.bySha', function () {
                var commits, github, $rootScope,
                    githubParams = {
                        user: 'testUser',
                        repo: 'testRepo',
                        sha: 'master'
                    };

                beforeEach(mocks.inject(function ($injector) {
                    commits = $injector.get('commits');
                    github = $injector.get('github');
                    $rootScope = $injector.get('$rootScope');
                }));

                it('Should be defined', function () {
                    expect(commits.bySha).toBeDefined();
                });

                it('Should call "github.repos.getCommit"', function () {
                    spyOn(github.repos, 'getCommit');
                    commits.bySha(githubParams);
                    expect(github.repos.getCommit.calls.argsFor(0)[0]).toEqual(githubParams);
                });

                it('Should return promise and resolve if response has no errors', function (done) {
                    spyOn(github.repos, 'getCommit');

                    commits.bySha(githubParams)
                        .then(function (data) {
                            expect(data).toBeDefined();
                            done();
                        });

                    var getCallback = github.repos.getCommit.calls.argsFor(0)[1];
                    getCallback(null, {});

                    $rootScope.$apply();
                });

                it('Should return promise and reject if response has errors', function (done) {
                    spyOn(github.repos, 'getCommit');

                    commits.bySha(githubParams)
                        .then(null, function (error) {
                            expect(error.name).toBe('TestError');
                            done();
                        });

                    var getCallback = github.repos.getCommit.calls.argsFor(0)[1];
                    getCallback({name: 'TestError'}, null);

                    $rootScope.$apply();
                });
            });
        });

        describe('.getAllFilter', function () {
            var getAllFilter, Filter;

            beforeEach(mocks.inject(function ($injector) {
                localStorage.setItem('ls.filter', 'e0a35c44-1066-9a60-22f2-86bd825bc70c,2d3e5719-fc16-b69e-4a27-1cb2521fbeba');
                localStorage.setItem('ls.filter-2d3e5719-fc16-b69e-4a27-1cb2521fbeba', '{"sha":"master","customFilter":{"state":"reviewed"},"repo":"gh-review","user":"Dica-Developer","since":"2012-05-13T18:21:29.919Z","id":"2d3e5719-fc16-b69e-4a27-1cb2521fbebf"}');
                localStorage.setItem('ls.filter-e0a35c44-1066-9a60-22f2-86bd825bc70c', '{"sha":" DAP-18276-rebranch","customFilter":{},"repo":"dap","user":"Datameer-Inc","since":"2014-04-14T16:41:48.746Z","id":"e0a35c44-1066-9a60-22f2-86bd825bc70c"}');
                getAllFilter = $injector.get('getAllFilter');
                Filter = $injector.get('Filter');
            }));

            afterEach(function () {
                localStorage.clear();
            });

            it('Should return all stored filter', function () {
                var filter = getAllFilter();
                expect(filter).toBeDefined();
                expect(filter.length).toBe(2);
                expect(filter[0] instanceof Filter).toBeTruthy();
            });

        });

        describe('.getFilterById', function () {
            var getFilterById, Filter;

            beforeEach(mocks.inject(function ($injector) {
                localStorage.setItem('ls.filter', 'e0a35c44-1066-9a60-22f2-86bd825bc70c,2d3e5719-fc16-b69e-4a27-1cb2521fbeba');
                localStorage.setItem('ls.filter-2d3e5719-fc16-b69e-4a27-1cb2521fbeba', '{"sha":"master","customFilter":{"state":"reviewed"},"repo":"gh-review","user":"Dica-Developer","since":"2012-05-13T18:21:29.919Z","id":"2d3e5719-fc16-b69e-4a27-1cb2521fbebf"}');
                localStorage.setItem('ls.filter-e0a35c44-1066-9a60-22f2-86bd825bc70c', '{"sha":" DAP-18276-rebranch","customFilter":{},"repo":"dap","user":"Datameer-Inc","since":"2014-04-14T16:41:48.746Z","id":"e0a35c44-1066-9a60-22f2-86bd825bc70c"}');
                getFilterById = $injector.get('getFilterById');
                Filter = $injector.get('Filter');
            }));

            afterEach(function () {
                localStorage.clear();
            });

            it('Should return specific filter', function () {
                var filter = getFilterById('e0a35c44-1066-9a60-22f2-86bd825bc70c');
                expect(filter).toBeDefined();
                expect(filter instanceof Filter).toBeTruthy();
                expect(filter.getId()).toBe('e0a35c44-1066-9a60-22f2-86bd825bc70c');
            });

        });

        describe('.removeFilter', function () {
            var removeFilter;

            beforeEach(mocks.inject(function ($injector) {
                localStorage.setItem('ls.filter', 'e0a35c44-1066-9a60-22f2-86bd825bc70c,2d3e5719-fc16-b69e-4a27-1cb2521fbeba');
                localStorage.setItem('ls.filter-2d3e5719-fc16-b69e-4a27-1cb2521fbeba', '{"sha":"master","customFilter":{"state":"reviewed"},"repo":"gh-review","user":"Dica-Developer","since":"2012-05-13T18:21:29.919Z","id":"2d3e5719-fc16-b69e-4a27-1cb2521fbebf"}');
                localStorage.setItem('ls.filter-e0a35c44-1066-9a60-22f2-86bd825bc70c', '{"sha":" DAP-18276-rebranch","customFilter":{},"repo":"dap","user":"Datameer-Inc","since":"2014-04-14T16:41:48.746Z","id":"e0a35c44-1066-9a60-22f2-86bd825bc70c"}');
                removeFilter = $injector.get('removeFilter');
            }));

            afterEach(function () {
                localStorage.clear();
            });

            it('Should remove specific filter', function () {
                removeFilter('e0a35c44-1066-9a60-22f2-86bd825bc70c');
                var removedFilter = localStorage.getItem('ls.filter-e0a35c44-1066-9a60-22f2-86bd825bc70c');
                expect(removedFilter).toBeNull();
            });

            it('Should remove id from filter list', function () {
                var filterList = localStorage.getItem('ls.filter').split(',');
                expect(filterList.length).toBe(2);
                removeFilter('e0a35c44-1066-9a60-22f2-86bd825bc70c');
                filterList = localStorage.getItem('ls.filter').split(',');
                expect(filterList.length).toBe(1);
            });
        });

        describe('.humanReadableDate', function () {
            var humanReadableDate, date;

            beforeEach(mocks.inject(function ($injector) {
                humanReadableDate = $injector.get('humanReadableDate');
                date = 291780000000;
            }));

            it('Should be defined', function () {
                expect(humanReadableDate).toBeDefined();
                expect(humanReadableDate.fromNow).toBeDefined();
                expect(humanReadableDate.format).toBeDefined();
            });

            it('Should humanReadableDate.fromNow should return an "ago" string', function () {
                expect(humanReadableDate.fromNow(date)).toBe('35 years ago');
            });

            it('Should humanReadableDate.fromNow should return null if no date is given', function () {
                expect(humanReadableDate.fromNow()).toBeNull();
            });

            it('Should humanReadableDate.format should return a string', function () {
                expect(humanReadableDate.format(date)).toContain('Sun, Apr 1 1979');
            });

            it('Should humanReadableDate.format should return null if no date is given', function () {
                expect(humanReadableDate.format()).toBeNull();
            });
        });

        describe('.getCommitApproved', function () {
            var getCommitApproved, commentCollector;

            beforeEach(mocks.inject(function ($injector) {
                getCommitApproved = $injector.get('getCommitApproved');
                commentCollector = $injector.get('commentCollector');
            }));

            it('Should be a promise', function () {
                expect(getCommitApproved.then).toBeDefined();
            });
        });

        describe('.getAllAvailableRepos', function () {
            var getAllAvailableRepos, authenticated,
                githubUserData, github, $rootScope;

            beforeEach(mocks.inject(function ($injector) {
                getAllAvailableRepos = $injector.get('getAllAvailableRepos');
                authenticated = $injector.get('authenticated');
                githubUserData = $injector.get('githubUserData');
                github = $injector.get('github');
                $rootScope = $injector.get('$rootScope');
            }));

            it('Should be defined', function () {
                getAllAvailableRepos();
                expect(getAllAvailableRepos).toBeDefined();
            });

            it('Should call authenticated.get', function () {
                spyOn(authenticated, 'get');
                getAllAvailableRepos();
                expect(authenticated.get).toHaveBeenCalled();
            });

            it('Should call githubUserData.get', function () {
                spyOn(authenticated, 'get').and.returnValue(true);
                spyOn(githubUserData, 'get').and.returnValue({then: function () {
                }});
                getAllAvailableRepos();
                expect(githubUserData.get).toHaveBeenCalled();
            });

            it('Should call github.repos.getAll', function () {
                spyOn(authenticated, 'get').and.returnValue(true);
                spyOn(github.user, 'get');
                spyOn(github.repos, 'getAll');
                getAllAvailableRepos();
                var getCallback = github.user.get.calls.argsFor(0)[1];
                getCallback(null, {login: 'testUser'});
                $rootScope.$apply();
                expect(github.repos.getAll).toHaveBeenCalled();
            });

            it('Should return promise and resolve if data exist', function (done) {
                spyOn(authenticated, 'get').and.returnValue(true);
                spyOn(github.user, 'get');
                spyOn(github.repos, 'getAll');
                getAllAvailableRepos()
                    .then(function (data) {
                        expect(data).toBeDefined();
                        done();
                    });

                var getCallback = github.user.get.calls.argsFor(0)[1];
                getCallback(null, {login: 'testUser'});
                $rootScope.$apply();

                var getAllAvailableReposCallback = github.repos.getAll.calls.argsFor(0)[1];
                getAllAvailableReposCallback(null, {});
                $rootScope.$apply();
            });

            it('Should return promise and reject if error exist', function (done) {
                spyOn(authenticated, 'get').and.returnValue(true);
                spyOn(github.user, 'get');
                spyOn(github.repos, 'getAll');
                getAllAvailableRepos()
                    .then(null, function (data) {
                        expect(data).toBeDefined();
                        expect(data.name).toBe('Error');
                        done();
                    });

                var getCallback = github.user.get.calls.argsFor(0)[1];
                getCallback(null, {login: 'testUser'});
                $rootScope.$apply();

                var getAllAvailableReposCallback = github.repos.getAll.calls.argsFor(0)[1];
                getAllAvailableReposCallback({name: 'Error'}, null);
                $rootScope.$apply();
            });

            it('Should return promise and reject user is not authenticated yet', function (done) {
                spyOn(authenticated, 'get').and.returnValue(false);
                getAllAvailableRepos()
                    .then(null, function (data) {
                        expect(data).toBeDefined();
                        expect(data instanceof Error).toBeTruthy();
                        done();
                    });
                $rootScope.$apply();
            });
        });

        describe('.githubFreeSearch', function () {
            var githubFreeSearch, authenticated, github, $rootScope;

            beforeEach(mocks.inject(function ($injector) {
                githubFreeSearch = $injector.get('githubFreeSearch');
                authenticated = $injector.get('authenticated');
                github = $injector.get('github');
                $rootScope = $injector.get('$rootScope');
            }));

            it('Should call github.search.code', function () {
                spyOn(github.search, 'code');
                githubFreeSearch();
                expect(github.search.code).toHaveBeenCalled();
            });

            it('Should return promise and resolve if data exist', function (done) {
                spyOn(github.search, 'code');
                githubFreeSearch()
                    .then(function (data) {
                        expect(data).toBeDefined();
                        expect(data.result).toBe('testResult');
                        done();
                    });
                var callback = github.search.code.calls.argsFor(0)[1];
                callback(null, {result: 'testResult'});
                expect(github.search.code).toHaveBeenCalled();
                $rootScope.$apply();
            });

            it('Should return promise and reject if error exist', function (done) {
                spyOn(github.search, 'code');
                githubFreeSearch()
                    .then(null, function (error) {
                        expect(error).toBeDefined();
                        expect(error.name).toBe('Error');
                        done();
                    });
                var callback = github.search.code.calls.argsFor(0)[1];
                callback({name: 'Error'}, null);
                expect(github.search.code).toHaveBeenCalled();
                $rootScope.$apply();
            });
        });
    });
});
