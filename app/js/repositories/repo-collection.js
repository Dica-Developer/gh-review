/*global define*/
define([
  'backbone',
  'underscore',
  'when',
  'app',
  'RepoModel'
], function (Backbone, _, when, app, RepoModel) {
  'use strict';

  return Backbone.Collection.extend({
    model: RepoModel,
    organizations: {},
    getReposDefer: when.defer(),
    getOrgReposDefer: when.defer(),
    getRepos: function () {
      app.github.repos.getAll({}, this.getAllReposCallback.bind(this));
      app.github.user.getOrgs({}, this.getOrgsCallback.bind(this));
      return [this.getReposDefer.promise, this.getOrgReposDefer.promise];
    },
    getOrgRepos: function (res) {
      _.forEach(res, function (org) {
        this.organizations[org.login] = org;
        app.github.repos.getFromOrg({
          'org': org.login,
          'type': 'all'
        }, this.getRepoFromOrgCallback.bind(this));
      }, this);
    },
    getAllReposCallback: function (error, res) {
      this.reset(res);
      this.getReposDefer.resolve();
    },
    getOrgsCallback: function (error, res) {
      this.getOrgRepos(res);
    },
    getRepoFromOrgCallback: function (error, res) {
      _.forEach(res, function (repo) {
        if (!_.isUndefined(this.organizations[repo.owner.login])) {
          _.extend(repo, {
            organization: this.organizations[repo.owner.login]
          });
        }
        this.add(repo);
      }, this);
      this.getOrgReposDefer.resolve();
    },
    getRepoByName: function (name) {
      return this.findWhere({
        name: name
      });
    }
  });
});