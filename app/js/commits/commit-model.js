/*global define*/
define(['backbone', 'app', 'when'], function(Backbone, app, when){
  'use strict';
  var CommitsModel = Backbone.Model.extend({
    initialize: function(){},
    getDiff: function(){
      var defer = when.defer(),
        _this = this;
      if(!this.get('diff')){
        app.github.repos.getCommit({
          user: app.currentReviewData.user,
          repo: app.currentReviewData.repo,
          sha: _this.get('sha')
        }, function(error, res){
          _this.set('diff', res);
          defer.resolve();
        });
      } else {
        defer.resolve();
      }

      return defer.promise;
    },
    addLineComment: function(fileIndex, position, comment){
      var diff = this.get('diff');
      var files = diff.files;
      var file = files[fileIndex];
      app.github.repos.createCommitComment({
        user: this.get('user'),
        repo: this.get('repo'),
        sha: this.get('sha'),
        body: comment,
        /* jshint camelcase:false */
        commit_id: file.sha,
        path: file.filename,
        position: position
      }, function(error, resp){
        console.log(error, resp);
      });
    }
  });

  return CommitsModel;
});
