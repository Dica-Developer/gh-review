/*global define, sinon*/
define([], function(){
  'use strict';

  function Server(){

    /*
    Seems to be an PhantomJS issue. Calling sinon sever with a post request at the end 'new ProgressEvent()'
    is called but leads in an error at PhantomJS ->

     TypeError: Fake server request processing threw exception: '[object ProgressEventConstructor]' is not a constructor (evaluating 'new ProgressEvent("progress", {loaded: 100, total: 100})')
     at sinon.js:3663

     */
    if(typeof ProgressEvent !== 'function'){
      ProgressEvent = function(){};
    }

    this.server = null;
    this.contentTypes = {
      json: {'Content-Type': 'application/json; charset=UTF-8'}
    };
    this.urls= {
      oauthTokenRequestUrl: function(){
        return new RegExp('/gh-review.herokuapp.com/bemdsvdsynggmvweibduvjcbgf', 'g');
      }
    };

    this.oauthTokenRequest = function(manual){
      var response = {
        'access_token':'e72e16c7e42f292c6912e7710c838347ae178b4a',
        'scope':'repo,gist',
        'token_type':'bearer'
      };
      this.start(manual);
      this.server.respondWith('POST', this.urls.oauthTokenRequestUrl(), [
        200,
        this.contentTypes.json,
        JSON.stringify(response)
      ]);
    };
  }

  Server.prototype.start = function(manual){
    manual = manual || false;
    this.server = sinon.fakeServer.create();
    if(!manual){
      this.server.autoRespond = true;
    }
  };

  Server.prototype.stop = function(){
    this.server.restore();
  };

  return new Server();
});