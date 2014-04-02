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
    this.commitApproved = {};
    this.approveComments = {};
    this.informUserAboutUpdate = false;
    this.commentCollector = new Worker('worker/comments/collector.js');
    this.commentCollector.onmessage = this.sortOutApproveComments.bind(this);
  }

  GHReview.prototype = Backbone.Events;

  GHReview.prototype.sortOutApproveComments = function (eventOrComment) {
    var approveCommit = function(comment) {
      /*jshint camelcase:false*/
      if (true !== this.commitApproved[comment.commit_id]) {
        this.commitApproved[comment.commit_id] = true;
      }
      if (true !== this.approveComments[comment.id]) {
        this.approveComments[comment.id] = true;
      }
    }.bind(this);

    var commentBody, comment;
    if (typeof eventOrComment.data === 'undefined') {
      commentBody = eventOrComment.body;
      comment = eventOrComment;
    } else if ('comment' === event.data.type) {
      commentBody = event.data.comment.body;
      comment = event.data.comment;
    }
    if (commentBody) {
      if (commentBody.indexOf('```json') > -1) {
        commentBody = commentBody.substring(7, (commentBody.length - 3));
        commentBody = JSON.parse(commentBody);
        if (true === commentBody.approved) {
          approveCommit(comment);
        }
      } else {
        // TODO pre 0.2.0 release can and should be removed with one of the next versions
        if (commentBody.indexOf('Approved by @') > -1) {
          approveCommit(comment);
        }
      }
    }
  };

  GHReview.prototype.announceRepositories = function () {
    var repositories = [];
    this.filterCollection.each(function (repo) {
      var url = repo.getCommentsUrl();
      repositories.push(url);
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
        this.checkForUpdates();
        when.all(this.repoCollection.getRepos())
          .then(function () {
            Backbone.history.start();
            this.announceRepositories();
            this.showIndicator(false);
          }.bind(this));
      }.bind(this));
    } else {
      Backbone.history.start();
    }
  };

  GHReview.prototype.checkForUpdates = function () {
    if (hasLocalStorage()) {
      var version = localStorage.version;
      if (version && (version !== this.options.ghReview.version)) {
        this.informUserAboutUpdate = true;
      }
      localStorage.version = this.options.ghReview.version;
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