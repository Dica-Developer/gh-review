(function (angular) {
  'use strict';
  angular.module('GHReview')
    .controller('FileController', [
      '$scope',
      '$q',
      '$log',
      '$stateParams',
      '_',
      'moment',
      'fileContent',
      'ghCommits',
      'Chunk',
      'commentProvider',
      'userPref',
      function ($scope, $q, $log, $stateParams, _, moment, fileContent, ghCommits, Chunk, commentProvider, userPref) {

        var filePath = $stateParams.path,
          filePathSplit = filePath.split('.'),
          fileExtension = _.last(filePathSplit),
          colors = {},
          fileContentSplit = fileContent.split(/\r?\n/),
          splicedFileContent = [],
          commitLength = 0,
          alreadyUsedColors = [],
          comments = {},
          fileViewSettings = userPref.getFileView(),
          themeOptionIndex = 0;

        $scope.comments = {};
        $scope.showComments = false;

        $scope.languages = [{
          display: 'Unknown',
          value: 'unknown',
          hljs: ''
        }, {
          display: 'CSS',
          value: 'css',
          hljs: 'css'
        }, {
          display: 'Less',
          value: 'less',
          hljs: 'less'
        }, {
          display: 'JavaScript',
          value: 'js',
          hljs: 'javascript'
        }, {
          display: 'JSON',
          value: 'json',
          hljs: 'json'
        }, {
          display: 'Java',
          value: 'java',
          hljs: 'java'
        }, {
          display: 'XML',
          value: 'xml',
          hljs: 'xml'
        }, {
          display: 'HTML',
          value: 'htm',
          hljs: 'html'
        }, {
          display: 'HTML',
          value: 'html',
          hljs: 'html'
        }, {
          display: 'Bash/Shell',
          value: 'sh',
          hljs: 'bash'
        }];

        var languageIndex = _.findIndex($scope.languages, {
          value: fileExtension
        });
        if (languageIndex > -1) {
          $scope.suggestedLanguage = $scope.languages[languageIndex];
        } else {
          $scope.suggestedLanguage = $scope.languages[0];
        }

        $scope.themes = [{
          display: 'Github',
          value: 'github'
        }, {
          display: 'Solarized Dark',
          value: 'solarized-dark'
        }, {
          display: 'Solarized Light',
          value: 'solarized-light'
        }, {
          display: 'Monokai',
          value: 'monokai'
        }];

        if (fileViewSettings && fileViewSettings.highlightTheme) {
          themeOptionIndex = _.findIndex($scope.themes, {'value': fileViewSettings.highlightTheme});
        }

        $scope.highlightTheme = $scope.themes[themeOptionIndex];

        $scope.$watch('highlightTheme', function () {
          userPref.setFileView('highlightTheme', $scope.highlightTheme.value);
        });


        _.each(fileContentSplit, function (value, index) {
          var object = {
            lineIndex: index,
            content: value
          };
          splicedFileContent.push(object);
        });
        $scope.splicedFileContent = splicedFileContent;
        $scope.showUncompleteDiffWarning = false;

        $scope.highlightSameSha = function (sha) {
          _.each(splicedFileContent, function (line) {
            line.highlight = '';
            if (sha === line.sha) {
              line.highlight = 'highlight';
            }
          });
          $scope.splicedFileContent = splicedFileContent;
        };

        function getCommentForCommit(propertiesNeededForCommitView) {
          commentProvider.getCommentsForCommitWithoutApprovers(propertiesNeededForCommitView)
            .then(function (res) {
              if (res && res.lineComments.length > 0) {
                res.lineComments.forEach(function (comment) {
                  /*jshint camelcase:false*/
                  if (!$scope.comments[comment.line + '-' + comment.commit_id]) {
                    $scope.comments[comment.line + '-' + comment.commit_id] = [];
                  }
                  $scope.comments[comment.line + '-' + comment.commit_id].push(comment);
                });
              }
            }, function (err) {
              //TODO
              $log.log(err);
            });
        }

        var path, //TODO this.model.path
          commitHistory = [],
          lines = [],
          randomColor = function () {
            var color = 'hsl(' + Math.random() * 360 + ',100%,60%)';

            if (_.indexOf(alreadyUsedColors, color) > -1) {
              return randomColor();
            } else {
              return color;
            }
          },
          fillUpMissingLines = function (lineNumbers) {
            if (lines.length < lineNumbers) {
              lines.push(null);
            }
          };

        var startAnnotateLines = function (responseCommits) {
          var defer = $q.defer();
          var chunk = new Chunk();
          commitLength = responseCommits.length;

          var annotateLines = function (responseCommits) {

            ghCommits.bySha({
              sha: responseCommits.pop().sha,
              user: $stateParams.user,
              repo: $stateParams.repo
            })
              .then(function (commitWithDiff) {
                var lineNumber = -1;
                var file = null;
                var fileIndex = 0;
                _.each(commitWithDiff.files, function (fileInList, idx) {
                  if ($stateParams.path === fileInList.filename) {
                    file = fileInList;
                    fileIndex = idx;
                  }
                });
                if (file && _.has(file, 'patch')) {
                  commitHistory.unshift(commitWithDiff.sha);
                  var intLines = file.patch.split(/\r?\n/);
                  var lineNumberInPatch = 0;
                  _.each(intLines, function (line) {
                    if (chunk.isMatchingChunkHeading(line)) {
                      lineNumber = chunk.extractChunk(line).rightNr;
                    } else {
                      if (chunk.isDeletion(line)) {
                        lines.splice((lineNumber - 1), 1);
                      } else if (chunk.isAddition(line)) {
                        commitWithDiff.fileIndex = fileIndex;
                        lines.splice((lineNumber - 1), 0, {
                          commit: commitWithDiff,
                          lineInPatch: lineNumberInPatch
                        });
                        lineNumber++;
                      } else if (chunk.isSame(line)) {
                        lineNumber++;
                      }
                    }
                    lineNumberInPatch++;
                    fillUpMissingLines(lineNumber);
                  });
                } else {
                  $scope.showUncompleteDiffWarning = true;
                }
                if (responseCommits.length > 0) {
                  var percentComplete = Math.floor(commitHistory.length / commitLength * 100);
                  defer.notify({
                    progress: percentComplete,
                    alreadyFetched: commitHistory.length
                  });
                  annotateLines(responseCommits);
                } else {
                  lines.forEach(function (commit, lineNumber) {
                    //file could be greater at some point as latest state
                    if (splicedFileContent[lineNumber]) {
                      var linkString = '';
                      var commitTitle = '';
                      if (null !== commit && undefined !== commit) {
                        splicedFileContent[lineNumber].sha = commit.commit.sha;
                        if (_.isUndefined(colors[commit.commit.sha])) {
                          colors[commit.commit.sha] = randomColor();
                        }

                        splicedFileContent[lineNumber].color = colors[commit.commit.sha];
                        var propertiesNeededForCommitView = {
                          user: $stateParams.user,
                          repo: $stateParams.repo,
                          sha: commit.commit.sha
                        };
                        if (_.isUndefined(comments[commit.commit.sha])) {
                          comments[commit.commit.sha] = true;
                          getCommentForCommit(propertiesNeededForCommitView);
                        }
                        linkString = _.escape(commit.commit.sha.substr(0, 8));
                        commitTitle = 'commited at ' + commit.commit.commit.author.date + ' by ' + commit.commit.commit.author.name + '(' + commit.commit.commit.author.email + ')';
                        splicedFileContent[lineNumber].commentable = true;
                        splicedFileContent[lineNumber].fileindex = commit.commit.fileIndex;
                        splicedFileContent[lineNumber].lineInPatch = commit.lineInPatch;
                        splicedFileContent[lineNumber].propertiesNeededForCommitView = propertiesNeededForCommitView;
                      }
                      splicedFileContent[lineNumber].path = path;
                      splicedFileContent[lineNumber].linkString = linkString;
                      splicedFileContent[lineNumber].linkTitle = commitTitle;
                    }
                  });
                  defer.resolve();
                }
              });
          };
          annotateLines(responseCommits);
          return defer.promise;
        };

        var msg = {
          user: $stateParams.user,
          repo: $stateParams.repo,
          path: $stateParams.path,
          sha: $stateParams.sha
        };
        ghCommits.byPath(msg)
          .then(startAnnotateLines)
          .then(
          //Success
          function () {
            $scope.splicedFileContent = splicedFileContent;
            //Todo done message
            $scope.statusMessage = '';
            $scope.progress = '100';
          },
          //Error
          function () {
            //Todo error message
            $scope.statusMessage = 'Error';
          },
          //Progress
          function (progressObject) {
            $scope.statusMessage = 'Fetching ' + progressObject.alreadyFetched + ' of ' + commitLength + ' commits.';
            $scope.progress = progressObject.progress;
          });

      }
    ]);
}(angular));