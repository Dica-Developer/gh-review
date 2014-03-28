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
    fillUpMissingLines: function (lineNumbers) {
      if (this.lines.length < lineNumbers) {
        this.lines.push(null);
      }
    },
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
          if (file && _.has(file, 'patch')) {
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
              _this.fillUpMissingLines(lineNumber);
            });
          } else {
            $('div[name="uncompleteDiffWarning"]').show();
          }
          if (commits.length > 0) {
            _this.annotateLines(commits);
          } else {
            _this.lines.forEach(function (commit, lineNumber) {
              var commitDescEncoded = '';
              var commitTitle = '';
              if (null !== commit && undefined !== commit) {
                commitDescEncoded = '<a href="#commit/' + encodeURIComponent(_this.model.user) + '/' + encodeURIComponent(_this.model.repo) + '/' + encodeURIComponent(commit.sha) + '">' + _.escape(commit.sha.substr(0, 8)) + '</a>';
                commitTitle = 'commited at ' + commit.commit.author.date + ' by ' + commit.commit.author.name + '(' + commit.commit.author.email + ')';
              }
              $('#line_' + (lineNumber + 1) + '_sha').html(commitDescEncoded);
              $('#line_' + (lineNumber + 1) + '_sha').attr('title', commitTitle);
            });
          }
        } else {
          // TODO handle error
        }
      });
    },
    render: function () {
      var _this = this;
      this.lines = [];
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
