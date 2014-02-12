/*global define, localStorage*/
define([
  'app'
], function (app) {
  'use strict';

  function hasLocalStorage() {
    return (localStorage !== 'undefined');
  }

  function login(){
    app.router.navigate('#oauth/accesstoken', {
      trigger: true
    });
  }

  function redirectToRoot() {
    window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname;
  }

  function logout(){
    if(hasLocalStorage()){
      localStorage.removeItem('accessToken');
    }
    redirectToRoot();
  }

  return {
    login: login,
    logout: logout
  };
});