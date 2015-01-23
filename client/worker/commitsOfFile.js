/*global onmessage:true, XMLHttpRequest, postMessage*/
var _accessToken = null,
  getCommits,
  getPageLinks,
  errorCallback,
  successCallback,
  commits;

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
      getCommits(getPageLinks(links).next);
    } else {
      postMessage({
        type: 'commits',
        commits: commits
      });
    }
  }
};

getCommits = function (url) {
  'use strict';
  var xhr = new XMLHttpRequest();
  xhr.myUrl = url;
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
    _accessToken = event.data.token;
    var url = 'https://api.github.com/repos/' +
      encodeURIComponent(event.data.user) +
      '/' +
      encodeURIComponent(event.data.repo) +
      '/commits?path=' +
      encodeURIComponent(event.data.path);

    if (event.data.sha) {
      url = url + '&sha=' + event.data.sha;
    }

    getCommits(url);
  }
};
