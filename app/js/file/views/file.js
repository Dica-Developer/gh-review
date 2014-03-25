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
    lines: [],
    initialize: function () {},
    annotateLinesPre: function (commits) {
      this.annotateLines(commits);
    },
    annotateLines: function (commits) {
      var _this = this;
      var chunk = new Chunk();

      app.github.repos.getCommit({
        sha: commits.pop().sha,
        user: _this.model.user,
        repo: _this.model.repo
      }, function (error, commitWithDiff) {
        if (!error) {
          var lineNumber = -1;
          var file = null;
          commitWithDiff.files.forEach(function (fileInList) {
            if (_this.model.path === fileInList.filename) {
              file = fileInList;
            }
          });
          var lines = _.str.lines(file.patch);
          lines.forEach(function (line) {
            if (chunk.isMatchingChunkHeading(line)) {
              lineNumber = chunk.extractChunk(line).rightNr;
            } else {
              if (chunk.isDeletion(line)) {
                _this.lines.splice((lineNumber - 1), 1);
              } else if (chunk.isAddition(line)) {
                _this.lines.splice((lineNumber - 1), 0, commitWithDiff);
                lineNumber++;
              } else if (chunk.isSame(line)) {
                lineNumber++;
              }
            }
          });
          if (commits.length > 0) {
            _this.annotateLines(commits);
          } else {
            _this.lines.forEach(function (commit, lineNumber) {
              $('#line_' + (lineNumber + 1) + '_sha').text(commit.sha.substr(0, 8) + ' ' + commit.commit.author.date);
            });
          }
        } else {
          // TODO handle error
        }
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
              _this.annotateLinesPre(commits);
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
