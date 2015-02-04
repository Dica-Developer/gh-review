(function (angular) {
  'use strict';

  angular.module('GHReview')
    .service('ghComments', ['$q', 'github',
      function ($q, github) {

        this.getForCommit = function (params) {
          var defer = $q.defer();
          github.repos.getCommitComments({
            user: params.user,
            repo: params.repo,
            sha: params.sha,
            headers: {
              'Accept': 'application/vnd.github-commitcomment.full+json'
            }
          }, function (error, res) {
            if (error) {
              defer.reject(error);
            } else {
              if (res.meta) {
                delete res.meta;
              }
              defer.resolve(res);
            }
          });
          return defer.promise;
        };

        this.addCommitComment = function (sha, user, repo, comment) {
          var defer = $q.defer();
          github.repos.createCommitComment({
            user: user,
            repo: repo,
            sha: sha,
            body: comment,
            headers: {
              'Accept': 'application/vnd.github-commitcomment.full+json'
            }
          }, function (error, comment) {
            if (!error) {
              defer.resolve(comment);
            } else {
              defer.reject(error);
            }
          });
          return defer.promise;
        };

        this.addLineComment = function (sha, user, repo, line, position, path, comment) {
          var defer = $q.defer();
          github.repos.createCommitComment({
            user: user,
            repo: repo,
            sha: sha,
            line: line,
            position: position,
            path: path,
            body: comment,
            headers: {
              'Accept': 'application/vnd.github-commitcomment.full+json'
            }
          }, function (error, comment) {
            if (!error) {
              defer.resolve(comment);
            } else {
              defer.reject(error);
            }
          });
          return defer.promise;
        };

        this.deleteComment = function (user, repo, commentId) {
          var defer = $q.defer();
          github.repos.deleteCommitComment({
            user: user,
            repo: repo,
            id: commentId
          }, function (error) {
            if(error){
              defer.reject(error);
            } else {
              defer.resolve();
            }
          });
          return defer.promise;
        };

        this.updateComment = function (user, repo, commentId, comment) {
          var defer = $q.defer();
          github.repos.updateCommitComment({
            user: user,
            repo: repo,
            id: commentId,
            body: comment,
            headers: {
              'Accept': 'application/vnd.github-commitcomment.full+json'
            }
          }, function(error, comment){
            if(error){
              defer.reject(error);
            } else {
              defer.resolve(comment);
            }
          });
          return defer.promise;
        };

        this.renderAsMarkdown = function (text) {
          var defer = $q.defer();
          github.markdown.render({
            text: text,
            mode: 'gfm'
          }, function (error, comment) {
            if (error) {
              defer.reject(error);
            } else {
              defer.resolve(comment);
            }
          });
          return defer.promise;
        };
      }
    ]);

}(angular));
