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
      d3: '../bower_components/d3/d3',
      crossfilter: '../bower_components/crossfilter/crossfilter',
      dc: '../bower_components/dcjs/dc',

      option: 'options',

      githubjs: '../bower_components/github-js/dist/github.min',
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

      commitModel: 'commits/commit-model',
      CommitCollection: 'commits/commit-collection',
      commitListItemView: 'commits/commit-list-item-view',
      CommitListView: 'commits/commit-list-view',

      CommentView: 'comment/comment-view',
      commentBox: 'comment/comment-box',
      CommentModel: 'comment/comment-model',
      CommentCollection: 'comment/Comment-collection',

      _FilterView: '_filter/filter-view',
      _FilterModel: '_filter/filter-model',
      _ExtendedFilterView: '_filter/extended-filter-view',

      UserModel: 'user-model',

      loginLogout: 'login/loginLogout',
      OauthHandler: 'oauth/oauth-handler',
      WhoAmI: 'whoami-view',
      AboutView: 'about-view',

      ModulesOverview: 'review/modules/overview-view',
      Search: 'review/modules/search-view',
      reviewModulesTemplates: 'review/modules/templates',

      FileView: 'file/views/file',
      fileTemplates: 'file/templates',

      StatisticsView: 'statistics/statistics-view',

      Charts: 'charts/charts'
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
      dc: {
        deps: ['d3', 'crossfilter'],
        exports: 'dc'
      }
    }
  });

  requirejs([
    'jquery',
    'underscore',
    'moment',
    'options',
    'd3',
    'underscore.string',
    'bootstrap'
  ], function ($, _, moment, options, d3) {
    //add moment to underscore to have access to moment in templates
    _.moment = moment;
    window.d3 = d3;

    require([
      'app',
      'Router',
      'TopMenuView'
    ], function (app, Router, TopMenuView) {

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

  });
}());
