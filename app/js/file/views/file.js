/*global define*/
define(function (require) {
  'use strict';

  var Backbone = require('backbone');
  var _ = require('underscore');
  var app = require('app');
  var template = require('text!fileTemplates/file.html');
  var Chunk = require('chunk');
  var when = require('when');
  var CommentBoxes = require('commentBox');
  var EditCommentBox = CommentBoxes.edit;
  var CommitModel = require('commitModel');

  return Backbone.View.extend({
    historyColorRange: ['#67000d', '#a50f15', '#cb181d', '#ef3b2c', '#fb6a4a', '#fc9272', '#fcbba1', '#fee0d2', '#fff5f0'],
    commitHistory: [],
    el: '#main',
    commentBox: null,
    template: _.template(template),
    lines: [],
    commitModel: {},
    initialize: function () {
      this.lines = [];
      this.commitModel = {};
      this.commitHistory = [];
    },
    events: {
      'click .commentable': 'commentLine'
    },
    commentLine: function (event) {
      var tr = $(event.target).closest('tr');
      if (this.commentBox) {
        this.commentBox.remove();
      }
      var model = this.commitModel[tr.data('line')];
      model.user = this.model.user;
      model.repo = this.model.repo;
      this.commentBox = new EditCommentBox({
        model: model,
        tr: tr,
        position: tr.data('lineInPatch'),
        fileIndex: tr.data('fileindex')
      });
    },
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
          var fileIndex = 0;
          commitWithDiff.files.forEach(function (fileInList, idx) {
            if (_this.model.path === fileInList.filename) {
              file = fileInList;
              fileIndex = idx;
            }
          });
          if (file && _.has(file, 'patch')) {
            _this.commitHistory.unshift(commitWithDiff.sha);
            var lines = _.str.lines(file.patch);
            var lineNumberInPatch = 0;
            lines.forEach(function (line) {
              if (chunk.isMatchingChunkHeading(line)) {
                lineNumber = chunk.extractChunk(line).rightNr;
              } else {
                if (chunk.isDeletion(line)) {
                  _this.lines.splice((lineNumber - 1), 1);
                } else if (chunk.isAddition(line)) {
                  commitWithDiff.fileIndex = fileIndex;
                  _this.lines.splice((lineNumber - 1), 0, { commit: commitWithDiff, lineInPatch: lineNumberInPatch});
                  lineNumber++;
                } else if (chunk.isSame(line)) {
                  lineNumber++;
                }
              }
              lineNumberInPatch++;
              _this.fillUpMissingLines(lineNumber);
            });
          } else {
            $('div[name="uncompleteDiffWarning"]').show();
          }
          if (commits.length > 0) {
            _this.annotateLines(commits);
          } else {
            _this.lines.forEach(function (commit, lineNumber) {
              var commitDescEncoded = '&nbsp;';
              var commitTitle = '';
              if (null !== commit && undefined !== commit) {
                $('#line_' + (lineNumber + 1) + '_color').css('background-color', _this.historyColorRange[_this.commitHistory.indexOf(commit.commit.sha)]);
                commitDescEncoded = '<a href="#commit/' + encodeURIComponent(_this.model.user) + '/' + encodeURIComponent(_this.model.repo) + '/' + encodeURIComponent(commit.commit.sha) + '">' + _.escape(commit.commit.sha.substr(0, 8)) + '</a>';
                commitTitle = 'commited at ' + commit.commit.commit.author.date + ' by ' + commit.commit.commit.author.name + '(' + commit.commit.commit.author.email + ')';
                $('#line_' + (lineNumber + 1)).addClass('commentable');
                $('#line_' + (lineNumber + 1)).data('fileindex', commit.commit.fileIndex);
                $('#line_' + (lineNumber + 1)).data('lineInPatch', commit.lineInPatch);
                _this.commitModel[(lineNumber + 1)] = new CommitModel({
                  commit: commit.commit,
                  diff: commit.commit,
                  sha: commit.commit.sha
                });
              }
              $('#line_' + (lineNumber + 1)).attr('data-path', _this.model.path);
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
