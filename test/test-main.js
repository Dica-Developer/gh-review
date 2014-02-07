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
      jquery: '../app/bower_components/jquery/jquery',
      bootstrap: '../app/bower_components/bootstrap/dist/js/bootstrap.min',
      backbone: '../app/bower_components/backbone/backbone',
      backboneLocalStorage: '../app/bower_components/backbone.localStorage/backbone.localStorage',
      underscore: '../app/bower_components/underscore/underscore',
      'underscore.string': '../app/bower_components/underscore.string/lib/underscore.string',
      text: '../app/bower_components/requirejs-text/text',
      when: '../app/bower_components/when/when',
      moment: '../app/bower_components/moment/min/moment-with-langs.min',
      sinon: '../test/lib/sinon',
      server: '../test/helper/server',
      githubRequests: '../test/helper/githubRequests',
      options: '../test/helper/compiledOptions',

      GitHub: '../app/js/github/index',
      GitHubApiIndex: '../app/js/github/api/index',
      GitHubUtils: '../app/js/github/util',
      OAuth: '../app/js/oauth',
      app: '../app/js/app',
      router: 'router',
      chunk: '../app/js/chunk',
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