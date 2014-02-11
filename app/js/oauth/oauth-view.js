/*global define, localStorage*/
define([
  'backbone',
  'OAuth',
  'app',
  'options'
], function (Backbone, OAuth, app, options) {
  'use strict';

  function hasLocalStorage() {
    return (localStorage !== 'undefined');
  }

  function accessTokenReceived(response) {
    /*jshint camelcase:false*/
    var accessToken = response.access_token;
    if (hasLocalStorage()) {
      localStorage.accessToken = accessToken;
    }
    app.github.authenticate({
      type: 'token',
      token: accessToken
    });
    app.authenticated = true;
    window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname;
  }

  var OauthView = Backbone.View.extend({
    initialize: function () {
      this.render();
    },
    getAccessToken: function () {
      var oauth = new OAuth(options);
      oauth.startAuthentication();
    },
    callback: function () {
      var oauth = new OAuth(options);
      oauth.finishAuthentication(accessTokenReceived);
    }
  });

  return OauthView;
});