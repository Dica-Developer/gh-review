/*global define*/
define(['backbone', 'when', 'app'], function (Backbone, when, app) {
  'use strict';

  var UserModel = Backbone.Model.extend({
    initialize: function () {
    },
    getUserData: function () {
      var defer = when.defer();
      var _this = this;
      app.github.user.get({}, function (error, res) {
        if (error) {
          defer.reject(error);
        } else {
          _this.handleResponse(res);
          defer.resolve(res);
        }
      });
      return defer.promise;
    },
    handleResponse: function (res) {
      this.set(res);
    }
  });

  return UserModel;
});