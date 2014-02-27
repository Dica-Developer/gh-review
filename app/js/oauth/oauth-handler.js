/*global define, localStorage*/
define([
  'OAuth',
  'app'
], function (OAuth, app) {
  'use strict';

  function hasLocalStorage() {
    return (localStorage !== 'undefined');
  }

  return {
    getAccessToken: function () {
      var oauth = new OAuth(app.options.github);
      oauth.startAuthentication();
    },
    callback: function () {
      var oauth = new OAuth(app.options.github);
      oauth.finishAuthentication(this.accessTokenReceived.bind(this));
    },
    accessTokenReceived: function (response) {
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
      this.redirectToRoot();
    },
    redirectToRoot: function () {
      window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname;
    }
  };
});