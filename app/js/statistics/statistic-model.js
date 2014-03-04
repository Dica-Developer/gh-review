/*global define*/
define(['backbone', 'when', 'underscore', 'app', 'moment'], function (Backbone, when, _, app, moment) {
  'use strict';

  return Backbone.Model.extend({
    defaults: {
      since: moment().subtract('weeks', 2).toISOString(),
      commits: [],
      commentedCommits: []
    },
    getCommitDefer: when.defer(),
    nextPage: true,
    getCommits: function (link) {
      var callback = function (error, resp) {
        if (!error) {
          var link = resp.meta.link;
          var hasNext = app.github.hasNextPage(link);
          var commits = this.get('commits');
          delete resp.meta;
          var concatenatedArray = commits.concat(resp);
          this.set('commits', concatenatedArray);
          if (hasNext) {
            this.getCommits(link);
          } else {
            this.getCommitDefer.resolve();
          }
        }
      }.bind(this);
      if (!link) {
        app.github.repos.getCommits({
          user: this.get('owner'),
          repo: this.get('repo'),
          branch: this.get('branch'),
          since: this.get('since'),
          'per_page': 100
        }, callback);
      } else {
        app.github.getNextPage(link, callback);
      }
      return this.getCommitDefer.promise;
    },
    computeStatistics: function () {
      var defer = when.defer();
      this.getCommits()
        .then(function () {
          defer.resolve();
        }.bind(this));
      return defer.promise;
    }
  });

});