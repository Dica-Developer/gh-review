/*global onmessage:true, XMLHttpRequest, postMessage*/
var _accessToken = null,
  getCommits,
  getPageLinks,
  errorCallback,
  successCallback,
  commits,
  commitHash = {};

getPageLinks = function (link) {
  'use strict';
  var links = {};
  link.replace(/<([^>]*)>;\s*rel="([\w]*)\"/g, function (m, uri, type) {
    links[type] = uri;
  });
  return links;
};

errorCallback = function () {
  'use strict';
  // TODO post to application and print in UI
};

successCallback = function (event) {
  'use strict';
  var xhr = event.currentTarget;
  if (xhr.status === 200) {
    var links = xhr.getResponseHeader('Link');
    commits = commits.concat(xhr.response);
    if (links && links !== '' && links.indexOf(':') !== -1 && getPageLinks(links).next) {
      getCommits(getPageLinks(links).next, xhr.orgUrl);
      postMessage({
        type: 'progress',
        commits: commits
      });
    } else {
      commitHash[xhr.orgUrl] = commits;
      postMessage({
        type: 'done',
        commits: commits
      });
    }
  }
};

getCommits = function (url, orgUrl) {
  'use strict';
  var xhr = new XMLHttpRequest();
  xhr.orgUrl = orgUrl || url;
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.setRequestHeader('authorization', 'token ' + _accessToken);
  xhr.onerror = errorCallback;
  xhr.onload = successCallback;
  xhr.send();
};

onmessage = function (event) {
  'use strict';
  if ('getCommits' === event.data.type) {
    commits = [];
    _accessToken = event.data.accessToken;
    var githubMsg = event.data.msg;
    var url = 'https://api.github.com/repos';
    url += '/' + githubMsg.user;
    url += '/' + githubMsg.repo;
    url += '/commits';
    url += '?sha=' + githubMsg.sha;
    url += '&per_page=100';

    if(githubMsg.until){
      url += '&until=' + githubMsg.until;
    }

    if(githubMsg.path){
      url += '&path=' + githubMsg.path;
    }

    if(githubMsg.author){
      url += '&author=' + githubMsg.author;
    }


    if(githubMsg.since){
      //TODO should be handled by Filter set since always to full day without hours:minutes:seconds
      var simpleDate = new Date(new Date(githubMsg.since).toDateString());
      url += '&since=' + simpleDate.toISOString();
    }


    //TODO invalidate cache after a given time eg. 15min
    if(commitHash[url]){
      postMessage({
        type: 'done',
        commits: commitHash[url]
      });
    } else {
      getCommits(url);
    }
  }
};
