define(['angular', 'lodash'], function (angular, _) {
  'use strict';
  var services = angular.module('GHReview.Comment', []);
  services.factory('Comment', ['$q', '$rootScope', 'github',
    function ($q, $rootScope, github) {

      function Comment(options) {
        if (!options.mode) {
          options.mode = 'show';
        }
        _.extend(this, options);
      }

      Comment.prototype.preview = function () {
        var githubCallback = function (error, response) {
          if (!error) {
            this.mode = 'preview';
            /*jshint camelcase:false*/
            this.body_html = response.data;
            $rootScope.$apply();
          }
        }.bind(this);

        github.markdown.render({
          /*jshint camelcase:false*/
          text: this.body_text,
          mode: 'gfm'
        }, githubCallback);
      };

      Comment.prototype.save = function () {

        var githubCallback = function (error, result) {

          if (!error) {
            _.extend(this, result);
            this.mode = 'show';
            $rootScope.$apply();
          } else {
            console.log(error);
          }
        }.bind(this);

        github.repos.createCommitComment({
          user: this.editInformations.user,
          repo: this.editInformations.repo,
          sha: this.sha,
          /*jshint camelcase:false*/
          body: this.body_text,
          path: this.path,
          position: this.position,
          line: this.line,
          headers: {
            'Accept': 'application/vnd.github-commitcomment.html+json'
          }
        }, githubCallback);
      };

      Comment.prototype.remove = function () {
        var githubCallback = function (error) {
          if (!error) {
            console.log('Comment succesfully removed.');
          } else {
            console.log(error);
          }
        }.bind(this);

        github.repos.deleteCommitComment({
          user: this.editInformations.user,
          repo: this.editInformations.repo,
          id: this.id
        }, githubCallback);
      };

      Comment.prototype.edit = function () {
        var githubCallback = function (error, res) {
          if (!error) {
            this.mode = 'edit';
            _.extend(this, res);
            $rootScope.$apply();
          }
        }.bind(this);
        github.repos.getCommitComment({
          user: this.editInformations.user,
          repo: this.editInformations.repo,
          id: this.id
        }, githubCallback);
      };

      Comment.prototype.saveChanges = function () {
        var githubCallback = function (error, res) {
          if (!error) {
            console.log(res);
            //                    this.mode = 'edit';
            //                    this.content = res.body;
            //                    $rootScope.$apply();
          }
        }.bind(this);
        github.repos.updateCommitComment({
          user: this.editInformations.user,
          repo: this.editInformations.repo,
          id: this.id,
          body: this.content
        }, githubCallback);
      };

      return Comment;
    }
  ]);
});
