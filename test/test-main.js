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
      jquery: '../app/bower_components/jquery/dist/jquery',
      bootstrap: '../app/bower_components/bootstrap/dist/js/bootstrap.min',
      backbone: '../app/bower_components/backbone/backbone',
      backboneLocalStorage: '../app/bower_components/backbone.localStorage/backbone.localStorage',
      underscore: '../app/bower_components/underscore/underscore',
      'underscore.string': '../app/bower_components/underscore.string/lib/underscore.string',
      text: '../app/bower_components/requirejs-text/text',
      when: '../app/bower_components/when/when',
      moment: '../app/bower_components/moment/min/moment-with-langs.min',
      base64: '../app/bower_components/requirejs-base64/base64.min',
      d3: '../app/bower_components/d3/d3.min',
      crossfilter: '../app/bower_components/crossfilter/crossfilter.min',
      dc: '../app/bower_components/dc.js/dc.min',


      sinon: '../test/lib/sinon',
      server: '../test/helper/server',
      githubResponses: '../test/helper/githubResponses',
      options: '../test/helper/compiledOptions',
      templates: '../app/templates',

      GitHub: '../app/js/github/index',
      GitHubApiIndex: '../app/js/github/api/index',
      GitHubUtils: '../app/js/github/util',
      OAuth: '../app/js/oauth',
      app: '../app/js/app',
      Router: '../app/js/Router',
      chunk: '../app/js/chunk',
      topMenuView: 'top-menu/top-menu-view',

      WelcomeView: '../app/js/welcome-view',

      FilterCollection: '../app/js/filter/filter-collection',
      FilterModel: '../app/js/filter/filter-model',
      FilterListView: '../app/js/filter/filter-list-view',
      FilterOverview: '../app/js/filter/filter-overview-view',

      QuickFilter: '../app/js/filter/filter-quick-view',

      RepoModel: '../app/js/repositories/repo-model',
      RepoCollection: '../app/js/repositories/repo-collection',
      RepoView: '../app/js/repositories/repo-view',
      RepoDetailView: '../app/js/repositories/repo-detail-view',

      commitModel: '../app/js/commits/commit-model',
      commitCollection: '../app/js/commits/commit-collection',
      commitListItemView: '../app/js/commits/commit-list-item-view',
      CommitListView: '../app/js/commits/commit-list-view',

      CommentView: '../app/js/comment/comment-view',
      commentBox: '../app/js/comment/comment-box',
      CommentModel: '../app/js/comment/comment-model',
      CommentCollection: '../app/js/comment/Comment-collection',

      StatisticsOverviewView: '../app/js/statistics/statistics-overview-view',
      StatisticView: '../app/js/statistics/statistic-view',
      StatisticModel: '../app/js/statistics/statistic-model',

      UserModel: '../app/js/user-model',

      loginLogout: '../app/js/login/loginLogout',
      OauthHandler: '../app/js/oauth/oauth-handler',
      WhoAmI: '../app/js/whoami-view',
      AboutView: '../app/js/about-view'
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
      bootstrap: ['jquery'],
      crossfilter: {
        exports: 'crossfilter'
      },
      d3: {
        exports: 'd3'
      },
      dc: {
        deps: ['d3', 'crossfilter'],
        exports: 'dc'
      }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: function(){
      require([
        'underscore',
        'moment',
        'underscore.string'
      ], function(_, moment){
        _.moment = moment;
        window.__karma__.start();
      });
    }
  });
}());