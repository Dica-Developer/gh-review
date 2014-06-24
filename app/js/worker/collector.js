/*global onmessage:true, XMLHttpRequest, postMessage, analyzeComments*/
var _accessToken = null;

var _urls = null;

var lastUrlLength = 0;
var eTags = null;
var setETags = false;

function getPageLinks(link) {
    'use strict';
    var links = {};
    link.replace(/<([^>]*)>;\s*rel="([\w]*)\"/g, function (m, uri, type) {
        links[type] = uri;
    });
    return links;
}

var errorCallback = function () {
    'use strict';
    // TODO post to application and print in UI
};

var successCallback = function (event) {
    'use strict';
    var xhr = event.currentTarget;
    if (xhr.status === 200) {
        var links = xhr.getResponseHeader('Link');
        if (links && links !== '' && links.indexOf(':') !== -1) {
            var next = getPageLinks(links).next;
            if (next) {
                analyzeComments(next);
            }
        }
        if (setETags) {
            if (eTags === null) {
                eTags = {};
            }
            eTags[xhr.myUrl] = xhr.getResponseHeader('ETag');
        }
        postMessage({
            type: 'comments',
            comments: xhr.response
        });
    }
};

function analyzeComments(url) {
    'use strict';
    var xhr = new XMLHttpRequest();
    xhr.myUrl = url;
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.setRequestHeader('content-type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('authorization', 'token ' + _accessToken);
    if (eTags !== null && eTags[url]) {
        xhr.setRequestHeader('If-None-Match', eTags[url]);
    }
    xhr.onerror = errorCallback;
    xhr.onload = successCallback;
    xhr.send();
}

function start() {
    'use strict';
    var idx = 0;
    var length = _urls.length;
    if (lastUrlLength !== length) {
        lastUrlLength = length;
        eTags = null;
    }
    for (; _urls !== null && idx < length; idx++) {
        analyzeComments(_urls[idx]);
        if (length - 1 === idx) {
            setETags = true;
        }
    }
}

onmessage = function (event) {
    'use strict';
    if ('token' === event.data.type) {
        _accessToken = event.data.token;
    } else if ('repositories' === event.data.type) {
        _urls = event.data.repositories;
        start();
        // TODO use setTimeout and start it after the last analyzeComments call
        setInterval(start, 60000);
    }
};