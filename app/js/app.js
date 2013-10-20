/*global define*/
define([
  'backbone',
  'underscore',
  'when',
  'authServer',
  'options',
  'logger'
], function(Backbone, _, when, authServer, options, logger){
  'use strict';

  var GitHubApi = require('github'),
    authWindowShowTimeoutID = null;

  function App(){}

  App.prototype.github = new GitHubApi({
    version: '3.0.0'
  });

  App.prototype.authHandler = authServer;
  App.prototype.logger = logger;
  App.prototype.nwGui = require('nw.gui');
  App.prototype.options = options;

  App.prototype.getOAuthToken = function getOAuthToken() {
    var defer = when.defer(),
      _this = this;
    this.logger.log('Create auth window');
    var win = this.nwGui.Window.open('http://localhost:7878', {
      position: 'center',
      width: 1024,
      height: 500,
      show: false
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

  var app = new App();
  _.extend(app, Backbone.Events);


  app.authHandler.init()
    .then(function(){
      return app.getOAuthToken();
    })
    .then(function(){
      app.trigger('authenticated');
    });

  return app;
});