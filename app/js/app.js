/*global define, window, localStorage*/
define([
  'backbone',
  'underscore',
  'when',
  'OAuth',
  'GitHub',
  'options'
], function (Backbone, _, when, OAuth, GitHub, options) {
  'use strict';

  function hasLocalStorage(){
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test', 'test');
      return true;
    } catch(e) {
      return false;
    }
  }

  function isAuthorizationInProgress(){
    var authorizationInProgress = false;
    if(hasLocalStorage()){
      authorizationInProgress = localStorage.inAuthorizationProcess || false;
    } else {
      //TODO add cookie fallback if no localStorage is available
    }
    return authorizationInProgress;
  }

  function endAuthorizationInProgress(){
    if(hasLocalStorage()){
      localStorage.removeItem('inAuthorizationProcess');
    } else {
      //TODO add cookie fallback if no localStorage is available
    }
  }

  function GHReview() {
    this.authenticated = false;
    this.ajaxIndicator = null;
    this.ajaxIndicatorTimeoutId = null;
    this.ajaxIndicatorIsVisible = false;
    this.user = null;
    this.github = new GitHub({});
    this.oauth = null;
  }

  GHReview.prototype = Backbone.Events;

  GHReview.prototype.init = function(){
    if(isAuthorizationInProgress()){
      this.authenticate();
    }
  };

  GHReview.prototype.authenticate = function () {
    this.oauth = new OAuth(options);
    this.oauth.onAccessTokenReceived = function(){
      this.github.authenticate({
        type: 'token',
        token: this.oauth.accessToken
      });
      endAuthorizationInProgress();
      this.authenticated = true;
      this.trigger('authenticated');
    }.bind(this);
  };

  GHReview.prototype.showIndicator = function (show) {
    var _this = this;
    window.clearTimeout(this.ajaxIndicatorTimeoutId);
    if (!this.ajaxIndicatorIsVisible && show) {
      this.ajaxIndicatorTimeoutId = window.setTimeout(function () {
        _this.ajaxIndicator.modal('show');
        _this.ajaxIndicatorIsVisible = true;
      }, 700);
    } else if (this.ajaxIndicatorIsVisible && !show) {
      this.ajaxIndicator.modal('hide');
      this.ajaxIndicatorIsVisible = false;
    }
  };

  return new GHReview();
});
