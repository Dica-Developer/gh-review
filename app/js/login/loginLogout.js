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

  function deleteAccessToken (){
    if(hasLocalStorage()){
      localStorage.removeItem('accessToken');
    }
  }

  function logout(){
    deleteAccessToken();
  }

  return {
    login: login,
    logout: logout
  };
});