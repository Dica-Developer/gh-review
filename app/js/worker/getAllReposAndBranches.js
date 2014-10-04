/*global Promise*/
(function (worker) {
  'use strict';
  var baseUrl = 'https://api.github.com/';
  var _accessToken = '';
  var repoPromises = [];
  var branchPromises = [];
  var repos = [];
  var branches = {};
  var singleRepoBranches = [];

  var askGithub = function (url, successCallback, errorCallback) {
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'json';
    req.setRequestHeader('authorization', 'token ' + _accessToken);
    req.onerror = errorCallback;
    req.onload = successCallback;
    req.send();
  };

  var getPageLinks = function (link) {
    var links = {};
    link.replace(/<([^>]*)>;\s*rel="([\w]*)\"/g, function (m, uri, type) {
      links[type] = uri;
    });
    return links;
  };

  var sortRepoAndBranches = function () {
    var sortedResult = {};
    repos.forEach(function (repo) {
      /*jshint camelcase:false*/
      var fullName = repo.full_name;
      var repoType = '';
      if (repo.owner.type === 'Organization') {
        repoType = 'Organization';
      } else if (repo.owner.type === 'User' && repo.private) {
        repoType = 'Private';
      } else if (repo.owner.type === 'User' && !repo.private) {
        repoType = 'Public';
      }
      sortedResult[fullName] = {
        name: repo.name,
        fullName: fullName,
        ownerName: fullName.split('/')[0],
        id: repo.id,
        branches: branches[fullName],
        language: repo.language,
        'private': repo.private,
        stargazers: repo.stargazers_count,
        size: repo.size,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        watchers: repo.watchers_count,
        repoType: repoType,
        openIssues: repo.open_issues_count,
        owner: {
          id: repo.owner.id,
          login: repo.owner.login
        }
      };

    });
    worker.postMessage({
      type: 'result',
      repos: sortedResult
    });
  };

  //TODO add paging for branches eg. dap has more than 30
  var getBranchesForSingleRepo = function (repo) {
    return new Promise(function (resolve, reject) {
      var successCallback = function (event) {
        var req = event.currentTarget;
        if (req.status === 200) {
          singleRepoBranches = singleRepoBranches.concat(req.response);
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
        } else {
          reject();
        }
      };
      var url = baseUrl + 'repos/' + repo + '/branches';
      askGithub(url, successCallback, reject);
    });
  };

  var collectBranches = function () {
    repos.forEach(function (repo) {
      /*jshint camelcase:false*/
      var repoName = repo.full_name;
      branchPromises.push(getBranchesForSingleRepo(repoName));
    });
    Promise.all(branchPromises)
      .then(sortRepoAndBranches);
  };

  var getRepos = function (orgOrUser, org) {
    return new Promise(function (resolve, reject) {
      var url = baseUrl + '';
      if (org) {
        url += 'orgs/' + orgOrUser + '/repos';
      } else {
        url += 'user/repos';
      }

      var successCallback = function (event) {
        var req = event.currentTarget;
        if (req.status === 200) {
          repos = repos.concat(req.response);
          resolve();
        }
      };
      askGithub(url, successCallback, reject);
    });
  };

  var getOrgsFromUser = function (user) {
    var url = baseUrl + 'user/orgs';

    var successCallback = function (event) {
      var req = event.currentTarget;
      if (req.status === 200) {
        var orgs = req.response;
        orgs.forEach(function (organization) {
          var orgName = organization.login;
          repoPromises.push(getRepos(orgName, true));
        });
        repoPromises.push(getRepos(user, false));
        Promise.all(repoPromises)
          .then(collectBranches);
      }
    };

    var errorCallback = function (event) {
      console.log(event);
    };

    askGithub(url, successCallback, errorCallback);
  };

  var getAllReposFromUser = function (user) {
    var url = baseUrl + 'user/orgs';

    var successCallback = function (event) {
      var req = event.currentTarget;
      if (req.status === 200) {
        var orgs = req.response;
        orgs.forEach(function (organization) {
          var orgName = organization.login;
          repoPromises.push(getRepos(orgName, true));
        });
        repoPromises.push(getRepos(user, false));
        Promise.all(repoPromises)
          .then(function(){
            worker.postMessage({
              type: 'result',
              repos: repos
            });
          });
      }
    };

    var errorCallback = function (event) {
      console.log(event);
    };

    askGithub(url, successCallback, errorCallback);
  };

  var getBranchesForRepo = function(repo){
    getBranchesForSingleRepo(repo)
      .then(function(){
        worker.postMessage({
          type: 'result',
          branches: singleRepoBranches
        });
      });
  };

  worker.onmessage = function (event) {
    var user = null;
    if ('getReposAndBranches' === event.data.type) {
      user = event.data.user;
      _accessToken = event.data.accessToken;
      getOrgsFromUser(user);
    } else if('getAllRepos' === event.data.type) {
      user = event.data.user;
      _accessToken = event.data.accessToken;
      getAllReposFromUser(user);
    } else if('getBranchesForRepo' === event.data.type) {
      _accessToken = event.data.accessToken;
      getBranchesForRepo(event.data.repo);
    }
  };
}(this));
