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
      githubResponses: '../test/helper/githubResponses',
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

      RepoModel: '../app/js/repositories/repo-model',
      RepoCollection: '../app/js/repositories/repo-collection',
      repoView: 'repositories/repo-view',
      repoDetailView: 'repositories/repo-detail-view',

      commitModel: 'commits/commit-model',
      commitCollection: 'commits/commit-collection',
      commitListItemView: 'commits/commit-list-item-view',

      commentView: 'comment/comment-view',
      commentBox: 'comment/comment-box',
      commentModel: 'comment/comment-model',
      commentCollection: 'comment/comment-collection',

      userModel: '../app/js/user-model'


    },
    map: {
      GitHub: {
        'github/api/index': 'GitHubApiIndex',
        'github/util': 'GitHubUtils'
      },
      'GitHubApiIndex': {
        'github/util': 'GitHubUtils',
        'github/api/routes': '../app/js/github/api/routes',
        'github/api/gists': '../app/js/github/api/gists',
        'github/api/gitdata': '../app/js/github/api/gitdata',
        'github/api/authorization': '../app/js/github/api/authorization',
        'github/api/orgs': '../app/js/github/api/orgs',
        'github/api/statuses': '../app/js/github/api/statuses',
        'github/api/pullRequests': '../app/js/github/api/pullRequests',
        'github/api/repos': '../app/js/github/api/repos',
        'github/api/user': '../app/js/github/api/user',
        'github/api/events': '../app/js/github/api/events',
        'github/api/search': '../app/js/github/api/search',
        'github/api/issues': '../app/js/github/api/issues',
        'github/api/markdown': '../app/js/github/api/markdown'
      }
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