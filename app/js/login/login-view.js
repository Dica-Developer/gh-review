/*global define*/
define([
  'backbone',
  'underscore',
  'app',
  'moment'
], function (Backbone, _, app) {
  'use strict';

  var LoginView = Backbone.View.extend({
    initialize: function () {
      this.render();
    },
    render: function () {
      app.router.navigate('#oauth/accesstoken', {
        trigger: true
      });
    }
  });

  return LoginView;
});