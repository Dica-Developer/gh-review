/*global requirejs*/
(function () {
  'use strict';

  requirejs.config({
    basePath: '../js',
    paths: {
      jquery: '../bower_components/jquery/dist/jquery',
      bootstrap: '../bower_components/bootstrap/dist/js/bootstrap.min',
      backbone: '../bower_components/backbone/backbone',
      backboneLocalStorage: '../bower_components/backbone.localStorage/backbone.localStorage',
      underscore: '../bower_components/underscore/underscore',
      'underscore.string': '../bower_components/underscore.string/lib/underscore.string',
      text: '../bower_components/requirejs-text/text',
      templates: '../templates',
      when: '../bower_components/when/when',
      moment: '../bower_components/moment/min/moment-with-langs.min',
      base64: '../bower_components/requirejs-base64/base64.min',
      d3: '../bower_components/d3/d3.min',
      crossfilter: '../bower_components/crossfilter/crossfilter.min',
      dc: '../bower_components/dc.js/dc.min',

      option: 'options',

      GitHub: 'github/index',
      OAuth: 'oauth',
      app: 'app',
      Router: 'Router',
      chunk: 'chunk',
      TopMenuView: 'top-menu/top-menu-view',

      WelcomeView: 'welcome-view',

      FilterCollection: 'filter/filter-collection',
      FilterModel: 'filter/filter-model',
      FilterListView: 'filter/filter-list-view',
      FilterOverview: 'filter/filter-overview-view',

      QuickFilter: 'filter/filter-quick-view',

      RepoModel: 'repositories/repo-model',
      RepoCollection: 'repositories/repo-collection',
      RepoView: 'repositories/repo-view',
      RepoDetailView: 'repositories/repo-detail-view',

      commitModel: 'commits/commit-model',
      commitCollection: 'commits/commit-collection',
      commitListItemView: 'commits/commit-list-item-view',
      CommitListView: 'commits/commit-list-view',

      CommentView: 'comment/comment-view',
      commentBox: 'comment/comment-box',
      CommentModel: 'comment/comment-model',
      CommentCollection: 'comment/Comment-collection',

      StatisticsOverviewView: 'statistics/statistics-overview-view',
      StatisticView: 'statistics/statistic-view',
      StatisticModel: 'statistics/statistic-model',

      UserModel: 'user-model',

      loginLogout: 'login/loginLogout',
      OauthHandler: 'oauth/oauth-handler',
      WhoAmI: 'whoami-view',
      AboutView: 'about-view'
    },
    shim: {
      underscore: {
        exports: '_'
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
    }
  });

  requirejs([
    'jquery',
    'app',
    'Router',
    'TopMenuView',
    'underscore',
    'moment',
    'options',
    'underscore.string',
    'bootstrap'
  ], function ($, app, Router, TopMenuView, _, moment, options) {
    //add moment to underscore to have access to moment in templates
    _.moment = moment;

    app.options = options;

    app.ajaxIndicator = $('#ajaxIndicator').modal({
      backdrop: true,
      show: false,
      keyboard: false
    });

    app.router = new Router();
    app.router.on('ajaxIndicator', function (show) {
      this.showIndicator(show);
    }, app);
    app.init();
    new TopMenuView();
  });
}());