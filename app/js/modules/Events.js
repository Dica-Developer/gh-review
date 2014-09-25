/*global define*/
define(['angular', 'lodash'], function (angular, _) {
  'use strict';

  var fetchEventsForFilter = function (filter) {
    var _this = this,
      defer = this.$q.defer(),
      url = filter.getOwner() + '/' + filter.getRepo();


    var fetch = function () {
      var githubParams = {
        user: filter.getOwner(),
        repo: filter.getRepo()
      };

      if (this.urlEtags[url]) {
        githubParams.headers = {
          'If-None-Match': this.urlEtags[url]
        };
      }

      this.github.events.getFromRepo(githubParams, function (err, res) {
        if (res.meta) {
          _this.maxXPollInterval = Math.max(_this.maxXPollInterval, parseInt(res.meta['x-poll-interval'], 10));
          _this.urlEtags[url] = res.meta.etag;
        }
        delete res.meta;

        //modified since last eTag or new events at all
        if (res.length) {
          _this.eventsByUrl[url] = res;
        }
        defer.resolve();
      });
    }.bind(this);

    if (_.contains(this.fetchedUrls, url)) {
      defer.resolve();
    } else {
      this.fetchedUrls.push(url);
      fetch();
    }

    return defer.promise;
  };

  function getNewCommits(filter, eventsByUrl, filterAuthors, currentUserLogin) {
    var filterRef = 'refs/heads/' + filter.getBranch();
    var eventsFilteredByPushEvent = _.filter(eventsByUrl, {type: 'PushEvent'});
    var eventsFilteredByActor = _.filter(eventsFilteredByPushEvent, function (event) {
      var eventActor = event.actor.login;
      if (eventActor !== currentUserLogin && ((filterAuthors.length > 0 && _.contains(filterAuthors, eventActor)) || (filterAuthors.length === 0))) {
        return event;
      }
    });
    var pushEventsFilteredByRef = _.filter(eventsFilteredByActor, {payload: {ref: filterRef}});
    var eventPayloads = _.pluck(pushEventsFilteredByRef, 'payload');
    var eventCommits = _.pluck(eventPayloads, 'commits');
    var flattenedCommitArray = _.flatten(eventCommits);
    return _.pluck(flattenedCommitArray, 'sha');
  }

  var prozessEvents = function () {
    var defer = this.$q.defer(),
      deferList = [];

    _.each(this.filter.getAll(), function (filter/*, index*/) {
      var defer = this.$q.defer(),
        filterUrl = filter.getOwner() +'/'+ filter.getRepo(),
        filterAuthors = filter.getAuthors(),
        eventsByUrl = this.eventsByUrl[filterUrl];

      deferList.push(defer.promise);

      if(eventsByUrl) {
        if(!this.allEvents[filter.getId()]){
          this.allEvents[filter.getId()] = {};
        }
        this.allEvents[filter.getId()].commits = getNewCommits(filter, eventsByUrl, filterAuthors, this.userData.login);
      }

      defer.resolve();
    }, this);

    this.$q.all(deferList)
      .then(defer.resolve);
    return defer.promise;
  };

  function Events($q, github, filter, localStorageService, githubUserData) {
    this.$q = $q;
    this.github = github;
    this.filter = filter;
    this.localStorageService = localStorageService;
    this.maxXPollInterval = 60;
    this.eventsByUrl = {};
    this.fetchedUrls = [];
    this.githubUserData = githubUserData;
    this.init();
  }

  Events.prototype.init = function () {
    this.allEvents = this.localStorageService.get('events') || {};
    this.urlEtags = this.localStorageService.get('eventsUrlEtags') || {};
    this.githubUserData.get()
      .then(function(userData){
        this.userData = userData;
      }.bind(this));
    this.fetch();
  };

  Events.prototype.getAll = function () {
    return this.allEvents;
  };

  Events.prototype.getForFilter = function (filter) {
    return this.allEvents[filter.getId()];
  };

  Events.prototype.getCommitComments = function (filter) {
    return this.allEvents[filter.getId()].commitComments;
  };

  Events.prototype.getCommits = function (filter) {
    return this.allEvents[filter.getId()].commits;
  };

  Events.prototype.removeNewCommit = function (commitSha) {
    _.each(this.allEvents, function(events){
      _.remove(events.commits, function(sha){
        return sha === commitSha;
      });
    });
    this.localStorageService.set('events', this.allEvents);
  };

  Events.prototype.fetch = function () {
    var _this = this;
    var allFilter = this.filter.getAll();
    var deferList = _.map(allFilter, fetchEventsForFilter, this);
    this.$q.all(deferList)
      .then(prozessEvents.bind(this))
      .then(function () {
        _this.localStorageService.set('events', _this.allEvents);
        _this.localStorageService.set('eventsUrlEtags', _this.urlEtags);
        _.delay(_this.fetch.bind(_this), _this.maxXPollInterval * 1000);
      });
  };

  var eventsModule = angular.module('GHReview.Events', []);
  eventsModule.service('events', ['$q', 'github', 'filter', 'localStorageService', 'githubUserData', Events]);

})
;