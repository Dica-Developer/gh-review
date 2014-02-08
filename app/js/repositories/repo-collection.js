/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'repoModel'
], function (Backbone, _, app, repoModel) {
  'use strict';

  var RepoCollection = Backbone.Collection.extend({
    model: repoModel,
    organizations: {},
    initialize: function () {
      this.getRepos();
    },
    getRepos: function () {
      app.github.repos.getAll({}, this.getAllReposCallback.bind(this));
      app.github.user.getOrgs({}, this.getOrgsCallback.bind(this));
    },
    getOrgRepos: function (res) {
      _.forEach(res, function (org) {
        this.organizations[org.login] = org;
        app.github.repos.getFromOrg({'org': org.login, 'type': 'all'}, this.getRepoFromOrgCallback.bind(this));
      }, this);
    },
    getAllReposCallback: function (error, res) {
      this.reset(res);
    },
    getOrgsCallback: function (error, res) {
      this.getOrgRepos(res);
    },
    getRepoFromOrgCallback: function (error, res) {
      _.forEach(res, function (repo) {
        if(!_.isUndefined(this.organizations[repo.owner.login])){
          _.extend(repo, {organization: this.organizations[repo.owner.login]});
        }
        this.add(repo);
      }, this);
    }
  });

  return RepoCollection;
});
