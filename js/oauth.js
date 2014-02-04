/*global define*/
(function () {
  'use strict';
  function OAuth2(config) {
    this.oauthPopup = null;
    this.accessTokenURL = 'https://github.com/login/oauth/access_token';
    this.headers = {};
    this.accessToken = null;
    if (config) {
      this.clientId = config.clientId;
      this.clientSecret = config.clientSecret;
      this.apiScope = config.apiScope;
      this.redirectUri = config.redirectUri;
      this.openAuthorizationCodePopup();
    } else {
      this.finishAuthorization();
    }
  }

  OAuth2.prototype.openAuthorizationCodePopup = function () {
    var listener = function(event){
      this.getAccessAndRefreshTokens(event.data);
      this.oauthPopup.close();
    }.bind(this);


    this.oauthPopup = window.open(this.authorizationCodeURL(), 'OAuthPopup', 'width=1024,height=768');
    if (window.addEventListener){
      window.addEventListener('message', listener, false);
    } else {
      window.attachEvent('onmessage', listener);
    }
  };

  OAuth2.prototype.getAccessAndRefreshTokens = function (authorizationCode) {
    var github = this;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.accessTokenURL, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          github.setAccessToken(xhr.responseText);
          github.accessTokenDate = new Date().valueOf();
        }
      }
    };
    var items = this.accessTokenParams(authorizationCode);
    var key = null;
    var formData = new FormData();
    for (key in items) {
      formData.append(key, items[key]);
    }
    xhr.setRequestHeader('Access-Control-Allow-Origin', window.location.href);
    xhr.send(formData);
  };

  OAuth2.prototype.refreshAccessToken = function (refreshToken, callback, scope) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (/*event*/) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var obj = JSON.parse(xhr.responseText);
          /*jshint camelcase:false*/
          this.accessToken = obj.access_token;
          this.expiresIn = obj.expires_in;
          callback.call(scope ? scope : window);
        }
      }
    };

    var formData = new FormData();
    formData.append('client_id', this.clientId);
    formData.append('client_secret', this.clientSecret);
    formData.append('refresh_token', refreshToken);
    formData.append('grant_type', 'refresh_token');
    xhr.open('POST', this.accessTokenURL, true);
    xhr.send(formData);
  };

  OAuth2.prototype.finishAuthorization = function(){
    var authorizationCode = null;

    try {
      authorizationCode = this.parseAuthorizationCode(window.location.href);
      console.log(authorizationCode);
    } catch (e) {
      console.error(e);
    }

    window.opener.postMessage(authorizationCode, window.location.href);
  };

  OAuth2.prototype.isAccessTokenExpired = function () {
    return (new Date().valueOf() - this.accessTokenDate) > this.expiresIn * 1000;
  };

  OAuth2.prototype.authorizationCodeURL = function() {
    return ('https://github.com/login/oauth/authorize?' +
      'client_id={{CLIENT_ID}}&' +
      'redirect_uri={{REDIRECT_URI}}&' +
      'scope={{API_SCOPE}}')
      .replace('{{CLIENT_ID}}', this.clientId)
      .replace('{{REDIRECT_URI}}', this.redirectUri)
      .replace('{{API_SCOPE}}', this.apiScope);
  };

  OAuth2.prototype.parseAuthorizationCode = function(url) {
    var error = url.match(/[&\?]error=([^&]+)/);
    if (error) {
      throw 'Error getting authorization code: ' + error[1];
    }
    return url.match(/[&\?]code=([\w\/\-]+)/)[1];
  };

  OAuth2.prototype.accessTokenParams = function(authorizationCode) {
    return {
      'code': authorizationCode,
      'client_id': this.clientId,
      'client_secret': this.clientSecret,
      'redirect_uri': this.redirectUri
    };
  };

  OAuth2.prototype.setAccessToken = function(response) {
    this.accessToken = response.match(/access_token=([^&]*)/)[1];
    this.expiresIn = Number.MAX_VALUE;
    this.onAccessTokenReceived();
  };

  OAuth2.prototype.onAccessTokenReceived = function(){};

  if(typeof define === 'function'){
    define(function(){
      return OAuth2;
    });
  }else{
    window.OAuth2 = OAuth2;
  }

}());
