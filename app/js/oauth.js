/*global define, localStorage*/
(function () {
  'use strict';

  var localStorageAvailable = function(){
    return (typeof localStorage !== 'undefined');
  };

  function OAuth2(config) {
    if(localStorageAvailable()){
      this.accessToken = localStorage.ghreviewAccessToken;
    }
    this.clientId = config.clientId;
    this.apiScope = config.apiScope;
    this.redirectUri = config.redirectUri;
    this.accessTokenUrl = config.accessTokenUrl;
    var authCode = this.parseAuthorizationCode(window.location.href);
    if (!authCode) {
      if (typeof this.accessToken === 'undefined') {
        this.doRedirect(this.authorizationCodeURL());
      } else {
        var oauth = this;
        localStorage.removeItem('ghreviewAccessToken');
        window.setTimeout(function(){
          oauth.onAccessTokenReceived(oauth.accessToken);
        }, 500);
      }
    } else {
      if (typeof this.accessToken === 'undefined') {
        this.finishAuthorization(authCode);
      }
    }
  }


  OAuth2.prototype.doRedirect = function(url){
    window.location.href = url;
  };

  OAuth2.prototype.finishAuthorization = function(authCode){
    var oauth = this;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.getAccessTokenURL(authCode), true);
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          oauth.setAccessToken(JSON.parse(xhr.responseText));
        }
      }
    };
    xhr.send(null);
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

  OAuth2.prototype.getAccessTokenURL = function(authCode) {
    return (this.accessTokenUrl + '?' +
      'client_id={{CLIENT_ID}}&' +
      'code={{CODE}}&' +
      'scope={{API_SCOPE}}')
      .replace('{{CLIENT_ID}}', this.clientId)
      .replace('{{CODE}}', authCode)
      .replace('{{API_SCOPE}}', this.apiScope);
  };

  OAuth2.prototype.parseAuthorizationCode = function(url) {
    var error = url.match(/[&\?]error=([^&]+)/);
    var code = url.match(/[&\?]code=([\w\/\-]+)/);
    if (error) {
      throw 'Error getting authorization code: ' + error[1];
    }
    if(code){
      code = code[1];
    }
    return code;
  };

  OAuth2.prototype.setAccessToken = function(response) {
    /*jshint camelcase:false*/
    localStorage.ghreviewAccessToken = response.access_token;
    var url = window.location.protocol + '//' + window.location.host + window.location.pathname;
    this.doRedirect(url);
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
