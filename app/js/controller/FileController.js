define(['lodash', 'controllers'], function (_, controllers) {
    'use strict';
    controllers
        .controller('FileController', [
            '$scope',
            '$q',
            '$stateParams',
            'fileContent',
            'commits',
            'Chunk',
            function ($scope, $q, $stateParams, fileContent, commits, Chunk) {

                var filePath = $stateParams.path,
                    filePathSplit = filePath.split('.'),
                    fileExtension = _.last(filePathSplit),
                    colors = {},
                    fileContentSplit = _.str.lines(fileContent),
                    splicedFileContent = [],
                    commitLength = 0,
                    alreadyUsedColors = [];


                $scope.languages = [
                    {display: 'JavaScript', value: 'js', hljs: 'javascript'},
                    {display: 'Java', value: 'java', hljs: 'java'},
                    {display: 'XML', value: 'xml', hljs: 'xml'},
                    {display: 'HTML', value: 'html', hljs: 'html'},
                    {display: 'Bash/Shell', value: 'sh', hljs: 'bash'}
                ];

                var languageIndex = _.findIndex($scope.languages, {value: fileExtension});
                $scope.suggestedLanguage = $scope.languages[languageIndex];


                $scope.themes = [
                    {display: 'Github', value: 'github'},
                    {display: 'Solarized Dark', value: 'solarized-dark'},
                    {display: 'Solarized Light', value: 'solarized-light'},
                    {display: 'Monokai', value: 'monokai'}
                ];
                $scope.highlightTheme = $scope.themes[0];


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

                        commits.bySha({
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
                                    var intLines = _.str.lines(file.patch);
                                    var lineNumberInPatch = 0;
                                    _.each(intLines, function (line) {
                                        if (chunk.isMatchingChunkHeading(line)) {
                                            lineNumber = chunk.extractChunk(line).rightNr;
                                        } else {
                                            if (chunk.isDeletion(line)) {
                                                lines.splice((lineNumber - 1), 1);
                                            } else if (chunk.isAddition(line)) {
                                                commitWithDiff.fileIndex = fileIndex;
                                                lines.splice((lineNumber - 1), 0, { commit: commitWithDiff, lineInPatch: lineNumberInPatch});
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
                                    defer.notify({progress: percentComplete, alreadyFetched: commitHistory.length});
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
                    sha: $stateParams.ref
                };
                commits.byPath(msg)
                    .then(startAnnotateLines)
                    .then(
                    //Success
                    function () {
                        $scope.splicedFileContent = splicedFileContent;
                        //Todo done message
                        $scope.progressMessage = 'Done';
                        $scope.progressType = 'success';
                        $scope.progress = '100';
                    },
                    //Error
                    function () {
                        //Todo error message
                        $scope.progressMessage = 'Error';
                        $scope.progressType = 'danger';
                    },
                    //Progress
                    function (progressObject) {
                        $scope.progressMessage = 'Fetching ' + progressObject.alreadyFetched + ' of ' + commitLength + ' commits.';
                        $scope.progressType = 'warning';
                        $scope.progress = progressObject.progress;
                    });

            }
        ]);
});