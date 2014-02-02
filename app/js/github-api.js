/*global define*/
(function () {
  'use strict';
  function GitHub(config) {
    this.oauthIFrame = null;
    this.accessTokenURL = 'https://github.com/login/oauth/access_token';
    this.headers = {};
    if (config) {
      this.clientId = config.clientId;
      this.clientSecret = config.clientSecret;
      this.apiScope = config.apiScope;
      this.redirectUri = config.redirectUri;
    } else {
      this.finishAuthorization();
    }
  }

  GitHub.prototype.openAuthorizationCodeIframe = function (callback, scope) {
    var body = document.getElementsByTagName('body')[0];
    var listener = function(event){
      this.getAccessAndRefreshTokens(event.data, callback, scope);
      body.removeChild(this.oauthIFrame);
    }.bind(this);

    var iframe = document.createElement('iframe');
    iframe.id = 'OAuthIFrame';
    iframe.width = 0;
    iframe.height = 0;
    iframe.src = this.authorizationCodeURL();
    body.appendChild(iframe);
    this.oauthIFrame = iframe;
    if (window.addEventListener){
      window.addEventListener('message', listener, false);
    } else {
      window.attachEvent('onmessage', listener);
    }
  };

  GitHub.prototype.getAccessAndRefreshTokens = function (authorizationCode, callback, scope) {
    var github = this;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.accessTokenURL, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          github.setAccessToken(xhr.responseText);
          console.log(this.accessToken);
          github.accessTokenDate = new Date().valueOf();
          callback.call(scope ? scope : window);
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

  GitHub.prototype.refreshAccessToken = function (refreshToken, callback, scope) {
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

  GitHub.prototype.finishAuthorization = function(){
    var authorizationCode = null;

    try {
      authorizationCode = this.parseAuthorizationCode(window.location.href);
      console.log(authorizationCode);
    } catch (e) {
      console.error(e);
    }

    window.parent.postMessage(authorizationCode, window.location.href);
  };

  GitHub.prototype.isAccessTokenExpired = function () {
    return (new Date().valueOf() - this.accessTokenDate) > this.expiresIn * 1000;
  };

  GitHub.prototype.authorize = function (callback, scope) {
    if (!this.accessToken) {
      // There's no access token yet. Start the authorizationCode flow
      this.openAuthorizationCodeIframe(callback, scope);
    } else if (this.isAccessTokenExpired()) {
      // There's an existing access token but it's expired
      if (this.refreshToken) {
        this.refreshAccessToken(this.refreshToken, callback, scope);
      } else {
        this.openAuthorizationCodeIframe(callback, scope);
      }
    } else {
      if (callback) {
        callback.call(scope ? scope : window);
      }
    }
  };

  GitHub.prototype.authorizationCodeURL = function() {
    return ('https://github.com/login/oauth/authorize?' +
      'client_id={{CLIENT_ID}}&' +
      'redirect_uri={{REDIRECT_URI}}&' +
      'scope={{API_SCOPE}}')
      .replace('{{CLIENT_ID}}', this.clientId)
      .replace('{{REDIRECT_URI}}', this.redirectUri)
      .replace('{{API_SCOPE}}', this.apiScope);
  };

  GitHub.prototype.parseAuthorizationCode = function(url) {
    var error = url.match(/[&\?]error=([^&]+)/);
    if (error) {
      throw 'Error getting authorization code: ' + error[1];
    }
    return url.match(/[&\?]code=([\w\/\-]+)/)[1];
  };

  GitHub.prototype.accessTokenParams = function(authorizationCode) {
    return {
      'code': authorizationCode,
      'client_id': this.clientId,
      'client_secret': this.clientSecret,
      'redirect_uri': this.redirectUri
    };
  };

  GitHub.prototype.setAccessToken = function(response) {
    this.accessToken = response.match(/access_token=([^&]*)/)[1];
    this.expiresIn = Number.MAX_VALUE;
  };

  GitHub.prototype.get = function(options, callback){
    var github = this;
    this.authorize(function(){
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://api.github.com/' + options.url + '?access_token=' + this.accessToken, true);

      xhr.onreadystatechange = function(){
        if (xhr.readyState === 4) {
          github.storeHeaders(xhr.getAllResponseHeaders());
          if (xhr.status === 200) {
            var obj = JSON.parse(xhr.responseText);
            /*jshint camelcase:false*/
            callback.call(github, null, obj);
          }else{
            callback.call(github, {status: xhr.status, message: xhr.responseText});
          }
        }
      };
      xhr.setRequestHeader('Accept','application/vnd.github.raw+json');
      xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');
      xhr.send(null);
    }, this);
  };

  GitHub.prototype.storeHeaders = function(headersString){
    var headersSplit = headersString.split('\n');
    for (var i = 0, length = headersSplit.length; i < length; i++) {
      var header = headersSplit[i];
      if(header !== ''){
        var keyValueSplit = header.split(':');
        var key = keyValueSplit[0].trim();
        var value = keyValueSplit[1].trim();
        this.headers[key] = value;
      }
    }
  };

  GitHub.prototype.getXRateLimitRemaining = function(){
    return this.headers['X-RateLimit-Remaining'];
  };

  GitHub.prototype.user = function(callback){
    this.get({
      url: 'user'
    }, callback);
  };

  if(typeof define === 'function'){
    define('GitHub', function(){
      return GitHub;
    });
  }else{
    window.GitHub = GitHub;
  }

}());
