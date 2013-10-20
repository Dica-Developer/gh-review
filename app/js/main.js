/*global requirejs*/
(function () {
  'use strict';

  window.require = window.nodeRequire;

  requirejs.config({
    basePath: '../js',
    paths: {
      jquery: '../bower_components/jquery/jquery',
      backbone: '../bower_components/backbone/backbone',
      backboneLocalStorage: '../bower_components/backbone.localStorage/backbone.localStorage',
      underscore: '../bower_components/underscore/underscore',
      'underscore.string': '../bower_components/underscore.string/lib/underscore.string',
      text: '../bower_components/requirejs-text/text',
      when: '../bower_components/when/when',
      moment: '../bower_components/moment/min/moment-with-langs.min',

      app: 'app',
      authServer: 'authServer',
      options: 'options',
      logger: 'logger',
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

      commitModel: 'commits/commit-model',
      commitCollection: 'commits/commit-collection',
      commitListItemView: 'commits/commit-list-item-view',

      commentView: 'comment/comment-view',
      commentBox: 'comment/comment-box',

      userModel: 'user-model'
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
      }
    }
  });

  requirejs([
    'app',
    'underscore',
    'underscore.string'
  ], function (app) {
    app.on('authenticated', function(){
      requirejs(['router', 'topMenuView'], function(router){
        app.router = router;
        app.trigger('ready');
        app.router.navigate('', {trigger: true});
      });
    });
  });
}());