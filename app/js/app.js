/*global define, window, localStorage, requirejs, Worker*/
define([
  'backbone',
  'when',
  'GitHub',
  'backboneLocalStorage'
], function (Backbone, when, GitHub) {
  'use strict';

  function hasLocalStorage() {
    return (localStorage !== undefined);
  }

  function GHReview() {
    this.authenticated = false;
    this.ajaxIndicator = null;
    this.ajaxIndicatorTimeoutId = null;
    this.ajaxIndicatorIsVisible = false;
    this.user = null;
    this.github = new GitHub({});
    this.repoCollection = null;
    this.filterCollection = null;
    this.commentCache = {};
    this.commentCollector = new Worker('worker/comments/collector.js');
    this.commentCollector.onmessage = function (event) {
      if ('comment' === event.data.type) {
        if (event.data.comment.body && event.data.comment.body.indexOf('Approved by @') > -1) {
          /*jshint camelcase:false*/
          this.commentCache[event.data.comment.commit_id] = true;
        }
      }
    }.bind(this);
  }

  GHReview.prototype = Backbone.Events;

  GHReview.prototype.announceRepositories = function () {
    var repositories = [];
    this.filterCollection.each(function (repo) {
      repositories.push('https://api.github.com/repos/' + repo.get('owner') + '/' + repo.get('repo') + '/comments');
    });
    this.commentCollector.postMessage({
      type: 'repositories',
      repositories: repositories
    });
  };

  GHReview.prototype.init = function () {
    if (hasLocalStorage() && localStorage.accessToken) {
      var message = {
        type: 'token',
        token: localStorage.accessToken
      };
      this.commentCollector.postMessage(message);
      this.showIndicator(true);
      this.authenticated = true;
      this.github.authenticate(message);
      requirejs(['RepoCollection', 'FilterCollection'], function (RepoCollection, FilterCollection) {
        this.repoCollection = new RepoCollection();
        this.filterCollection = new FilterCollection();
        when.all(this.repoCollection.getRepos())
          .then(function () {
            Backbone.history.start();
            this.router.navigate('#filter', {
              trigger: true
            });
            this.announceRepositories();
            this.showIndicator(false);
          }.bind(this));
      }.bind(this));
    } else {
      Backbone.history.start();
    }
  };

  GHReview.prototype.showIndicator = function (show) {
    var _this = this;
    window.clearTimeout(this.ajaxIndicatorTimeoutId);
    if (!this.ajaxIndicatorIsVisible && show) {
      this.ajaxIndicatorTimeoutId = window.setTimeout(function () {
        var spinner = $('#spinnerContainer');
        spinner.css('top', (($(window.document).innerHeight() / 2) - 80) + 'px');
        spinner.css('left', (($(window.document).innerWidth() / 2) - 100) + 'px');
        _this.ajaxIndicator.modal('show');
        _this.ajaxIndicatorIsVisible = true;
      }, 200);
    } else if (this.ajaxIndicatorIsVisible && !show) {
      this.ajaxIndicator.modal('hide');
      this.ajaxIndicatorIsVisible = false;
    }
  };

  try {
    window.onerror = function () {
      window.setTimeout(function () {
        var ai = $('#ajaxIndicator').modal({
          backdrop: true,
          show: false,
          keyboard: false
        });
        ai.modal('hide');
      }, 500);
    };
  } catch (ignore) {
    // we should not fail in case of window.onerror does not exist
  }

  return new GHReview();
});