/*global define*/
(function () {
  'use strict';

  function OAuth2(config) {
    this.clientId = config.clientId;
    this.apiScope = config.apiScope;
    this.redirectUri = config.redirectUri;
    this.accessTokenUrl = config.accessTokenUrl;
  }

  OAuth2.prototype.startAuthentication = function () {
    this.doRedirect(this.authorizationCodeURL());
  };

  OAuth2.prototype.doRedirect = function (url) {
    window.location.href = url;
  };

  OAuth2.prototype.finishAuthentication = function (callback) {
    var authCode = this.parseAuthorizationCode(window.location.href);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.getAccessTokenURL(authCode), true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          callback(JSON.parse(xhr.responseText), null);
        } else {
          callback(null, {status: xhr.status, message: xhr.responseText});
        }
      }
    };
    xhr.send(null);
  };

  OAuth2.prototype.authorizationCodeURL = function () {
    return ('https://github.com/login/oauth/authorize?' +
      'client_id={{CLIENT_ID}}&' +
      'redirect_uri={{REDIRECT_URI}}&' +
      'scope={{API_SCOPE}}')
      .replace('{{CLIENT_ID}}', this.clientId)
      .replace('{{REDIRECT_URI}}', this.redirectUri)
      .replace('{{API_SCOPE}}', this.apiScope);
  };

  OAuth2.prototype.getAccessTokenURL = function (authCode) {
    return (this.accessTokenUrl + '?' +
      'client_id={{CLIENT_ID}}&' +
      'code={{CODE}}&' +
      'scope={{API_SCOPE}}')
      .replace('{{CLIENT_ID}}', this.clientId)
      .replace('{{CODE}}', authCode)
      .replace('{{API_SCOPE}}', this.apiScope);
  };

  OAuth2.prototype.parseAuthorizationCode = function (url) {
    var error = url.match(/[&\?]error=([^&]+)/);
    var code = url.match(/[&\?]code=([\w\/\-]+)/);
    if (error) {
      throw new Error('Error getting authorization code: ' + error[1]);
    }
    if (code) {
      code = code[1];
    }
    return code;
  };

  if (typeof define === 'function') {
    define(function () {
      return OAuth2;
    });
  } else {
    window.OAuth2 = OAuth2;
  }
}());