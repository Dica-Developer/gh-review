/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'repoModel'
], function(Backbone, _, app, repoModel){
  'use strict';

  var RepoCollection = Backbone.Collection.extend({
    model: repoModel,
    localStorage: new Backbone.LocalStorage('repos'),
    initialize: function(){
      this.fetch();
      app.on('ready', this.getRepos, this);
    },
    getRepos: function(){
      var _this = this;
      app.github.repos.getAll({}, function(error, res){
        _.forEach(res, function(repo){
          var alreadyExist = _this.findWhere(repo);
          if(!alreadyExist){
            _this.create(repo);
          }else if(!_.isEqual(alreadyExist, repo)){
            alreadyExist.set(repo);
            _this.sync('update', alreadyExist);
          }
        });
      });

      app.github.user.getOrgs({}, function(error, res){
        _this.getOrgRepos(res);
      });
    },
    getOrgRepos: function(res){
      var _this = this;
      _.forEach(res, function(org){
        var organization = {
          organization: org
        };
        app.github.repos.getFromOrg({'org': org.login, 'type':'all'}, function(error, res){
          _.forEach(res, function(repo){
            _.extend(repo, organization);
            var alreadyExist = _this.findWhere({id: repo.id});
            if(!alreadyExist){
              _this.create(repo);
            }else if(!_.isEqual(alreadyExist, repo)){
              alreadyExist.set(repo);
              _this.sync('update', alreadyExist);
            }
          });
        });
      });
    }
  });

  return new RepoCollection();
});
