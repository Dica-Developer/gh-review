/*global define, describe, it, expect, spyOn, afterEach, localStorage */
define([
  'underscore',
  'when',
  'server',
  'githubResponses',
  'app',
  'RepoCollection'
], function (_, when, server, githubResponses, app, RepoCollection) {
  'use strict';

  afterEach(function () {
    localStorage.clear();
    app.authenticated = false;
  });

  describe('#RepoCollection', function () {

    it('.getRepos should call github api', function (done) {
      server.githubReposGetAllAndOrgs();
      var githubReposGetAllSpy = spyOn(app.github.repos, 'getAll').and.callThrough();
      var githubUserGetOrgsSpy = spyOn(app.github.user, 'getOrgs').and.callThrough();
      var Collection = RepoCollection.extend();
      var collection = new Collection();
      when.all(collection.getRepos(), function(){
        expect(githubReposGetAllSpy).toHaveBeenCalled();
        expect(githubUserGetOrgsSpy).toHaveBeenCalled();
        server.stop();
        done();
      });
    });

    it('.getAllReposCallback should be called after github respond', function (done) {
      server.githubReposGetAllAndOrgs();
      var getAllReposCallbackSpy = spyOn(RepoCollection.prototype, 'getAllReposCallback').and.callThrough();
      var Collection = RepoCollection.extend();
      var collection = new Collection();
      when.all(collection.getRepos(), function(){
        expect(getAllReposCallbackSpy).toHaveBeenCalled();
        server.stop();
        done();
      });
    });

    it('.getAllReposCallback should reset collection and add new repos', function () {
      spyOn(app.github.repos, 'getAll');
      spyOn(app.github.user, 'getOrgs');
      var Collection = RepoCollection.extend();
      var collection = new Collection();
      collection.getReposDefer = when.defer();
      collection.getAllReposCallback(null, githubResponses.reposGetAll);

      expect(collection.length).toBe(2);
    });

    it('.getOrgRepos should should call github.repos.getFromOrg', function (done) {
      server.githubReposGetAllAndOrgs();
      var Collection = RepoCollection.extend();
      var collection = new Collection();
      when.all(collection.getRepos(), function(){
        expect(_.size(collection.organizations)).toBe(2);
        server.stop();
        done();
      });
    });

    xit('.getOrgRepos should should call github.repos.getFromOrg with existing org', function (done) {
      server.githubReposGetAllAndOrgs();
      spyOn(app.github.user, 'getOrgs').and.returnValue([githubResponses.userGetOrgs[0]]);
      var Collection = RepoCollection.extend();
      var collection = new Collection();
      collection.organizations = {};
      when.all(collection.getRepos(), function(){
        expect(collection.length).toBe(1);
        expect(collection.models[0].get('organization')).toEqual(githubResponses.userGetOrgs[0]);
        server.stop();
        done();
      });
    });

    xit('.getOrgRepos should should call github.repos.getFromOrg without existing org', function (done) {
      server.githubReposGetAllAndOrgs();
      spyOn(app.github.user, 'getOrgs').and.returnValue([githubResponses.userGetOrgs[1]]);
      var Collection = RepoCollection.extend();
      var collection = new Collection();
      collection.organizations = {};
      when.all(collection.getRepos(), function(){
        expect(collection.length).toBe(1);
        expect(collection.models[0].get('organization')).toBeUndefined();
        server.stop();
        done();
      });
    });

    it('.getRepoByName should return correct repo or undefined', function (done) {
      server.githubReposGetAllAndOrgs();
      var Collection = RepoCollection.extend();
      var collection = new Collection();
      when.all(collection.getRepos(), function(){
        expect(collection.getRepoByName('PRIVATE_REPO')).toBe(collection.at(1));
        expect(collection.getRepoByName('UNDEFINED_REPO')).toBe(void 0);
        server.stop();
        done();
      });
    });

    it('.toJSONSortedByName should return all repos as json sorted by repo name', function (done) {
      var expectedResult = [
        { name: 'PRIVATE_REPO', id: 2, login: 'USER' },
        { name: 'PUBLIC_REPO', id: 1, login: 'USER' }
      ];
      server.githubReposGetAllAndOrgs();
      var Collection = RepoCollection.extend();
      var collection = new Collection();
      when.all(collection.getRepos(), function(){
        expect(collection.toJSONSortedByName()).toEqual(expectedResult);
        server.stop();
        done();
      });
    });

  });

});
