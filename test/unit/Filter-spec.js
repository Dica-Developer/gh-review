/*global _, inject, moment, Github*/
beforeEach(angular.mock.module('GHReview'));

describe('#Filter', function () {
  'use strict';

  var filterOptions = {
    'sha': 'master',
    'repo': 'gh-review',
    'user': 'Dica-Developer',
    'authors': ['Me', 'You'],
    'since': {
      'pattern': 'weeks',
      'amount': '20'
    },
    meta: {
      'customFilter': {
        'state': 'approved'
      },
      'id': 'filterId',
      isSaved: true
    }
  };

  it('Should be defined', inject(['Filter',
    function (Filter) {
      expect(Filter).toBeDefined();
    }
  ]));

  describe('#Filter.init', function () {

    it('Should be called', inject(['Filter',
      function (Filter) {
        spyOn(Filter.prototype, 'init');
        new Filter();
        expect(Filter.prototype.init).toHaveBeenCalled();
      }
    ]));

    it('Should set new id if not provided', inject(['Filter',
      function (Filter) {
        var filter = new Filter();
        expect(filter.options.id).not.toBeNull();
      }
    ]));

    it('Should call localStorageService if filterId is provided', inject(['Filter', 'localStorageService',
      function (Filter, localStorageService) {
        spyOn(localStorageService, 'get');
        new Filter('filterId');
        expect(localStorageService.get).toHaveBeenCalledWith('filter-filterId');
      }
    ]));

    it('Should set options to what localStorageService returns', inject(['Filter',
      function (Filter) {
        window.localStorage.setItem('ghreview.filter-filterId', JSON.stringify(filterOptions));
        var filter = new Filter('filterId');
        _.each(filterOptions, function (value, key) {
          expect(filter.options[key]).toEqual(value);
        });
        window.localStorage.removeItem('ghreview.filter-filterId');
      }
    ]));

  });

  describe('setter', function () {
    var filterProtos, filter;
    beforeEach(inject(['Filter',
      function (Filter) {
        window.localStorage.setItem('ghreview.filter-filterId', JSON.stringify(filterOptions));
        filter = new Filter('filterId');
        filterProtos = Filter.prototype;
      }
    ]));
    afterEach(function () {
      window.localStorage.removeItem('ghreview.filter-filterId');
    });

    it('.set should set given value to given key', function () {
      expect(filter.options.sha).toBe('master');
      filter.set('sha', 'testSha');
      expect(filter.options.sha).toBe('testSha');
    });

    it('.set should throw error if key is not known', function () {
      var errorFunction = function () {
        filter.set('unknown', 'unknown');
      };
      expect(errorFunction).toThrow();
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

    it('addAuthor/removeAuthor should add/remove given string/array to/from authors list', function () {
      expect(filter.hasAuthor('TestAuthor')).toBe(false);
      filter.addAuthor('TestAuthor');
      expect(filter.hasAuthor('TestAuthor')).toBe(true);
      filter.removeAuthor('TestAuthor');
      expect(filter.hasAuthor('TestAuthor')).toBe(false);
      filter.addAuthor(['TestAuthor', 'TestAuthor2']);
      expect(filter.hasAuthor('TestAuthor')).toBe(true);
      expect(filter.hasAuthor('TestAuthor2')).toBe(true);
      filter.removeAuthor('TestAuthor');
      filter.removeAuthor('TestAuthor2');
      expect(filter.hasAuthor('TestAuthor')).toBe(false);
      expect(filter.hasAuthor('TestAuthor2')).toBe(false);
    });

    it('removeAuthor should not fail if given string did not exist in authors list', function () {
      expect(filter.hasAuthor('TestAuthor')).toBe(false);
      filter.removeAuthor('TestAuthor');
      expect(filter.hasAuthor('TestAuthor')).toBe(false);
    });

    it('setContributor should set contributor to given string', function () {
      expect(filter.options.contributor).toBeNull();
      filter.setContributor('TestContributor');
      expect(filter.options.contributor).toBe('TestContributor');
    });

    it('setSince should accept only object', function () {
      expect(function () {
        filter.setSince('TestContributor');
      }).toThrow(new Error('Since should be an object but was string'));
    });

    it('setSince should set since to given object', function () {
      expect(filter.options.since).toEqual(filterOptions.since);
      filter.setSince({
        'pattern': 'year',
        'amount': 1
      });
      expect(filter.options.since).toEqual({
        'pattern': 'year',
        'amount': 1
      });
    });

    it('setUntil should set until to given object', function () {
      expect(filter.options.until).toEqual({});
      filter.setUntil({
        'pattern': 'year',
        'amount': 1
      });
      expect(filter.options.until).toEqual({
        'pattern': 'year',
        'amount': 1
      });
    });

    it('setPath should set path to given string', function () {
      expect(filter.options.path).toBeNull();
      filter.setPath('/app/');
      expect(filter.options.path).toBe('/app/');
    });

    it('setState should set state to given string', function () {
      expect(filter.options.meta.customFilter.state).toEqual(filterOptions.meta.customFilter.state);
      filter.setState('approved');
      expect(filter.options.meta.customFilter.state).toBe('approved');
    });
  });

  describe('getter', function () {
    var filterProtos, filter;
    beforeEach(inject(['Filter',
      function (Filter) {
        window.localStorage.setItem('ghreview.filter-filterId', JSON.stringify(filterOptions));
        filter = new Filter('filterId');
        filterProtos = Filter.prototype;
      }
    ]));

    afterEach(function () {
      window.localStorage.removeItem('ghreview.filter-filterId');
    });

    it('getId should return current id', function () {
      expect(filter.getId()).toBe(filterOptions.meta.id);
    });

    it('getOwner should return current user', function () {
      expect(filter.getOwner()).toBe(filterOptions.user);
    });

    it('getRepo should return current repo', function () {
      expect(filter.getRepo()).toBe(filterOptions.repo);
    });

    it('getBranch should return current sha', function () {
      expect(filter.getBranch()).toBe(filterOptions.sha);
    });

    it('getSince should return current since object', function () {
      expect(filter.getSince()).toEqual(filterOptions.since);
    });

    it('getSinceDate should return current since date without seconds', function () {
      var dateString = moment().startOf('minute').subtract(filterOptions.since.pattern, filterOptions.since.amount).toISOString();
      expect(filter.getSinceDate()).toBe(dateString);
    });

    it('getSinceDate should return null if no since pattern is set', function () {
      filter.options.since = {};
      expect(filter.getSinceDate()).toBeNull();
    });

    it('getSinceDateISO should return current since date in ISO string', function () {
      var is = filter.getSinceDateISO();
      var expected = moment().subtract(filterOptions.since.pattern, filterOptions.since.amount).toISOString();
      expect(moment(is).isSame(expected, 'seconds')).toBeTruthy();
    });

    it('getSinceDateISO should return null if no since pattern is set', function () {
      filter.options.since = {};
      expect(filter.getSinceDateISO()).toBeNull();
    });

    it('getState should returncorrect preview state', function () {
      filter.options.meta.customFilter.state = 'testState';
      expect(filter.getState()).toBe('testState');
    });

    it('getAuthor should return correct author', function () {
      filter.addAuthor('testAuthor');
      filter.addAuthor('testAuthor1');
      filter.addAuthor('testAuthor');
      filter.addAuthor('testAuthor3');
      expect(filter.getAuthors()).toEqual(['Me', 'You', 'testAuthor', 'testAuthor1', 'testAuthor', 'testAuthor3']);
    });
  });

  describe('#Filter.save', function () {
    var filterProtos, filter, lSS;
    beforeEach(inject(['Filter', 'localStorageService',
      function (Filter, localStorageService) {
        window.localStorage.setItem('ghreview.filter-filterId', JSON.stringify(filterOptions));
        filter = new Filter('filterId');
        filterProtos = Filter.prototype;
        lSS = localStorageService;
      }
    ]));

    afterEach(function () {
      window.localStorage.removeItem('ghreview.filter-filterId');
    });

    it('Should call localStorageService to filterId to id array', function () {
      spyOn(lSS, 'get').and.returnValue('filter1,filter2');
      spyOn(lSS, 'set');
      filter.save();
      expect(lSS.set.calls.argsFor(0)).toEqual(['filter', 'filter1,filter2,filterId']);
    });

    it('Should call localStorageService.set  to add filter to localStorage', function () {
      spyOn(lSS, 'get').and.returnValue('filter1,filter2');
      spyOn(lSS, 'set');
      filter.save();
      expect(lSS.set.calls.argsFor(1)).toEqual(['filter-filterId', JSON.stringify(filter.options)]);
    });

    it('Should call localStorageService.set to add filter to localStorage even it is the first filter', function () {
      spyOn(lSS, 'get').and.returnValue(null);
      spyOn(lSS, 'set');
      filter.save();
      expect(lSS.set.calls.argsFor(1)).toEqual(['filter-filterId', JSON.stringify(filter.options)]);
    });

    it('Should call localStorageService.get to get current filter list', function () {
      spyOn(lSS, 'get').and.returnValue('filter1,filter2');
      spyOn(lSS, 'set');
      filter.save();
      expect(lSS.get).toHaveBeenCalledWith('filter');
    });
  });

  describe('core functions', function () {
    var filterProtos, filter, $q, github, $rootScope;
    beforeEach(inject(function ($injector) {
      window.localStorage.setItem('ghreview.filter-filterId', JSON.stringify(filterOptions));
      window.localStorage.setItem('ls.accessToken', 'abc');

      $q = $injector.get('$q');
      github = $injector.get('github');
      $rootScope = $injector.get('$rootScope');

      var Filter = $injector.get('Filter');
      filterProtos = Filter.prototype;
      filter = new Filter('filterId');

    }));

    afterEach(function () {
      window.localStorage.removeItem('ghreview.filter-filterId');
      window.localStorage.removeItem('ls.accessToken');
    });

    it('#Filter.unsetSince should set since to empty object', function () {
      expect(_.size(filter.options.since)).toBe(2);
      filter.unsetSince();
      expect(_.size(filter.options.since)).toBe(0);
    });

    it('#Filter.unsetUntil should set until to empty object', function () {
      filter.options.until = {
        pattern: 'week',
        amount: 2
      };
      expect(_.size(filter.options.until)).toBe(2);
      filter.unsetUntil();
      expect(_.size(filter.options.until)).toBe(0);
    });

    it('#Filter.unsetPath should set path to null', function () {
      filter.options.path = '/app/';
      expect(filter.options.path).toBe('/app/');
      filter.unsetPath();
      expect(filter.options.path).toBeNull();
    });

    it('#Filter._needsPostFiltering should return true/false dependeing on custom filter length', function () {
      expect(filter._needsPostFiltering).toBeTruthy();
      filter.options.meta.customFilter = {};
      expect(filter._needsPostFiltering()).toBeFalsy();
    });

    it('#Filter.getNextPage should call #Filter.getCommits if customFilter is set', function () {
      var getCommitsSpy = spyOn(filterProtos, 'getCommits');
      filter.getNextPage();
      expect(getCommitsSpy).toHaveBeenCalled();
    });

    it('#Filter.getNextPage should call #GIthub.getNextPage if no customFilter is set', function () {
      filter.options.meta.customFilter = {};
      var githubSpy = spyOn(Github.prototype, 'getNextPage');
      filter.getNextPage();
      expect(githubSpy).toHaveBeenCalled();
    });

    it('#Filter.getFirstPage should call #Filter.getCommits if customFilter is set', function () {
      var getCommitsSpy = spyOn(filterProtos, 'getCommits');
      filter.getFirstPage();
      expect(getCommitsSpy).toHaveBeenCalled();
    });

    it('#Filter.getFirstPage should call #GIthub.getFirstPage if no customFilter is set', function () {
      filter.options.meta.customFilter = {};
      var githubSpy = spyOn(Github.prototype, 'getFirstPage');
      filter.getFirstPage();
      expect(githubSpy).toHaveBeenCalled();
    });

    it('#Filter.getPreviousPage should call #Filter.getCommits if customFilter is set', function () {
      var getCommitsSpy = spyOn(filterProtos, 'getCommits');
      filter.getPreviousPage();
      expect(getCommitsSpy).toHaveBeenCalled();
    });

    it('#Filter.getPreviousPage should call #GIthub.getPreviousPage if no customFilter is set', function () {
      filter.options.meta.customFilter = {};
      var githubSpy = spyOn(Github.prototype, 'getPreviousPage');
      filter.getPreviousPage();
      expect(githubSpy).toHaveBeenCalled();
    });

    it('#Filter.getCommentsUrl should return correct URL to fetch repo comments', function () {
      var url = filter.getCommentsUrl();
      expect(url).toBe('https://api.github.com/repos/Dica-Developer/gh-review/comments');
      filter.options.user = '';
      url = filter.getCommentsUrl();
      expect(url).toBe('https://api.github.com/repos/gh-review/comments');
    });

    it('#Filter.prepareGithubApiCallOptions should filter all github API relevant options', function () {
      var githubOptions = filter.prepareGithubApiCallOptions();
      expect(githubOptions.repo).toEqual('gh-review');
      expect(githubOptions.user).toEqual('Dica-Developer');
      expect(githubOptions.sha).toEqual('master');

      filter.addAuthor(['She']);
      githubOptions = filter.prepareGithubApiCallOptions();
      expect(githubOptions.repo).toEqual('gh-review');
      expect(githubOptions.user).toEqual('Dica-Developer');
      expect(githubOptions.sha).toEqual('master');
      expect(githubOptions.author).toEqual('She');
    });

    it('#Filter.isSaved should return correct value', function () {
      expect(filter.isSaved()).toBe(true);
      filter.addAuthor('TestAuthor');
      expect(filter.isSaved()).toBe(false);
    });

    it('#Filter.getContributorList should call github.repos.getContributors with correct values', function () {
      var githubSpy = spyOn(github.repos, 'getContributors');
      filter.getContributorList();
      expect(githubSpy).toHaveBeenCalled();
      expect(githubSpy.calls.argsFor(0)[0]).toEqual({ user: 'Dica-Developer', repo: 'gh-review' });
    });

    it('#Filter.getContributorList should promise.resolve if response', function (done) {
      spyOn(github.repos, 'getContributors');
      filter.getContributorList()
        .then(function (data) {
          expect(data).toBeDefined();
          expect(data.result).toBe('testResult');
          done();
        });
      var callback = github.repos.getContributors.calls.argsFor(0)[1];
      callback(null, {
        result: 'testResult'
      });
      $rootScope.$apply();
    });

    it('#Filter.getContributorList should promise.reject if response error', function (done) {
      spyOn(github.repos, 'getContributors');
      filter.getContributorList()
        .then(null, function () {
          done();
        });
      var callback = github.repos.getContributors.calls.argsFor(0)[1];
      callback({});
      $rootScope.$apply();
    });

    it('#Filter.reset should set all options to default and call Filter.init', function () {
      var initSpy = spyOn(filter, 'init');
      expect(filter.options.repo).toEqual('gh-review');
      expect(filter.options.user).toEqual('Dica-Developer');
      expect(filter.options.sha).toEqual('master');
      expect(filter.isSaved()).toBe(true);
      filter.reset();
      expect(filter.options.repo).toBeNull();
      expect(filter.options.user).toBeNull();
      expect(filter.options.sha).toEqual('master');
      expect(filter.isSaved()).toBe(false);
      expect(initSpy).toHaveBeenCalled();
    });
  });
});