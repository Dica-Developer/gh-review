/*global define*/
define(['backbone', 'when', 'app'], function (Backbone, when, app) {
  'use strict';

  return Backbone.Model.extend({
    getBranchesDefer: null,
    getContributorsDefer: null,
    getTreeDefer: null,
    initialize: function () {
      this.user = this.get('owner').login;
      this.repo = this.get('name');
    },
    getAdditionalInformations: function(){
      var defer = when.defer();
      var promises = [];
      promises.push(this.getBranches());
      promises.push(this.getContributors());
      promises.push(this.getTree());
      when.all(promises, function(){
        defer.resolve();
      });
      return defer.promise;
    },
    getTree: function(){
      this.getTreeDefer = when.defer();
      if (this.get('tree')) {
        this.getTreeDefer.resolve();
      } else {
        app.github.gitdata.getTree({
          user: this.user,
          repo: this.repo,
          sha: 'master',
          recursive: true
        }, this.getTreeCallback.bind(this));
      }
      return this.getBranchesDefer.promise;
    },
    getBranches: function () {
      this.getBranchesDefer = when.defer();
      if (this.get('branches')) {
        this.getBranchesDefer.resolve();
      } else {
        app.github.repos.getBranches({
          user: this.user,
          repo: this.repo
        }, this.getBranchesCallback.bind(this));
      }
      return this.getBranchesDefer.promise;
    },
    getContributors: function () {
      this.getContributorsDefer = when.defer();
      if (this.get('contributors')) {
        this.getContributorsDefer.resolve();
      } else {
        app.github.repos.getContributors({
          user: this.user,
          repo: this.repo
        }, this.getContributorsCallback.bind(this));
      }
      return this.getContributorsDefer.promise;
    },
    getTreeCallback: function(error, res){
      delete res.meta;
      this.set('tree', res);
      this.getTreeDefer.resolve(this);
    },
    getBranchesCallback: function (error, res) {
      delete res.meta;
      this.set('branches', res);
      this.getBranchesDefer.resolve(this);
    },
    getContributorsCallback: function (error, res) {
      delete res.meta;
      this.set('contributors', res);
      this.getContributorsDefer.resolve(this);
    }
  });
});
