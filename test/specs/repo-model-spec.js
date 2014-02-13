/*global define, describe, it, expect, spyOn, beforeEach, afterEach, localStorage*/
define(['app', 'RepoModel'], function(app, RepoModel){
  'use strict';

  describe('#RepoModel', function(){
    var repoModel = null;

    beforeEach(function(){
      repoModel = new RepoModel({name: 'test', owner: {login: 'test2'}});
    });

    afterEach(function(){
      repoModel = null;
      localStorage.clear();
    });

    it('Should be defined', function(){
      expect(RepoModel).toBeDefined();
    });

    it('.getBranches should call github api if no branch is present', function(){
      var githubreposGetBranchesSpy = spyOn(app.github.repos, 'getBranches');

      repoModel.getBranches();

      expect(githubreposGetBranchesSpy).toHaveBeenCalled();

    });

    it('.getBranches should not call github api if branch is present', function(){
      var githubreposGetBranchesSpy = spyOn(app.github.repos, 'getBranches');

      repoModel.set('branches', true);
      repoModel.getBranches();

      expect(githubreposGetBranchesSpy).not.toHaveBeenCalled();

    });

    it('.getContributors should call github api if no contributors is present', function(){
      var githubreposGetContributorsSpy = spyOn(app.github.repos, 'getContributors');

      repoModel.getContributors();

      expect(githubreposGetContributorsSpy).toHaveBeenCalled();
    });

    it('.getContributors should not call github api if contributors is present', function(){
      var githubreposGetContributorsSpy = spyOn(app.github.repos, 'getContributors');

      repoModel.set('contributors', true);
      repoModel.getContributors();

      expect(githubreposGetContributorsSpy).not.toHaveBeenCalled();

    });

    it('.getContributorsCallback should save response to model', function(){
      spyOn(app.github.repos, 'getContributors');

      repoModel.set('contributors', true);
      repoModel.getContributors();
      repoModel.getContributorsCallback(null, {name: 'test'});

      expect(repoModel.get('contributors')).toEqual({name: 'test'});

    });

    it('.getBranchesCallback should save response to model', function(){
      spyOn(app.github.repos, 'getBranches');

      repoModel.set('branches', true);
      repoModel.getBranches();
      repoModel.getBranchesCallback(null, {name: 'test'});

      expect(repoModel.get('branches')).toEqual({name: 'test'});

    });

  });

});
