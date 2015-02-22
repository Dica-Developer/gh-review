/*global _, inject, moment*/

describe('Factory: Filter', function () {
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
      'id': 'existing-filter',
      isSaved: true
    }
  },
    Filter, filterService, localStorageService, branchCollector, contributorCollector, treeCollector, commentCollector, filterUtils;

  beforeEach(module('GHReview'));
  beforeEach(module('commitMockModule'));
  beforeEach(module('eventsMock'));
  beforeEach(module('contributorCollectorMock'));
  beforeEach(module('branchCollectorMock'));
  beforeEach(module('treeCollectorMock'));
  beforeEach(module('commentCollectorMock'));

  beforeEach(inject(function($injector){
    Filter = $injector.get('Filter');
    filterService = $injector.get('filter');
    localStorageService = $injector.get('localStorageService');
    branchCollector = $injector.get('branchCollector');
    contributorCollector = $injector.get('contributorCollector');
    treeCollector = $injector.get('treeCollector');
    commentCollector = $injector.get('commentCollector');
    filterUtils = $injector.get('filterUtils');
    window.localStorage.setItem('ghreview.filter-existing-filter', JSON.stringify(filterOptions));
  }));

  afterEach(function(){
    window.localStorage.removeItem('ghreview.filter-existing-filter');
  });

  it('Should be defined', function () {
    expect(Filter).toBeDefined();
  });

  describe('#Filter.init', function () {

    it('Should set new id if not provided', function () {
        var filter = new Filter();
        expect(filter.options.id).not.toBeNull();
    });

    it('Should call localStorageService if filterId is provided', function () {
        spyOn(branchCollector, 'get');
        spyOn(contributorCollector, 'get');
        spyOn(treeCollector, 'get');
        spyOn(localStorageService, 'get');
        new Filter('filterId');
        expect(localStorageService.get).toHaveBeenCalledWith('filter-filterId');
    });

    it('Should set options to what localStorageService returns', function () {
        var filter = new Filter('existing-filter');
        _.each(filterOptions, function (value, key) {
          expect(filter.options[key]).toEqual(value);
        });
    });
  });

  describe('setter', function () {
    var filter;
    beforeEach(function () {
      filter = new Filter('existing-filter');
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

    it('setExcludeOwnCommits should set customFilter.excludeOwnCommits to given value', function () {
      expect(filter.options.meta.customFilter.excludeOwnCommits).not.toBeDefined();
      filter.setExcludeOwnCommits(true);
      expect(filter.options.meta.customFilter.excludeOwnCommits).toBe(true);
      filter.setExcludeOwnCommits(false);
      expect(filter.options.meta.customFilter.excludeOwnCommits).toBe(false);
    });
  });

  describe('getter', function () {
    var filter;
    beforeEach(function () {
      filter = new Filter('existing-filter');
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
      var dateString = moment().startOf('minute').subtract(filterOptions.since.amount, filterOptions.since.pattern).toISOString();
      expect(filter.getSinceDate()).toBe(dateString);
    });

    it('getSinceDate should return null if no since pattern is set', function () {
      filter.options.since = {};
      expect(filter.getSinceDate()).toBeNull();
    });

    it('getSinceDateISO should return current since date in ISO string', function () {
      var is = filter.getSinceDateISO();
      var expected = moment().subtract(filterOptions.since.amount, filterOptions.since.pattern).startOf('day').toISOString();
      expect(moment(is).isSame(expected, 'seconds')).toBeTruthy();
    });

    it('getSinceDateISO should return null if no since pattern is set', function () {
      filter.options.since = {};
      expect(filter.getSinceDateISO()).toBeNull();
    });

    it('getState should return correct preview state', function () {
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

    it('getPath should return correct path', function () {
      filter.options.path = '/test/path';
      expect(filter.getPath()).toBe('/test/path');
    });

    it('getExcludeOwnCommits should return correct value', function () {
      filter.options.meta.customFilter.excludeOwnCommits = true;
      expect(filter.getExcludeOwnCommits()).toBe(true);
      filter.options.meta.customFilter.excludeOwnCommits = false;
      expect(filter.getExcludeOwnCommits()).toBe(false);
    });
  });

  describe('#Filter.save', function () {
    var filter;
    beforeEach(function () {
        filter = new Filter('existing-filter');
    });

    it('Should call localStorageService to filterId to id array', function () {
      spyOn(localStorageService, 'get').and.returnValue('filter1,filter2');
      spyOn(localStorageService, 'set');
      filter.save();
      expect(localStorageService.set.calls.argsFor(0)).toEqual(['filter', 'filter1,filter2,existing-filter']);
    });

    it('Should call localStorageService.set  to add filter to localStorage', function () {
      spyOn(localStorageService, 'get').and.returnValue('filter1,filter2');
      spyOn(localStorageService, 'set');
      filter.save();
      expect(localStorageService.set.calls.argsFor(1)).toEqual(['filter-existing-filter', JSON.stringify(filter.options)]);
    });

    it('Should call localStorageService.set to add filter to localStorage even it is the first filter', function () {
      spyOn(localStorageService, 'get').and.returnValue(null);
      spyOn(localStorageService, 'set');
      filter.save();
      expect(localStorageService.set.calls.argsFor(1)).toEqual(['filter-existing-filter', JSON.stringify(filter.options)]);
    });

    it('Should call localStorageService.get to get current filter list', function () {
      spyOn(localStorageService, 'get').and.returnValue('filter1,filter2');
      spyOn(localStorageService, 'set');
      filter.save();
      expect(localStorageService.get).toHaveBeenCalledWith('filter');
    });

    it('Should delete clone properties while saving', function () {
      var clonedFilter = filterService.getCloneOf(filter);
      expect(clonedFilter.options.meta.isClone).toBe(true);
      expect(clonedFilter.options.meta.originalId).toBeDefined();
      spyOn(localStorageService, 'get').and.returnValue('filter1,filter2');
      spyOn(localStorageService, 'set');
      clonedFilter.save();
      expect(clonedFilter.options.meta.isClone).not.toBeDefined();
      expect(clonedFilter.options.meta.originalId).not.toBeDefined();
    });

    it('Should delete isNew property while saving if Filter is new', function () {
      var newFilter = new Filter();
      expect(newFilter.options.meta.isNew).toBe(true);
      spyOn(localStorageService, 'get').and.returnValue('filter1,filter2');
      spyOn(localStorageService, 'set');
      newFilter.save();
      expect(newFilter.options.meta.isNew).not.toBeDefined();
    });
  });

  describe('core functions', function () {
    var filter, $q, github, $rootScope, contributorCollector;
    beforeEach(inject(function ($injector) {
      window.localStorage.setItem('ls.accessToken', 'abc');
      $q = $injector.get('$q');
      github = $injector.get('github');
      contributorCollector = $injector.get('contributorCollector');
      $rootScope = $injector.get('$rootScope');
      filter = new Filter('existing-filter');
    }));

    afterEach(function () {
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

    it('#Filter.getCommentsUrl should return correct URL to fetch repo comments', function () {
      var url = filter.getCommentsUrl();
      expect(url).toBe('https://api.github.com/repos/Dica-Developer/gh-review/comments?per_page=100');
      filter.options.user = '';
      url = filter.getCommentsUrl();
      expect(url).toBe('https://api.github.com/repos/gh-review/comments?per_page=100');
    });

    //TODO move to filterUtils spec
    it('#Filter.prepareGithubApiCallOptions should filter all github API relevant options', function () {
      var githubOptions = filterUtils.prepareGithubApiCallOptions(filter.options);
      expect(githubOptions.repo).toEqual('gh-review');
      expect(githubOptions.user).toEqual('Dica-Developer');
      expect(githubOptions.sha).toEqual('master');

      filter.addAuthor(['She']);
      githubOptions = filterUtils.prepareGithubApiCallOptions(filter.options);
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

    it('#Filter.getContributorList should call contributorCollector', function () {
      spyOn(contributorCollector, 'get').and.returnValue($q.when());

      filter.getContributorList();
      expect(contributorCollector.get).toHaveBeenCalledWith('Dica-Developer', 'gh-review');
    });

    it('#Filter.getContributorList should promise.resolve if response', function (done) {
      spyOn(contributorCollector, 'get').and.returnValue($q.when({
        result: 'testResult',
        meta: {}
      }));

      filter.getContributorList()
        .then(function (data) {
          expect(data).toBeDefined();
          expect(data.result).toBe('testResult');
          done();
        });
      $rootScope.$apply();
    });

    //TODO test error handling
    xit('#Filter.getContributorList should promise.reject if response error', function (done) {
      spyOn(contributorCollector, 'get').and.returnValue($q.reject());
      filter.getContributorList()
        .then(null, function () {
          done();
        });
      $rootScope.$apply();
    });

    it('#Filter.reset should set all options to stored settings if filter is already saved', function () {
      expect(filter.options.repo).toEqual('gh-review');
      expect(filter.options.user).toEqual('Dica-Developer');
      expect(filter.options.sha).toEqual('master');
      expect(filter.isSaved()).toBe(true);

      filter.setRepo('newRepo');
      filter.setOwner('newUser');
      filter.setBranch('newBranch');
      expect(filter.options.repo).toEqual('newRepo');
      expect(filter.options.user).toEqual('newUser');
      expect(filter.options.sha).toEqual('newBranch');
      expect(filter.isSaved()).toBe(false);

      filter.reset();

      expect(filter.options.repo).toEqual('gh-review');
      expect(filter.options.user).toEqual('Dica-Developer');
      expect(filter.options.sha).toEqual('master');
      expect(filter.isSaved()).toBe(true);
    });

    it('#Filter.reset should set all options to default settings if filter is new', function () {
      var newFilter = new Filter();
      expect(newFilter.options.repo).toBeNull();
      expect(newFilter.options.user).toBeNull();
      expect(newFilter.options.sha).toBe('master');
      expect(newFilter.options.since).toEqual({amount: 2, pattern: 'weeks'});

      newFilter.setRepo('newRepo');
      newFilter.setOwner('newUser');
      newFilter.setBranch('newBranch');
      newFilter.setSince({amount: 1, pattern: 'years'});
      expect(newFilter.options.repo).toEqual('newRepo');
      expect(newFilter.options.user).toEqual('newUser');
      expect(newFilter.options.sha).toEqual('newBranch');
      expect(newFilter.options.since).toEqual({amount: 1, pattern: 'years'});

      newFilter.reset();

      expect(newFilter.options.repo).toBeNull();
      expect(newFilter.options.user).toBeNull();
      expect(newFilter.options.sha).toBe('master');
      expect(newFilter.options.since).toEqual({amount: 2, pattern: 'weeks'});
    });
  });

  describe('Filter._processCustomFilter', function () {
    var filter, commitsMock, $rootScope, ghUser, $q;

    beforeEach(inject(function ($injector) {
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      commitsMock = $injector.get('commitsMock');
      ghUser = $injector.get('ghUser');
      filter = new Filter();
    }));

    it('Should set commitList to given commits if no filtering is needed', function (done) {
      spyOn(filter, '_needsPostFiltering').and.returnValue(false);
      filter._processCustomFilter(commitsMock)
        .then(function () {
          expect(filter.commitList).toBe(commitsMock);
          done();
        });

      $rootScope.$apply();
    });

    it('Should set commitList to commits only for one author', function (done) {
      spyOn(ghUser, 'get').and.returnValue($q.when({login: 'AnotherUser'}));
      spyOn(commentCollector, 'getCommitApproved').and.returnValue($q.when({}));
      filter.options.meta.customFilter.authors = ['sebfroh'];
      filter._processCustomFilter(commitsMock)
        .then(function () {
          expect(filter.commitList.length).toBe(1);
          expect(filter.commitList[0].author.login).toBe('sebfroh');
          done();
        });

      $rootScope.$apply();
    });

    it('Should exclude user commits from commit list', function (done) {
      spyOn(ghUser, 'get').and.returnValue($q.when({login: 'sebfroh'}));
      spyOn(commentCollector, 'getCommitApproved').and.returnValue($q.when({}));
      filter.options.meta.customFilter.excludeOwnCommits = true;
      filter._processCustomFilter(commitsMock)
        .then(function () {
          expect(filter.commitList.length).toBe(3);
          expect(filter.commitList[0].author.login).toBe('JayGray');
          expect(filter.commitList[1].author.login).toBe('mschaaf');
          done();
        });

      $rootScope.$apply();
    });

    it('Should set commitList to approved commits only', function (done) {
      spyOn(ghUser, 'get').and.returnValue($q.when({login: 'sebfroh'}));
      spyOn(commentCollector, 'getCommitApproved').and.returnValue($q.when({'7e3cc043458366a4205621bc2c006bafd6f6c4db': true}));
      filter.options.meta.customFilter.state = 'approved';
      filter._processCustomFilter(commitsMock)
        .then(function () {
          expect(filter.commitList.length).toBe(1);
          expect(filter.commitList[0].author.login).toBe('sebfroh');
          done();
        });

      $rootScope.$apply();
    });

    it('Should set commitList to reviewed commits only', function (done) {
      spyOn(ghUser, 'get').and.returnValue($q.when({login: 'sebfroh'}));
      spyOn(commentCollector, 'getCommitApproved').and.returnValue($q.when({'7e3cc043458366a4205621bc2c006bafd6f6c4db': true}));
      filter.options.meta.customFilter.state = 'reviewed';
      filter._processCustomFilter(commitsMock)
        .then(function () {
          expect(filter.commitList.length).toBe(1);
          expect(filter.commitList[0].author.login).toBe('mschaaf');
          done();
        });

      $rootScope.$apply();
    });

    it('Should set commitList to uncommented commits only', function (done) {
      spyOn(ghUser, 'get').and.returnValue($q.when({login: 'sebfroh'}));
      spyOn(commentCollector, 'getCommitApproved').and.returnValue($q.when({'7e3cc043458366a4205621bc2c006bafd6f6c4db': true}));
      filter.options.meta.customFilter.state = 'unseen';
      filter._processCustomFilter(commitsMock)
        .then(function () {
          expect(filter.commitList.length).toBe(2);
          expect(filter.commitList[0].author.login).toBe('JayGray');
          done();
        });

      $rootScope.$apply();
    });

  });

  describe('Filter.getCommitsForStandup', function(){

    var filter, $q, $rootScope, commitCollector;
    beforeEach(inject(function ($injector) {
      window.localStorage.setItem('ls.accessToken', 'abc');
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      commitCollector = $injector.get('commitCollector');
      filter = new Filter('existing-filter');
    }));

    afterEach(function () {
      window.localStorage.removeItem('ls.accessToken');
    });

    it('Should change since property of github options', function(){
      spyOn(commitCollector, 'get').and.returnValue($q.when([]));
      filter.getCommitsForStandup();
      var originalSinceDatString = filter.getSinceDateISO();
      var alteredSinceDateString = commitCollector.get.calls.argsFor(0)[0].since;

      expect(alteredSinceDateString).not.toBe(originalSinceDatString);
    });

    it('Should change since property to now minus 24 hours', function(){
      spyOn(commitCollector, 'get').and.returnValue($q.when([]));
      filter.getCommitsForStandup();
      var expectedSinceDatString = new Date(moment().subtract(24, 'hours').toISOString());
      var alteredSinceDateString = new Date(commitCollector.get.calls.argsFor(0)[0].since);

      expect(alteredSinceDateString.getMonth()).toBe(expectedSinceDatString.getMonth());
      expect(alteredSinceDateString.getMonth()).toBe(expectedSinceDatString.getMonth());

      expect(alteredSinceDateString.getDate()).toBe(expectedSinceDatString.getDate());
      expect(alteredSinceDateString.getDate()).toBe(expectedSinceDatString.getDate());

      expect(alteredSinceDateString.getHours()).toBe(expectedSinceDatString.getHours());
      expect(alteredSinceDateString.getHours()).toBe(expectedSinceDatString.getHours());

      expect(alteredSinceDateString.getMinutes()).toBe(expectedSinceDatString.getMinutes());
      expect(alteredSinceDateString.getMinutes()).toBe(expectedSinceDatString.getMinutes());
    });

    it('Should call filter._processCustomFilter after receiving commit list', function(){
      spyOn(commitCollector, 'get').and.returnValue($q.when([]));
      spyOn(filter, '_processCustomFilter').and.returnValue($q.when([]));
      filter.getCommitsForStandup();

      $rootScope.$apply();
      expect(filter._processCustomFilter).toHaveBeenCalled();
    });

    it('Should resolve if everything has worked correctly', function(done){
      spyOn(commitCollector, 'get').and.returnValue($q.when([]));
      spyOn(filter, '_processCustomFilter').and.returnValue($q.when([]));
      filter.getCommitsForStandup()
        .then(function(commitsList){
          expect(commitsList).toBeDefined();
          done();
        });

      $rootScope.$apply();
    });

    it('Should reject if something goes wrong', function(done){
      spyOn(commitCollector, 'get').and.returnValue($q.reject('error'));
      filter.getCommitsForStandup()
        .then(null, function(error){
          expect(error).toBeDefined();
          done();
        });

      $rootScope.$apply();
    });

  });
});