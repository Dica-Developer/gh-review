/*global onmessage:true, XMLHttpRequest, postMessage, analyzeComments*/
var _accessToken = null;

var _urls = null;

function getPageLinks(link) {
  'use strict';
  var links = {};
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
  var links = xhr.getResponseHeader('Link');
  if (links && links !== '' && links.indexOf(':') !== -1) {
    var next = getPageLinks(links).next;
    if (next) {
      analyzeComments(next);
    }
  }
  xhr.response.forEach(function (comment) {
    postMessage({
      type: 'comment',
      comment: comment
    });
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
  var idx = 0;
  for (; _urls !== null && idx < _urls.length; idx++) {
    analyzeComments(_urls[idx]);
  }
}

onmessage = function (event) {
  'use strict';
  if ('token' === event.data.type) {
    _accessToken = event.data.token;
    start();
    // TODO use setTimeout and start it after the last analyzeComments call
    setInterval(start, 60000);
  } else if ('repositories' === event.data.type) {
    _urls = event.data.repositories;
    start();
  }
};