/*global define, window, localStorage*/
define([
  'backbone',
  'GitHub'
], function (Backbone, GitHub) {
  'use strict';

  function hasLocalStorage() {
    return (typeof localStorage !== 'undefined');
  }

  function GHReview() {
    this.authenticated = false;
    this.ajaxIndicator = null;
    this.ajaxIndicatorTimeoutId = null;
    this.ajaxIndicatorIsVisible = false;
    this.user = null;
    this.github = new GitHub({});
  }

  GHReview.prototype = Backbone.Events;

  GHReview.prototype.init = function () {
    if (hasLocalStorage() && localStorage.accessToken) {
      this.authenticated = true;
      this.github.authenticate({
        type: 'token',
        token: localStorage.accessToken
      });
      this.router.navigate('#reviews', {
        trigger: true
      });
    }
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