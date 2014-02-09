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
      var Collection = RepoCollection.extend();
      new Collection();
      expect(getReposSpy).toHaveBeenCalled();
    });

    it('.getRepos should call github api', function(){
      var githubReposGetAllSpy = spyOn(app.github.repos, 'getAll');
      var githubUserGetOrgsSpy = spyOn(app.github.user, 'getOrgs');
      var Collection = RepoCollection.extend();
      new Collection();
      expect(githubReposGetAllSpy).toHaveBeenCalled();
      expect(githubUserGetOrgsSpy).toHaveBeenCalled();
    });

    it('.getAllReposCallback should be called after github respond', function(){
      server.githubReposGetAll();
      var getAllReposCallbackSpy = spyOn(RepoCollection.prototype, 'getAllReposCallback');
      spyOn(app.github.user, 'getOrgs');
      var Collection = RepoCollection.extend();
      new Collection();

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
      var Collection = RepoCollection.extend();
      var collection = new Collection();

      collection.getAllReposCallback(null, githubRequests.reposGetAll);

      expect(collection.length).toBe(2);
    });

    it('.getOrgsCallback should be called after github respond', function(){
      server.githubUserGetOrgs();
      var getOrgsCallbackSpy = spyOn(RepoCollection.prototype, 'getOrgsCallback');
      spyOn(app.github.repos, 'getAll');
      var Collection = RepoCollection.extend();
      new Collection();

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
      var Collection = RepoCollection.extend();
      var collection = new Collection();

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

    it('.getOrgRepos should should call github.repos.getFromOrg with existing org', function(){
      server.githubReposGetFromOrg();
      spyOn(app.github.repos, 'getAll');
      spyOn(app.github.user, 'getOrgs');
      var Collection = RepoCollection.extend();
      var collection = new Collection();
      collection.organizations = {};
      collection.getOrgRepos([githubRequests.userGetOrgs[0]]);

      waitsFor(function(){
        return server.server.requests[0].readyState === 4;
      });

      runs(function(){
        expect(collection.length).toBe(1);
        expect(collection.models[0].get('organization')).toEqual(githubRequests.userGetOrgs[0]);
        server.stop();
      });
    });

    it('.getOrgRepos should should call github.repos.getFromOrg without existing org', function(){
      server.githubReposGetFromOrg();
      spyOn(app.github.repos, 'getAll');
      spyOn(app.github.user, 'getOrgs');
      var Collection = RepoCollection.extend();
      var collection = new Collection();
      collection.organizations = {};
      collection.getOrgRepos([githubRequests.userGetOrgs[1]]);


      waitsFor(function(){
        return server.server.requests[0].readyState === 4;
      });

      runs(function(){
        expect(collection.length).toBe(1);
        expect(collection.models[0].get('organization')).toBeUndefined();
        server.stop();
      });
    });

  });

});
