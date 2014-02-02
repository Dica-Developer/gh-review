/*global define*/
define(['backbone', 'when', 'app'], function (Backbone, when, app) {
  'use strict';
  var RepoModel = Backbone.Model.extend({
    initialize: function () {
      this.user = this.get('owner').login;
      this.repo = this.get('name');
    },
    getBranches: function () {
      var defer = when.defer(),
        _this = this;
      if (this.get('branches')) {
        defer.resolve();
      } else {
        app.github.getRepoBranches({
          user: this.user,
          repo: this.repo
        }, function (error, res) {
          _this.set('branches', res);
          defer.resolve();
        });
      }
      return defer.promise;
    },
    getContributors: function () {
      var defer = when.defer(),
        _this = this;
      if (this.get('contributors')) {
        defer.resolve();
      } else {
        app.github.getRepoContributors({
          user: this.user,
          repo: this.repo
        }, function (error, res) {
          _this.set('contributors', res);
          defer.resolve();
        });
      }
      return defer.promise;
    }
  });

  return RepoModel;
});
