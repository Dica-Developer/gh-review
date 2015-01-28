(function (angular) {
  'use strict';
  angular.module('GHReview')
    .factory('Comment', ['$q', '$rootScope', '$log', 'github', '_',
      function ($q, $rootScope, $log, github, _) {

        function Comment(options) {
          if (!options.mode) {
            options.mode = 'show';
          }
          _.extend(this, options);
        }

        Comment.prototype.preview = function () {
          var githubCallback = function (error, response) {
            if (!error) {
              /*jshint camelcase:false*/
              this.preview_html = response.data;
              this.mode = 'preview';
              $rootScope.$apply();
            }
          }.bind(this);

          github.markdown.render({
            /*jshint camelcase:false*/
            text: this.edit_text,
            mode: 'gfm'
          }, githubCallback);
        };

        Comment.prototype.createComment = function () {

          var githubCallback = function (error, result) {

            if (!error) {
              result.mode = 'show';
              _.extend(this, result);
              $rootScope.$apply();
            } else {
              $log.log(error);
            }
          }.bind(this);

          github.repos.createCommitComment({
            user: this.editInformations.user,
            repo: this.editInformations.repo,
            sha: this.sha,
            /*jshint camelcase:false*/
            body: this.edit_text,
            path: this.path,
            position: this.position,
            line: this.line,
            headers: {
              'Accept': 'application/vnd.github-commitcomment.full+json'
            }
          }, githubCallback);
        };

        Comment.prototype.remove = function () {
          var defer = $q.defer();
          var githubCallback = function (error) {
            if (!error) {
              defer.resolve();
              $log.log('Comment succesfully removed.');
            } else {
              defer.reject();
              $log.log(error);
            }
          };

          github.repos.deleteCommitComment({
            user: this.editInformations.user,
            repo: this.editInformations.repo,
            id: this.id
          }, githubCallback);

          return defer.promise;
        };

        Comment.prototype.edit = function () {
          this.mode = 'edit';
          /*jshint camelcase:false*/
          this.edit_text = this.body_text;
        };

        Comment.prototype.continueEditing = function () {
          this.mode = 'edit';
        };

        Comment.prototype.cancelEdit = function () {
          this.mode = 'show';
          /*jshint camelcase:false*/
          this.edit_text = '';
        };

        Comment.prototype.save = function () {
          var githubCallback = function (error, res) {
            if (!error) {
              res.mode = 'show';
              /*jshint camelcase:false*/
              _.extend(this, res);
              $rootScope.$apply();
            }
          }.bind(this);
          github.repos.updateCommitComment({
            user: this.editInformations.user,
            repo: this.editInformations.repo,
            id: this.id,
            /*jshint camelcase:false*/
            body: this.edit_text,
            headers: {
              'Accept': 'application/vnd.github-commitcomment.full+json'
            }
          }, githubCallback);
        };

        Comment.prototype.shouldShowEditButton = function () {
          return this.mode === 'show';
        };

        return Comment;
      }
    ]);
}(angular));
