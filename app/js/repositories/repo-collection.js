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
    initialize: function () {
      app.on('ready', this.getRepos, this);
    },
    getRepos: function () {
      var _this = this;
      app.github.repos.getAll({}, function (error, res) {
        _this.reset(res);
      });

      app.github.user.getOrgs({}, function (error, res) {
        _this.getOrgRepos(res);
      });
    },
    getOrgRepos: function (res) {
      var _this = this;
      _.forEach(res, function (org) {
        var organization = {
          organization: org
        };
        app.github.repos.getFromOrg({'org': org.login, 'type': 'all'}, function (error, res) {
          _.forEach(res, function (repo) {
            _.extend(repo, organization);
            _this.add(repo);
          });
        });
      });
    }
  });

  return new RepoCollection();
});
