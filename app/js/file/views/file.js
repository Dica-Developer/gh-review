/*global define*/
define(function (require) {
  'use strict';

  var Backbone = require('backbone');
  var _ = require('underscore');
  var app = require('app');
  var template = require('text!fileTemplates/file.html');
  var Chunk = require('chunk');
  var when = require('when');

  return Backbone.View.extend({
    el: '#main',
    template: _.template(template),
    initialize: function () {},
    annotateLines: function (commits) {
      var _this = this;
      var chunk = new Chunk();
      _.forEach(commits, function (commit) {
        app.github.repos.getCommit({
          sha: commit.sha,
          user: _this.model.user,
          repo: _this.model.repo
        }, function (error, commitWithDiff) {
          if (!error) {
            var lineNumber = -1;
            // TODO use the file with the correct name
            var lines = _.str.lines(commitWithDiff.files[0].patch);
            _.forEach(lines, function (line) {
              if (chunk.isMatchingChunkHeading(line)) {
                lineNumber = chunk.extractChunk(line).rightNr;
              } else {
                if (chunk.isAddition(line)) {
                  if ($('#line_' + lineNumber + '_sha').text().trim() === '') {
                    $('#line_' + lineNumber + '_sha').text(commitWithDiff.sha.substr(0, 8));
                  }
                  lineNumber++;
                } else if (chunk.isSame(line)) {
                  lineNumber++;
                }
              }
            });
          } else {}
        });
      });
    },
    render: function () {
      var _this = this;
      try {
        var deferred = when.defer();

        app.github.repos.getContent({
          headers: {
            'accept': 'application/vnd.github.v3.raw'
          },
          user: _this.model.user,
          repo: _this.model.repo,
          path: _this.model.path
        }, function (error, result) {
          if (!error) {
            _this.$el.html(_this.template({
              content: result.data
            }));
            deferred.resolve();
          } else {
            deferred.reject(error);
          }
        });

        app.github.repos.getCommits({
          headers: [],
          path: _this.model.path,
          user: _this.model.user,
          repo: _this.model.repo
        }, function (error, commits) {
          if (!error) {
            // TODO implement paging
            deferred.promise.then(function () {
              // TODO start with the oldest and write only additions
              _this.annotateLines(commits);
            });
          } else {
            // TODO handle error
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
  });
});
