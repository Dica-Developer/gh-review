define([
    'angular',
    'angularMocks',
    'lodash',
    'moment',
    'githubjs',
    'app'
], function (angular, mocks, _, moment, GitHub) {
    'use strict';

    var filterOptions = {
        'sha': 'master',
        'customFilter': {'state': 'approved'},
        'repo': 'gh-review',
        'user': 'Dica-Developer',
        'since': {'pattern': 'weeks', 'amount': '20'},
        'id': 'filterId'
    };

    beforeEach(angular.mock.module('GHReview'));

    describe('#Filter', function () {

        it('Should be defined', mocks.inject(['Filter', function (Filter) {
            expect(Filter).toBeDefined();
        }]));

        describe('#Filter.init', function () {

            it('Should be called', mocks.inject(['Filter', function (Filter) {
                spyOn(Filter.prototype, 'init');
                new Filter();
                expect(Filter.prototype.init).toHaveBeenCalled();
            }]));

            it('Should set new id if not provided', mocks.inject(['Filter', function (Filter) {
                var filter = new Filter();
                expect(filter.options.id).not.toBeNull();
            }]));

            it('Should call localStorageService if filterId is provided', mocks.inject(['Filter', 'localStorageService', function (Filter, localStorageService) {
                spyOn(localStorageService, 'get');
                new Filter('filterId');
                expect(localStorageService.get).toHaveBeenCalledWith('filter-filterId');
            }]));

            it('Should set options to what localStorageService returns', mocks.inject(['Filter', function (Filter) {
                window.localStorage.setItem('ls.filter-filterId', JSON.stringify(filterOptions));
                var filter = new Filter('filterId');
                _.each(filterOptions, function (value, key) {
                    expect(filter.options[key]).toEqual(value);
                });
                window.localStorage.removeItem('ls.filter-filterId');
            }]));

        });

        describe('setter', function () {
            var filterProtos, filter;
            beforeEach(mocks.inject(['Filter', function (Filter) {
                window.localStorage.setItem('ls.filter-filterId', JSON.stringify(filterOptions));
                filter = new Filter('filterId');
                filterProtos = Filter.prototype;
            }]));
            afterEach(function () {
                window.localStorage.removeItem('ls.filter-filterId');
            });

            it('setRepo should set repo to given string', function () {
                expect(filter.options.repo).toBe(filterOptions.repo);
                filter.setRepo('TestRepo');
                expect(filter.options.repo).toBe('TestRepo');
            });

            it('setBranch should set sha to given string', function () {
                expect(filter.options.sha).toBe(filterOptions.sha);
                filter.setBranch('refactoring');
                expect(filter.options.sha).toBe('refactoring');
            });

            it('setOwner should set user to given string', function () {
                expect(filter.options.user).toBe(filterOptions.user);
                filter.setOwner('TestOwner');
                expect(filter.options.user).toBe('TestOwner');
            });

            it('setAuthor should set author to given string', function () {
                expect(filter.options.author).toBeNull();
                filter.setAuthor('TestAuthor');
                expect(filter.options.author).toBe('TestAuthor');
            });

            it('setContributor should set contributor to given string', function () {
                expect(filter.options.contributor).toBeNull();
                filter.setContributor('TestContributor');
                expect(filter.options.contributor).toBe('TestContributor');
            });

            it('setSince should accept only object', function () {
                expect(function(){filter.setSince('TestContributor');}).toThrow(new Error('Since should be an object but was string'));
            });

            it('setSince should set since to given object', function () {
                expect(filter.options.since).toEqual(filterOptions.since);
                filter.setSince({'pattern': 'year', 'amount': 1});
                expect(filter.options.since).toEqual({'pattern': 'year', 'amount': 1});
            });

            it('setUntil should set until to given object', function () {
                expect(filter.options.until).toEqual({});
                filter.setUntil({'pattern': 'year', 'amount': 1});
                expect(filter.options.until).toEqual({'pattern': 'year', 'amount': 1});
            });

            it('setPath should set path to given string', function () {
                expect(filter.options.path).toBeNull();
                filter.setPath('/app/');
                expect(filter.options.path).toBe('/app/');
            });

            it('setState should set state to given string', function () {
                expect(filter.options.customFilter.state).toEqual(filterOptions.customFilter.state);
                filter.setState('approved');
                expect(filter.options.customFilter.state).toBe('approved');
            });
        });

        describe('getter', function () {
            var filterProtos, filter;
            beforeEach(mocks.inject(['Filter', function (Filter) {
                window.localStorage.setItem('ls.filter-filterId', JSON.stringify(filterOptions));
                filter = new Filter('filterId');
                filterProtos = Filter.prototype;
            }]));

            afterEach(function () {
                window.localStorage.removeItem('ls.filter-filterId');
            });

            it('getId should return current id', function(){
                expect(filter.getId()).toBe(filterOptions.id);
            });

            it('getOwner should return current user', function(){
                expect(filter.getOwner()).toBe(filterOptions.user);
            });

            it('getRepo should return current repo', function(){
                expect(filter.getRepo()).toBe(filterOptions.repo);
            });

            it('getBranch should return current sha', function(){
                expect(filter.getBranch()).toBe(filterOptions.sha);
            });

            it('getSince should return current since object', function(){
                expect(filter.getSince()).toEqual(filterOptions.since);
            });

            it('getSinceDate should return current since date without seconds', function(){
                var dateString = moment().startOf('minute').subtract(filterOptions.since.pattern, filterOptions.since.amount).toISOString();
                expect(filter.getSinceDate()).toBe(dateString);
            });

            it('getSinceDate should return null if no since pattern is set', function(){
                filter.options.since = {};
                expect(filter.getSinceDate()).toBeNull();
            });

            it('getSinceDateISO should return current since date in ISO string', function(){
                var is = filter.getSinceDateISO();
                var expected = moment().subtract(filterOptions.since.pattern, filterOptions.since.amount).toISOString();
                expect(moment(is).isSame(expected, 'seconds')).toBeTruthy();
            });

            it('getSinceDateISO should return null if no since pattern is set', function(){
                filter.options.since = {};
                expect(filter.getSinceDateISO()).toBeNull();
            });
        });

        describe('#Filter.save', function(){
            var filterProtos, filter, lSS;
            beforeEach(mocks.inject(['Filter', 'localStorageService', function (Filter, localStorageService) {
                window.localStorage.setItem('ls.filter-filterId', JSON.stringify(filterOptions));
                filter = new Filter('filterId');
                filterProtos = Filter.prototype;
                lSS = localStorageService;
            }]));

            afterEach(function () {
                window.localStorage.removeItem('ls.filter-filterId');
            });

            it('Should call localStorageService to filterId to id array', function(){
                spyOn(lSS, 'get').and.returnValue('filter1,filter2');
                spyOn(lSS, 'set');
                filter.save();
                expect(lSS.set.calls.argsFor(0)).toEqual(['filter', 'filter1,filter2,filterId']);
            });

            it('Should call localStorageService to add filter to localStorage', function(){
                spyOn(lSS, 'get').and.returnValue('filter1,filter2');
                spyOn(lSS, 'set');
                filter.save();
                expect(lSS.set.calls.argsFor(1)).toEqual(['filter-filterId', JSON.stringify(filter.options)]);
            });

            it('Should call localStorageService.get to get current filter list', function(){
                spyOn(lSS, 'get').and.returnValue('filter1,filter2');
                spyOn(lSS, 'set');
                filter.save();
                expect(lSS.get).toHaveBeenCalledWith('filter');
            });
        });

        describe('core functions', function() {
            var filterProtos, filter, q;
            beforeEach(mocks.inject(['$q', 'Filter', function ($q, Filter) {
                window.localStorage.setItem('ls.filter-filterId', JSON.stringify(filterOptions));
                window.localStorage.setItem('ls.accessToken', 'abc');
                filter = new Filter('filterId');
                filterProtos = Filter.prototype;
                q = $q;
            }]));

            afterEach(function () {
                window.localStorage.removeItem('ls.filter-filterId');
                window.localStorage.removeItem('ls.accessToken');
            });

            it('#Filter.unsetSince should set since to empty object', function(){
                expect(_.size(filter.options.since)).toBe(2);
                filter.unsetSince();
                expect(_.size(filter.options.since)).toBe(0);
            });

            it('#Filter.unsetUntil should set until to empty object', function(){
                filter.options.until = {
                    pattern: 'week',
                    amount: 2
                };
                expect(_.size(filter.options.until)).toBe(2);
                filter.unsetUntil();
                expect(_.size(filter.options.until)).toBe(0);
            });

            it('#Filter.unsetPath should set path to null', function(){
                filter.options.path = '/app/';
                expect(filter.options.path).toBe('/app/');
                filter.unsetPath();
                expect(filter.options.path).toBeNull();
            });

            it('#Filter._needsPostFiltering should return true/false dependeing on custom filter length', function(){
                expect(filter._needsPostFiltering).toBeTruthy();
                filter.options.customFilter = {};
                expect(filter._needsPostFiltering()).toBeFalsy();
            });

            it('#Filter.getNextPage should call #Filter.getCommits if customFilter is set', function(){
                var getCommitsSpy = spyOn(filterProtos, 'getCommits');
                filter.getNextPage();
                expect(getCommitsSpy).toHaveBeenCalled();
            });

            it('#Filter.getNextPage should call #GIthub.getNextPage if no customFilter is set', function(){
                filter.options.customFilter = {};
                var githubSpy = spyOn(GitHub.prototype, 'getNextPage');
                filter.getNextPage();
                expect(githubSpy).toHaveBeenCalled();
            });

            it('#Filter.getFirstPage should call #Filter.getCommits if customFilter is set', function(){
                var getCommitsSpy = spyOn(filterProtos, 'getCommits');
                filter.getFirstPage();
                expect(getCommitsSpy).toHaveBeenCalled();
            });

            it('#Filter.getFirstPage should call #GIthub.getFirstPage if no customFilter is set', function(){
                filter.options.customFilter = {};
                var githubSpy = spyOn(GitHub.prototype, 'getFirstPage');
                filter.getFirstPage();
                expect(githubSpy).toHaveBeenCalled();
            });

            it('#Filter.getPreviousPage should call #Filter.getCommits if customFilter is set', function(){
                var getCommitsSpy = spyOn(filterProtos, 'getCommits');
                filter.getPreviousPage();
                expect(getCommitsSpy).toHaveBeenCalled();
            });

            it('#Filter.getPreviousPage should call #GIthub.getPreviousPage if no customFilter is set', function(){
                filter.options.customFilter = {};
                var githubSpy = spyOn(GitHub.prototype, 'getPreviousPage');
                filter.getPreviousPage();
                expect(githubSpy).toHaveBeenCalled();
            });

            it('#Filter.getCommentsUrl should return correct URL to fetch repo comments', function(){
                var url = filter.getCommentsUrl();
                expect(url).toBe('https://api.github.com/repos/Dica-Developer/gh-review/comments');
                filter.options.user = '';
                url = filter.getCommentsUrl();
                expect(url).toBe('https://api.github.com/repos/gh-review/comments');
            });

            it('#Filter.prepareGithubApiCallOptions should filter all github API relevant options', function(){
                var githubOptions = filter.prepareGithubApiCallOptions();
                expect(githubOptions).toEqual({ repo : 'gh-review', user : 'Dica-Developer', sha : 'master', since : filter.getSinceDateISO(), until : {  } });
            });
        });
    });

});
