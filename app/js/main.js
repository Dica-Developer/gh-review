/*global requirejs*/
(function () {
  'use strict';

  window.require = window.nodeRequire;

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

      option: 'options',

      GitHub: 'github/index',
      OAuth: 'oauth',
      app: 'app',
      Router: 'Router',
      chunk: 'chunk',
      TopMenuView: 'top-menu/top-menu-view',

      FilterCollection: 'filter/filter-collection',
      FilterModel: 'filter/filter-model',
      FilterListView: 'filter/filter-list-view',
      FilterOverview: 'filter/filter-overview-view',

      QuickFilter: 'filter/filter-quick-view',

      RepoModel: 'repositories/repo-model',
      RepoCollection: 'repositories/repo-collection',
      RepoView: 'repositories/repo-view',
      repoDetailView: 'repositories/repo-detail-view',

      commitModel: 'commits/commit-model',
      commitCollection: 'commits/commit-collection',
      commitListItemView: 'commits/commit-list-item-view',
      CommitListView: 'commits/commit-list-view',

      CommentView: 'comment/comment-view',
      commentBox: 'comment/comment-box',
      CommentModel: 'comment/comment-model',
      CommentCollection: 'comment/Comment-collection',

      UserModel: 'user-model',

      loginLogout: 'login/loginLogout',
      OauthHandler: 'oauth/oauth-handler',
      WhoAmI: 'whoami-view'
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
      bootstrap: ['jquery']
    }
  });

  requirejs([
    'jquery',
    'app',
    'Router',
    'TopMenuView',
    'underscore',
    'moment',
    'underscore.string',
    'bootstrap'
  ], function ($, app, Router, TopMenuView, _, moment) {
    //add moment to underscore to have access to moment in templates
    _.moment = moment;

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