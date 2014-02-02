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
      when: '../bower_components/when/when',
      moment: '../bower_components/moment/min/moment-with-langs.min',
      log4javascript: '../bower_components/log4javascript.min',

      GitHub: 'github-api',
      Logger: 'logger',
      app: 'app'
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
    'bootstrap'
  ], function ($, app, _, moment) {
    //add moment to underscore to have access to moment in templates
    _.moment = moment;
//    app.ajaxIndicator = $('#ajaxIndicator').modal({
//      backdrop: true,
//      show: false,
//      keyboard: false
//    });
//    console.log(app.ajaxIndicator);
//    app.on('authenticated', function () {
//      requirejs(['router', 'topMenuView'], function (router) {
//        app.router = router;
//        app.trigger('ready');
//        app.router.navigate('', {trigger: true});
//        app.router.on('ajaxIndicator', function (show) {
//          this.showIndicator(show);
//        }, app);
//      });
//    });
  });
}());