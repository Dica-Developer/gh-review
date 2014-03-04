/*global define, window*/
define(function (require) {
  'use strict';
  var $ = require('jquery');
  var Backbone = require('backbone');
  var app = require('app');
  var RepoView = require('RepoView');
  var RepoDetailView = require('RepoDetailView');
  var FilterOverview = require('FilterOverview');
  var FilterModel = require('FilterModel');
  var CommitListView = require('CommitListView');
  var commitCollection = require('commitCollection');
  var CommentView = require('CommentView');
  var oauthHandler = require('OauthHandler');
  var loginLogout = require('loginLogout');
  var WhoAmI = require('WhoAmI');
  var UserModel = require('UserModel');
  var WelcomeView = require('WelcomeView');
  var AboutView = require('AboutView');
  var StatisticsOverviewView = require('StatisticsOverviewView');
  var StatisticView = require('StatisticView');
  var StatisticModel = require('StatisticModel');

  return Backbone.Router.extend({
    view: null,
    routes: {
      '': 'root',
      'filter': 'filter',
      'repositories': 'repositories',
      'repository/:name': 'repoDetail',
      'commits/:owner/:repo/:branch': 'commitList',
      'commit/:id': 'showCommit',
      'login': 'login',
      'logout': 'logout',
      'oauth/accesstoken': 'getAccessToken',
      'oauth/callback': 'callback',
      'whoami': 'whoami',
      'about': 'about',
      'statistics': 'statisticsOverview',
      'statistic/:owner/:repo/:branch': 'statistic'
    },
    filter: function () {
      this.prepareView('reviewLink');
      this.view = new FilterOverview();
      this.view.render();
    },
    repositories: function () {
      if (app.authenticated) {
        this.prepareView('repositoryLink');
        this.view = new RepoView({
          collection: app.repoCollection
        });
      }
    },
    repoDetail: function (name) {
      if (app.authenticated) {
        this.prepareView('repositoryLink');
        var model = app.repoCollection.getRepoByName(name);
        this.view = new RepoDetailView({
          model: model
        });
      }
    },
    commitList: function (owner, repo, branch) {
      this.prepareView('reviewLink');
      var model = app.currentFilter;
      if (null !== model || owner !== model.get('owner') || repo !== model.get('repo') || branch !== model.get('branch')) {
        model = new FilterModel({
          owner: owner,
          repo: repo,
          branch: branch
        });
        app.currentFilter = model;
      }
      this.view = new CommitListView({
        model: model
      });
      this.view.getCommits()
        .then(function () {
          this.view.render();
          this.view.renderAllCommits();
        }.bind(this));
    },
    showCommit: function (id) {
      this.prepareView('reviewLink');
      var model = commitCollection.get(id);
      this.view = new CommentView({
        model: model
      });
      this.view.getDiffAndComments()
        .then(this.view.render.bind(this.view));
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
          this.navigate('filter', {trigger: true});
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
    about: function(){
      this.prepareView();
      this.view = new AboutView();
      this.view.getChangeLog()
        .then(function(){
          this.view.render();
          this.trigger('ajaxIndicator', false);
        }.bind(this));
    },
    statisticsOverview: function(){
      this.prepareView('statisticsLink');
      this.view = new StatisticsOverviewView();
      this.view.render();
      this.trigger('ajaxIndicator', false);
    },
    statistic: function(owner, repo, branch){
      this.prepareView('statisticsLink');
      console.log(owner, repo, branch);
      var model = new StatisticModel({
        owner: owner,
        repo: repo,
        branch: branch
      });
      this.view = new StatisticView({model: model});
      this.view.model.computeStatistics()
        .then(function(){
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