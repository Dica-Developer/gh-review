define(['lodash', 'controllers'], function (_, controllers) {
    'use strict';


    controllers
        .controller('CommitController', [
            '$scope',
            '$stateParams',
            'commitsAndComments',
            'Comment',
            function ($scope, $stateParams, commitsAndComments, Comment) {
                var commit = commitsAndComments[0].commitInfos ? commitsAndComments[0] : commitsAndComments[1],
                    comments = commitsAndComments[0].commitInfos ? commitsAndComments[1] : commitsAndComments[0],
                    lineWithNewComment = [], lineComments = comments.comments.lineComments;

                var removeCommentFromScope = function(){
                    _.remove(lineWithNewComment, function(comment){
                        /*jshint camelcase:false*/
                        return comment.mode === 'edit' || _.isUndefined(comment.body_html);
                    });
                };

                $scope.commitHeaderStatus = {
                    open: false
                };
                $scope.commit = commit.commitInfos;
                $scope.files = commit.files;
                $scope.approvers = comments.approvers;
                $scope.comments = comments.comments;
                $scope.addComment = function ($event, line/*, file, commit*/) {
                    removeCommentFromScope();
                    line.comments = line.comments || [];
                    lineWithNewComment = line.comments;

                    line.comments.push(new Comment({
                        mode: 'edit',
                        position: line.position,
                        line: line.lineNrLeft || line.lineNrRight,
                        sha: $stateParams.sha,
                        path: line.path,
                        editInformations: {
                            repo: $stateParams.repo,
                            user: $stateParams.user
                        }
                    }));
                };

                $scope.removeComment = function (line, commentToRemove) {
                    commentToRemove.remove();
                    _.remove(line.comments, function(comment){
                        return comment.id === commentToRemove.id;
                    });
                };
                $scope.cancelAddComment = function () {
                    removeCommentFromScope();
                };


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