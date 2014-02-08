/*global define, describe, it, expect, spyOn, runs, waitsFor */
define([
  'underscore',
  'server',
  'githubRequests',
  'app',
  'RepoCollection'
], function(_, server, githubRequests, app, RepoCollection){
  'use strict';

  describe('#RepoCollection', function(){

    it('Should call .getRepos on initialization', function(){
      var getReposSpy = spyOn(RepoCollection.prototype, 'getRepos');
      new RepoCollection();
      expect(getReposSpy).toHaveBeenCalled();
    });

    it('.getRepos should call github api', function(){
      var githubReposGetAllSpy = spyOn(app.github.repos, 'getAll');
      var githubUserGetOrgsSpy = spyOn(app.github.user, 'getOrgs');
      new RepoCollection();
      expect(githubReposGetAllSpy).toHaveBeenCalled();
      expect(githubUserGetOrgsSpy).toHaveBeenCalled();
    });

    it('.getAllReposCallback should be called after github respond', function(){
      server.githubReposGetAll();
      var getAllReposCallbackSpy = spyOn(RepoCollection.prototype, 'getAllReposCallback');
      spyOn(app.github.user, 'getOrgs');
      new RepoCollection();

      waitsFor(function(){
        return server.server.requests[0].readyState === 4;
      });

      runs(function(){
        expect(getAllReposCallbackSpy).toHaveBeenCalled();
        server.stop();
      });
    });

    it('.getAllReposCallback should reset collection and add new repos', function(){
      spyOn(app.github.repos, 'getAll');
      spyOn(app.github.user, 'getOrgs');
      var collection = new RepoCollection();

      collection.getAllReposCallback(null, githubRequests.reposGetAll);

      expect(collection.length).toBe(2);
    });

    it('.getOrgsCallback should be called after github respond', function(){
      server.githubUserGetOrgs();
      var getOrgsCallbackSpy = spyOn(RepoCollection.prototype, 'getOrgsCallback');
      spyOn(app.github.repos, 'getAll');
      new RepoCollection();

      waitsFor(function(){
        return server.server.requests[0].readyState === 4;
      });

      runs(function(){
        expect(getOrgsCallbackSpy).toHaveBeenCalled();
        server.stop();
      });
    });

    it('.getOrgRepos should should call github.repos.getFromOrg', function(){
      server.githubUserGetOrgs();
      spyOn(app.github.repos, 'getAll');
      spyOn(app.github.user, 'getOrgs').andCallThrough();
      var githubgetFromOrgSpy = spyOn(app.github.repos, 'getFromOrg');
      var collection = new RepoCollection();

      waitsFor(function(){
        return server.server.requests[0].readyState === 4;
      });

      runs(function(){
        expect(githubgetFromOrgSpy).toHaveBeenCalled();
        expect(githubgetFromOrgSpy.calls.length).toBe(2);
        expect(_.size(collection.organizations)).toBe(2);
        server.stop();
      });
    });

  });

});
