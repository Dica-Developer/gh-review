/*global define, describe, it, expect, beforeEach, afterEach, spyOn*/
define(['app', 'FilterModel'], function (app, Filter) {
  'use strict';

  describe('#Filter', function () {

    it('Should be defined', function () {
      expect(Filter).toBeDefined();
    });

    describe('Setter should call Filter.prototype.set', function () {

      var filter = null, setterSpy = null;

      beforeEach(function () {
        filter = new Filter();
        setterSpy = spyOn(Filter.prototype, 'set');
      });

      afterEach(function () {
        filter = null;
        setterSpy = null;
      });

      it('setOwner', function () {
        filter.setOwner('TestOwner');
        expect(setterSpy).toHaveBeenCalledWith('user', 'TestOwner');
      });

      it('setRepo', function () {
        filter.setRepo('TestRepo');
        expect(setterSpy).toHaveBeenCalledWith('repo', 'TestRepo');
      });

      it('setAuthor', function () {
        filter.setAuthor('TestAuthor');
        expect(setterSpy).toHaveBeenCalledWith('author', 'TestAuthor');
      });

      it('setContributor', function () {
        filter.setContributor('TestContributor');
        expect(setterSpy).toHaveBeenCalledWith('contributor', 'TestContributor');
      });

      it('setBranch', function () {
        filter.setBranch('testBranch');
        expect(setterSpy).toHaveBeenCalledWith('sha', 'testBranch');
      });

      it('setSince', function () {
        var date = new Date();
        filter.setSince(date);
        expect(setterSpy).toHaveBeenCalledWith('since', date);
      });

      it('setUntil', function () {
        var date = new Date();
        filter.setUntil(date);
        expect(setterSpy).toHaveBeenCalledWith('until', date);
      });

      it('setPath', function () {
        filter.setPath('testPath');
        expect(setterSpy).toHaveBeenCalledWith('path', 'testPath');
      });

      it('setState', function () {
        filter.setState('testState');
        expect(setterSpy).toHaveBeenCalledWith('customFilter', { state: 'testState' });
      });

    });

    describe('Unsetter should delete attributes', function () {

      var filter = null;

      beforeEach(function () {
        filter = new Filter();
      });

      afterEach(function () {
        filter = null;
      });

      it('unsetSince', function () {
        filter.setSince('TestSince');
        expect(filter.toJSON().since).toBe('TestSince');
        filter.unsetSince();
        expect(filter.toJSON().since).toBe(undefined);
      });

      it('unsetUntil', function () {
        filter.setUntil('TestUntil');
        expect(filter.toJSON().until).toBe('TestUntil');
        filter.unsetUntil();
        expect(filter.toJSON().until).toBe(undefined);
      });

      it('unsetPath', function () {
        filter.setPath('TestPath');
        expect(filter.toJSON().path).toBe('TestPath');
        filter.unsetPath();
        expect(filter.toJSON().path).toBe(undefined);
      });

    });

    describe('Getters', function () {

      var filter;

      beforeEach(function () {
        filter = new Filter();
      });

      afterEach(function () {
        filter = null;
      });

      it('getRepo', function () {
        var getterSpy = spyOn(Filter.prototype, 'get');
        filter.getRepo();
        expect(getterSpy).toHaveBeenCalledWith('repo');
      });

      it('getCommentsUrl', function () {
        filter.setRepo('TestRepo');
        var url1 = filter.getCommentsUrl();
        filter.setOwner('TestOwner');
        var url2 = filter.getCommentsUrl();
        expect(url1).toBe('https://api.github.com/repos/TestRepo/comments');
        expect(url2).toBe('https://api.github.com/repos/TestOwner/TestRepo/comments');
      });

      it('getNextPage', function () {
        var githubSpy = spyOn(app.github, 'getNextPage');
        filter.getNextPage();
        expect(githubSpy).toHaveBeenCalled();
      });

      it('getFirstPage', function () {
        var githubSpy = spyOn(app.github, 'getFirstPage');
        filter.getFirstPage();
        expect(githubSpy).toHaveBeenCalled();
      });

      it('getCommits', function () {
        var githubSpy = spyOn(app.github.repos, 'getCommits');
        filter.getCommits();
        expect(githubSpy).toHaveBeenCalled();
      });

    });


  });

});
