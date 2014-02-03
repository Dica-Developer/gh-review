/*global define*/
define(['backbone', 'app'], function (Backbone, app) {
  'use strict';

  var UserModel = Backbone.Model.extend({
    initialize: function () {
      app.on('ready', this.getUserData, this);
    },
    getUserData: function () {
      var _this = this;
      app.github.user.get({}, function (error, res) {
        console.log(res);
        _this.set(res);
      });
    }
  });

  return new UserModel();
});
