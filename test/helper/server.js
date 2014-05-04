/*global define, sinon*/
define(['githubResponses'], function(githubResponses){
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
      json: {'Content-Type': 'application/json; charset=UTF-8'},
      text: {'Content-Type': 'text/plain; charset=UTF-8'}
    };

    this.urls= {
      oauthTokenRequestUrl: function(){
        return new RegExp('/gh-review.herokuapp.com/bemdsvdsynggmvweibduvjcbgf', 'g');
      },
      githubUserGet: function(){
        return new RegExp('https://api.github.com/user', 'g');
      },
      githubUserGetOrgUrl: function(){
        return new RegExp('https://api.github.com/user/orgs', 'g');
      },
      githubReposGetAllUrl: function(){
        return new RegExp('https://api.github.com/user/repos', 'g');
      },
      githubReposFromOrgUrl: function(){
        return new RegExp('https://api.github.com/orgs/(.*)/repos', 'g');
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

    this.oauthTokenRequestWithError = function(manual){
      this.start(manual);
      this.server.respondWith('POST', this.urls.oauthTokenRequestUrl(), [
        404,
        this.contentTypes.text,
        'Not found'
      ]);
    };

    this.githubUserGet = function(manual){

      this.start(manual);
      this.server.respondWith('GET', this.urls.githubUserGet(), [
        200,
        this.contentTypes.json,
        JSON.stringify(githubResponses.userGet)
      ]);
    };

    this.githubUserGetOrgs = function(manual){

      this.start(manual);
      this.server.respondWith('GET', this.urls.githubUserGetOrgUrl(), [
        200,
        this.contentTypes.json,
        JSON.stringify(githubResponses.userGetOrgs)
      ]);
    };

    this.githubReposGetAll = function(manual){
      this.start(manual);
      this.server.respondWith('GET', this.urls.githubReposGetAllUrl(), [
        200,
        this.contentTypes.json,
        JSON.stringify(githubResponses.reposGetAll)
      ]);
    };

    this.githubReposGetFromOrg = function(manual){
      this.start(manual);
      this.server.respondWith('GET', this.urls.githubReposFromOrgUrl(), [
        200,
        this.contentTypes.json,
        JSON.stringify(githubResponses.reposGetFromOrg)
      ]);
    };

    this.githubReposGetAllAndOrgs = function(manual){
      this.start(manual);
      this.server.respondWith('GET', this.urls.githubReposFromOrgUrl(), [
        200,
        this.contentTypes.json,
        JSON.stringify(githubResponses.reposGetFromOrg)
      ]);
      this.server.respondWith('GET', this.urls.githubReposGetAllUrl(), [
        200,
        this.contentTypes.json,
        JSON.stringify(githubResponses.reposGetAll)
      ]);
      this.server.respondWith('GET', this.urls.githubUserGetOrgUrl(), [
        200,
        this.contentTypes.json,
        JSON.stringify(githubResponses.userGetOrgs)
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