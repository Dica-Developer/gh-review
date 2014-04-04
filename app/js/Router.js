/*global define, window*/
define(function (require) {
  'use strict';
  var $ = require('jquery');
  var Backbone = require('backbone');
  var app = require('app');
  var FilterOverview = require('FilterOverview');
  var FilterModel = require('FilterModel');
  var CommitListView = require('CommitListView');
  var CommentView = require('CommentView');
  var oauthHandler = require('OauthHandler');
  var loginLogout = require('loginLogout');
  var WhoAmI = require('WhoAmI');
  var UserModel = require('UserModel');
  var WelcomeView = require('WelcomeView');
  var AboutView = require('AboutView');
  var CommitModel = require('commitModel');
  var ModulesOverview = require('ModulesOverview');
  var FileView = require('FileView');
  var FilterView = require('_FilterView');

  return Backbone.Router.extend({
    view: null,
    routes: {
      '': 'root',
      'filter': 'filter',
      '_filter': '_filter',
      'filter/modules': 'filterModules',
      'commits/filter/:filterID': 'commitListByFilter',
//      'commits/:owner/:repo/:branch': 'commitList',
      'commit/filter/:commitId': 'showCommitByFilter',
//      'commit/:owner/:repo/:branch/:id': 'showCommit',
      'commit/:owner/:repo/:sha': 'showOneCommit',
      'login': 'login',
      'logout': 'logout',
      'oauth/accesstoken': 'getAccessToken',
      'oauth/callback': 'callback',
      'whoami': 'whoami',
      'about': 'about',
      'statistics': 'statisticsOverview',
      'statistic/:owner/:repo/:branch': 'statistic',
      'file/:owner/:repo/:path': 'showFile'
    },
    filter: function () {
      this.prepareView('reviewLink');
      this.view = new FilterOverview();
      this.view.render();
    },
    _filter: function () {
      this.prepareView('_filterLink');
      this.view = new FilterView();
      this.view.render();
    },
    filterModules: function () {
      this.prepareView('reviewModulesLink');
      this.view = new ModulesOverview();
      this.view.render();
      this.trigger('ajaxIndicator', false);
    },
    commitListByFilter: function (commitId) {
      this.prepareView('reviewLink');
      var filter = app.filterCollection.get(commitId);
      if (typeof app.currentFilter === 'undefined') {
        app.currentFilter = filter;
      } else if(app.currentFilter.get('id') === filter.get('id')){
        filter = app.currentFilter;
      } else {
        app.currentFilter = filter;
      }
      this.view = new CommitListView({
        model: filter
      });
      this.view.getAllCommits();
    },
//    todo not used yet but later to type needed information manually in browser address bar
//    commitList: function (owner, repo, branch) {
//      this.prepareView('reviewLink');
//      var filter = new FilterModel();
//      filter.setOwner(owner);
//      filter.setRepo(repo);
//      filter.setBranch(branch);
//      app.currentFilter = filter;
//      this.view = new CommitListView({
//        model: filter
//      });
//      this.view.getAllCommits();
//    },
    showCommitByFilter: function(commitId){
      var model = app.currentFilter.getCollection().findWhere({sha: commitId});
      model.user = app.currentFilter.get('user');
      model.repo = app.currentFilter.get('repo');
      this.view = new CommentView({
        model: model
      });
      this.view.filter = app.currentFilter;
      this.view.getDiffAndComments()
        .then(this.view.render.bind(this.view));
    },
//    todo not used yet but later to type needed information manually in browser address bar
//    showCommit: function (owner, repo, branch, id, filterId) {
//      this.prepareView('reviewLink');
//      var filter = null;
//      var model = null;
//      if (filterId) {
//        filter = app.filterCollection.get(filterId);
//        model = filter.getCollection().get(id);
//      } else {
//        filter = new FilterModel();
//        filter.setOwner('owner');
//        filter.setRepo('repo');
//        filter.setBranch('branch');
//        model = new CommitModel();
//      }
//      model.user = filter.get('user');
//      model.repo = filter.get('repo');
//      this.view = new CommentView({
//        model: model
//      });
//      this.view.filter = filter;
//      this.view.getDiffAndComments()
//        .then(this.view.render.bind(this.view));
//    },
    showOneCommit: function (owner, repo, sha) {
      var _this = this;
      this.prepareView('reviewLink');
      var message = {
        headers: [],
        sha: sha,
        user: owner,
        repo: repo
      };
      app.github.repos.getCommit(message, function (error, commit) {
        if (!error) {
          app.currentReviewData = {
            user: owner,
            repo: repo
          };
          app.currentFilter = new FilterModel({
            owner: owner,
            repo: repo,
            contributor: commit.author.login
          });
          _this.view = new CommentView({
            model: new CommitModel(commit)
          });
          _this.view.getDiffAndComments()
            .then(_this.view.render.bind(_this.view));
        }
      });
    },
    showFile: function (owner, repo, path) {
      var _this = this;
      this.prepareView('reviewLink');
      _this.view = new FileView({
        model: {
          user: owner,
          repo: repo,
          path: path
        }
      });
      _this.view.render();
    },
    clear: function () {
      var main = $('#main');
      main.html('');
      main.off();
    },
    login: loginLogout.login.bind(loginLogout),
    logout: loginLogout.logout.bind(loginLogout),
    getAccessToken: function () {
      this.trigger('ajaxIndicator', true);
      this.clear();
      oauthHandler.getAccessToken();
    },
    callback: function () {
      // TODO github didn't work with our # urls so this is currently handled by the root function in non authenticated case
      this.clear();
      oauthHandler.callback();
    },
    root: function () {
      this.trigger('ajaxIndicator', true);
      var url = window.location.href;
      var error = url.match(/[&\?]error=([^&]+)/);
      var code = url.match(/[&\?]code=([\w\/\-]+)/);

      if (!app.authenticated) {
        if (error || code) {
          oauthHandler.callback();
        }
      } else {
        if (app.filterCollection.length < 1) {
          this.showWelcomeScreen();
        } else {
          this.navigate('filter', {
            trigger: true
          });
        }
      }
      this.trigger('ajaxIndicator', false);
    },
    showWelcomeScreen: function () {
      this.prepareView();
      this.view = new WelcomeView();
      this.view.render();
      this.trigger('ajaxIndicator', false);
    },
    whoami: function () {
      this.trigger('ajaxIndicator', true);
      this.clear();
      var model = new UserModel();
      this.view = new WhoAmI({
        model: model
      });
      model.getUserData().then(function () {
        this.view.render();
      }.bind(this));
    },
    about: function () {
      this.prepareView();
      this.view = new AboutView();
      this.view.getChangeLog()
        .then(function () {
          this.view.render();
          this.trigger('ajaxIndicator', false);
        }.bind(this));
    },
    prepareView: function (activeLink) {
      this.trigger('ajaxIndicator', true);
      this.clear();
      $('li[name="ghr-top-menu-links"]').removeClass('active');
      if (activeLink) {
        $('#' + activeLink).addClass('active');
      }
    },
    initialize: function () {
    }
  });
});
