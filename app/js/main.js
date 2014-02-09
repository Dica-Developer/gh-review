/*global requirejs*/
(function () {
  'use strict';

  window.require = window.nodeRequire;

  requirejs.config({
    basePath: '../js',
    paths: {
      jquery: '../bower_components/jquery/jquery',
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
      topMenuView: 'top-menu/top-menu-view',

      reviewCollection: 'review/review-collection',
      reviewItemModel: 'review/review-item-model',
      reviewListView: 'review/review-list-view',
      reviewListItemView: 'review/review-list-item-view',
      reviewDetailView: 'review/review-detail-view',

      RepoModel: 'repositories/repo-model',
      RepoCollection: 'repositories/repo-collection',
      repoView: 'repositories/repo-view',
      repoDetailView: 'repositories/repo-detail-view',

      commitModel: 'commits/commit-model',
      commitCollection: 'commits/commit-collection',
      commitListItemView: 'commits/commit-list-item-view',

      commentView: 'comment/comment-view',
      commentBox: 'comment/comment-box',
      commentModel: 'comment/comment-model',
      commentCollection: 'comment/comment-collection',

      UserModel: 'user-model'
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
    'underscore',
    'moment',
    'underscore.string',
    'backboneLocalStorage',
    'bootstrap',
    'topMenuView'
  ], function ($, app, _, moment) {
    //add moment to underscore to have access to moment in templates
    _.moment = moment;

    app.init();

    app.ajaxIndicator = $('#ajaxIndicator').modal({
      backdrop: true,
      show: false,
      keyboard: false
    });

    app.on('authenticated', function(){
      requirejs(['Router'], function (Router) {
        app.router = new Router();
        app.trigger('ready');
        app.router.navigate('', {trigger: true});
        app.router.on('ajaxIndicator', function (show) {
          this.showIndicator(show);
        }, app);
      });
    });
  });
}());