/*global onmessage, XMLHttpRequest, postMessage, analyzeComments*/
var _accessToken = null;

function getPageLinks(link) {
  'use strict';
  var links = {};
  // link format:
  // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
  link.replace(/<([^>]*)>;\s*rel="([\w]*)\"/g, function (m, uri, type) {
    links[type] = uri;
  });
  return links;
}

function errorCallback() {
  'use strict';
  // TODO post to application and print in UI
}

function successCallback(event) {
  'use strict';
  var xhr = event.currentTarget;
  // TODO parse out the link header and the next url
  var links = xhr.getResponseHeader('Link');
  if (links && links !== '' && links.indexOf(':') !== -1) {
    var next = getPageLinks(links).next;
    if (next) {
      analyzeComments(next);
    }
  }
  xhr.response.forEach(function (comment) {
    if (comment.body.indexOf('Approved by @') > -1) {
      postMessage({
        type: 'comment',
        comment: comment
      });
    }
  });
}

function analyzeComments(url) {
  'use strict';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.setRequestHeader('content-type', 'application/json; charset=utf-8');
  xhr.setRequestHeader('authorization', 'token ' + _accessToken);
  xhr.onerror = errorCallback;
  xhr.onload = successCallback;
  xhr.send();
}

function start() {
  'use strict';
  // TODO get all filtered repositories and fetch there comments
  var urls = ['https://api.github.com/repos/Dica-Developer/gh-review/comments'];
  var idx = 0;
  for (idx = 0; idx < urls.length; idx++) {
    analyzeComments(urls[idx]);
  }
}

onmessage = function (event) {
  'use strict';
  if ('token' === event.data.type) {
    _accessToken = event.data.token;
    start();
  }
};