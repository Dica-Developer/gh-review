/*global requirejs*/
(function () {
  'use strict';


  var tests = [];
  /*jshint camelcase:false*/
  for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
      if (/-spec\.js$/.test(file)) {
        tests.push(file);
      }
    }
  }

  requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/src',

    paths: {
      jquery: '../bower_components/jquery/jquery',
      bootstrap: '../bower_components/bootstrap/dist/js/bootstrap.min',
      backbone: '../bower_components/backbone/backbone',
      backboneLocalStorage: '../bower_components/backbone.localStorage/backbone.localStorage',
      underscore: '../app/bower_components/underscore/underscore',
      'underscore.string': '../bower_components/underscore.string/lib/underscore.string',
      text: '../bower_components/requirejs-text/text',
      when: '../bower_components/when/when',
      moment: '../bower_components/moment/min/moment-with-langs.min',
      sinon: '../test/lib/sinon',
      server: '../test/helper/server',
      log4javascript: '../bower_components/log4javascript.min',

      GitHub: 'github/index',
      OAuth: '../app/js/oauth',
      Logger: 'logger',
      app: 'app',
      router: 'router',
      chunk: 'chunk',
      topMenuView: 'top-menu/top-menu-view',

      reviewCollection: 'review/review-collection',
      reviewItemModel: 'review/review-item-model',
      reviewListView: 'review/review-list-view',
      reviewListItemView: 'review/review-list-item-view',
      reviewDetailView: 'review/review-detail-view',

      repoModel: 'repositories/repo-model',
      repoCollection: 'repositories/repo-collection',
      repoView: 'repositories/repo-view',
      repoDetailView: 'repositories/repo-detail-view',

      commitModel: 'commits/commit-model',
      commitCollection: 'commits/commit-collection',
      commitListItemView: 'commits/commit-list-item-view',

      commentView: 'comment/comment-view',
      commentBox: 'comment/comment-box',
      commentModel: 'comment/comment-model',
      commentCollection: 'comment/comment-collection',

      userModel: 'user-model'
    },
    shim: {
      underscore: {
        exports: '_'
      },
      sinon: {
        exports: 'sinon'
      },
      'underscore.string': ['underscore'],
      backbone: {
        deps: [
          'underscore',
          'jquery'
        ],
        exports: 'Backbone'
      },
      bootstrap: ['jquery']
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
  });
}());