/*global define, localStorage*/
define([
  'app'
], function (app) {
  'use strict';

  function hasLocalStorage () {
    return (localStorage !== 'undefined');
  }

  return {
    login: function login () {
      app.router.navigate('#oauth/accesstoken', {
        trigger: true
      });
    },
    logout: function logout () {
      if (hasLocalStorage()) {
        localStorage.removeItem('accessToken');
      }
      this.redirectToRoot();
    },
    redirectToRoot: function redirectToRoot () {
      app.showIndicator(false);
      window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname;
    }
  };
});