/*global define*/
define(['backbone', 'app'], function (Backbone, app) {
  'use strict';

  var UserModel = Backbone.Model.extend({
    initialize: function () {
      app.on('ready', this.getUserData, this);
    },
    getUserData: function () {
      var _this = this;
      app.github.user.get({}, function(error, res){
        _this.handleResponse(error, res);
      });
    },
    handleResponse: function (error, res) {
      this.set(res);
      app.user = res;
    }
  });

  return UserModel;
});
