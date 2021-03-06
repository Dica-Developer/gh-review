/*global Promise*/
(function (worker) {
  'use strict';

  var _accessToken = '';
  var _urls = [];
  var urlPromises = [];
  var commentsForRepo = {};
  var commitApproved = {};
  var approveComments = {};
  var timeout = null;

  var getPageLinks = function (link) {
    var links = {};
    link.replace(/<([^>]*)>;\s*rel="([\w]*)\"/g, function (m, uri, type) {
      links[type] = uri;
    });
    return links;
  };

  var askGithub = function (url, successCallback, errorCallback) {
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'json';
    req.setRequestHeader('authorization', 'token ' + _accessToken);
    req.setRequestHeader('Accept', 'application/vnd.github-commitcomment.full+json');
    req.addEventListener('load', successCallback, false);
    req.addEventListener('error', errorCallback, false);
    req.addEventListener('abort', errorCallback, false);
    req.send();
  };

  var sortOutApproveComments = function (comments) {
    return new Promise(function (resolve) {
      var approveCommit = function (comment) {
        /*jshint camelcase:false*/
        if (true !== commitApproved[comment.commit_id]) {
          commitApproved[comment.commit_id] = true;
        }
        if (true !== approveComments[comment.id]) {
          approveComments[comment.id] = true;
        }
      };

      comments.forEach(function (comment, idx) {
        var commentBody = comment.body;
        if (commentBody) {
          var startIndex = commentBody.indexOf('```json');
          if (startIndex > -1) {
            var endIndex = commentBody.lastIndexOf('```');
            if (endIndex > -1) {
              commentBody = commentBody.substring(7, endIndex);
              commentBody = JSON.parse(commentBody);
              if (true === commentBody.approved) {
                approveCommit(comment, idx);
              }
            }
          }
        }
      });
      resolve();
    });
  };

  var analyzeComments = function () {
    return new Promise(function (resolve) {
      var sortOutPromises = [];
      Object.keys(commentsForRepo).forEach(function (key) {
        sortOutPromises.push(sortOutApproveComments(commentsForRepo[key]));
      });

      Promise.all(sortOutPromises)
        .then(resolve);
    });
  };

  var getComments = function (url) {
    return new Promise(function (resolve, reject) {
      var successCallback = function (event) {
        var req = event.currentTarget;
        if (req.status === 200) {
          if (commentsForRepo[url].length > 0) {
            commentsForRepo[url] = commentsForRepo[url].concat(req.response);
          } else {
            commentsForRepo[url] = req.response;
          }

          var links = req.getResponseHeader('Link');
          if (links && links !== '' && links.indexOf(':') !== -1) {
            var next = getPageLinks(links).next;
            if (next) {
              askGithub(next, successCallback, reject);
            } else {
              resolve();
            }
          } else {
            resolve();
          }
        }
      };
      askGithub(url, successCallback, reject);
    });
  };

  var postResults = function () {
    worker.postMessage({
      type: 'commentsCollected',
      commentsForRepo: commentsForRepo,
      commitApproved: commitApproved,
      approveComments: approveComments
    });
    timeout = setTimeout(start, 300000);
  };

  var start = function () {
    clearTimeout(timeout);
    var uniqUrls = [];
    _urls.forEach(function (url) {
      if (uniqUrls.indexOf(url) === -1) {
        uniqUrls.push(url);
        commentsForRepo[url] = [];
        urlPromises.push(getComments(url));
      }
    });
    Promise.all(urlPromises)
      .then(analyzeComments)
      .then(postResults);
  };

  worker.onmessage = function (event) {
    var type = event.data.type;
    switch (type) {
    case 'accessToken':
      _accessToken = event.data.accessToken;
      break;
    case 'repositories':
      _urls = event.data.repositories;
      break;
    case 'repository':
      if (_urls.indexOf(event.data.repository) === -1) {
        _urls.push(event.data.repository);
      }
      break;
    case 'start':
      start();
      break;
    case 'pause':
      clearTimeout(timeout);
      break;
    default:
      throw new Error('Unknown event type: ' + type);
    }
  };
}(this));
