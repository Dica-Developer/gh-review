/*global define*/
define(['backbone', 'underscore', 'when', 'logger'], function (Backbone, _, when, logger) {
  'use strict';

  var http = require('http');
  var Url = require('url');
  var querystring = require('querystring');
  var OAuth2 = require('oauth').OAuth2;
  var clientId = '551a4a26805e129578a3';
  var secret = '523d82c7936182b4d2e81a0a15d8729fbfe00757';
  var oauth = new OAuth2(clientId, secret, 'https://github.com/', 'login/oauth/authorize', 'login/oauth/access_token');

  function AuthHandler(){
    this.server = null;
  }

  var authHandler = new AuthHandler();

  _.extend(authHandler, Backbone.Events);

  authHandler.createServer = function(){
    var _this = this;
    return http.createServer(function (req, res) {
      var url = Url.parse(req.url);
      var path = url.pathname;
      var query = querystring.parse(url.query);
      logger.network('Auth server: Path -> %s', path);

      if (path === '/') {
        res.writeHead(303, {
          Location: oauth.getAuthorizeUrl({
            scope: 'user,repo'
          })
        });
        _this.trigger('requestAccessToken');
        res.end();
      } else if (path.match(/^\/github-callback\/?$/)) {
        logger.network('Auth server: callback url called');
        _this.trigger('callbackUrlCalled');
        oauth.getOAuthAccessToken(query.code, {}, function (err, accessToken) {
          if (err) {
            logger.error('Auth server: ', err);
            res.writeHead(500);
            res.end(err + '');
            return;
          }

          logger.info('Access token received');
          _this.trigger('gotAccessToken', accessToken);

          res.end();
        });
      }
    });
  };

  authHandler.init = function(){
    var defer = when.defer();
    logger.log('Create auth server');
    this.server = this.createServer();
    logger.log('Start auth server');
    this.server.listen(7878);
    logger.network('Auth server is listening at http://localhost:7878');
    defer.resolve();
    return defer.promise;
  };

  return authHandler;
});
