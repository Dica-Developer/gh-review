define(['lodash'], function (_) {
    'use strict';

    return [
        '$scope',
        '$q',
        '$stateParams',
        'commentProvider',
        'commitProvider',
        function ($scope, $q, $stateParams, commentProvider, commitProvider) {
            var tmpCommit;
            var addLineCommentsToFile = function (commit, comments) {
                var lineComments = comments.comments.lineComments;
                _.each(lineComments, function (comment) {
                    var path = comment.path;
                    var file = _.findWhere(commit.files, {name: path});
                    if (file) {
                        var commentPosition = file.lines.lines[comment.position];
                        if (!commentPosition.comments) {
                            commentPosition.comments = [];
                        }
                        commentPosition.comments.push(comment);
                    }
                });
            };

            $q.all([commitProvider.getPreparedCommit($stateParams), commentProvider.getCommentsForCommit($stateParams)])
                .then(function (args) {
                    var commit;
                    var comments;
                    if (args[0].commitInfos) {
                        commit = args[0];
                        comments = args[1];
                    } else {
                        commit = args[1];
                        comments = args[0];
                    }

                    tmpCommit = commit;
                    addLineCommentsToFile(commit, comments);
                    $scope.commit = commit.commitInfos;
                    $scope.files = commit.files;
                    $scope.approvers = comments.approvers;
                    $scope.comments = comments.comments;
                });

//            $scope.$on('commentCollector.notification.newData', start);
        }
    ];
});