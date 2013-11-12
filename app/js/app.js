/*global define, window*/
define([
  'jquery',
  'backbone',
  'underscore',
  'when',
  'authServer',
  'options',
  'logger'
], function ($, Backbone, _, when, authServer, options, logger) {
  'use strict';

  var GitHubApi = require('github'),
    authWindowShowTimeoutID = null;

  function App() {
    this.tray = this.createTrayEntries();
    this.ajaxIndicator = null;
    this.ajaxIndicatorTimeoutId = null;
    this.ajaxIndicatorIsVisible = false;
  }

  App.prototype.github = new GitHubApi({
    version: '3.0.0'
  });

  App.prototype.authHandler = authServer;
  App.prototype.logger = logger;
  App.prototype.nwGui = require('nw.gui');
  App.prototype.options = options;

  App.prototype.createTrayEntries = function () {
    var _this = this,
      win = this.nwGui.Window.get();
    var createTrayMenu = function () {
      var menu = new _this.nwGui.Menu();
      var devTools = new _this.nwGui.MenuItem({
        label: 'Debug Quick Question',
        click: function () {
          win.showDevTools();
        }
      });
      var separator = new _this.nwGui.MenuItem({
        type: 'separator'
      });
      var quitItem = new _this.nwGui.MenuItem({
        label: 'Quit Quick Question',
        click: function () {
          win.close();
        }
      });

      menu.append(devTools);
      menu.append(separator);
      menu.append(quitItem);
      return menu;
    };


    var trayMenu = createTrayMenu();
    return new this.nwGui.Tray({
      icon: 'img/octocat.png',
      menu: trayMenu
    });
  };


  App.prototype.getOAuthToken = function getOAuthToken() {
    var defer = when.defer(),
      _this = this;
    this.logger.log('Create auth window');
    var win = this.nwGui.Window.open('http://localhost:7878', {
      position: 'center',
      width: 1024,
      height: 500,
      show: false,
      frame: false
    });

    this.authHandler.on('requestAccessToken', function () {
      _this.logger.log('Set time out to show auth window');
      authWindowShowTimeoutID = window.setTimeout(function () {
        _this.logger.log('Show auth window');
        win.show();
      }, 1000);
    });


    this.authHandler.on('callbackUrlCalled', function () {
      _this.logger.log('Clear time out to show auth window');
      window.clearTimeout(authWindowShowTimeoutID);
    });

    this.authHandler.on('gotAccessToken', function (token) {
      _this.logger.info('Token received: %s', token);
      _this.options.token = token;
      _this.github.authenticate({
        type: 'oauth',
        token: token
      });
      _this.logger.log('Close auth window');
      win.close();
      _this.logger.log('Shutdown server');
      _this.authHandler.server.close();
      defer.resolve();
    });
    return defer.promise;
  };

  App.prototype.showIndicator = function (show) {
    var _this = this;
    window.clearTimeout(this.ajaxIndicatorTimeoutId);
    if (!this.ajaxIndicatorIsVisible && show) {
      this.ajaxIndicatorTimeoutId = window.setTimeout(function () {
        _this.ajaxIndicator.modal('show');
        _this.ajaxIndicatorIsVisible = true;
      }, 700);
    } else if (this.ajaxIndicatorIsVisible && !show) {
      this.ajaxIndicator.modal('hide');
      this.ajaxIndicatorIsVisible = false;
    }
  };

  var app = new App();
  _.extend(app, Backbone.Events);


  app.authHandler.init()
    .then(function () {
      return app.getOAuthToken();
    })
    .then(function () {
      app.trigger('authenticated');
    });

  return app;
});