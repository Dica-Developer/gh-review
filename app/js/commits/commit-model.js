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
          user: _this.get('user'),
          repo: _this.get('repo'),
          sha: _this.get('sha')
        }, function(error, res){
          _this.set('diff', res);
          defer.resolve();
        });
      } else {
        defer.resolve();
      }

      return defer.promise;
    }
  });

  return CommitsModel;
});
