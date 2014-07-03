define(['lodash', 'controllers'], function (_, controllers) {
    'use strict';

    controllers
        .controller('CommitController', [
            '$scope',
            'commitsAndComments',
            function ($scope, commitsAndComments) {

                var commit = commitsAndComments[0].commitInfos ? commitsAndComments[0] : commitsAndComments[1],
                    comments = commitsAndComments[0].commitInfos ? commitsAndComments[1] : commitsAndComments[0],
                    lineComments = comments.comments.lineComments;

                $scope.commit = commit.commitInfos;
                $scope.files = commit.files;
                $scope.approvers = comments.approvers;
                $scope.comments = comments.comments;

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
            }
        ]);
});