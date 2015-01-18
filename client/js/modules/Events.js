(function (angular) {
  'use strict';
  var __ = null,
    _moment = null;

  var fetchEventsForFilter = function (filter) {
    var _this = this,
      defer = this.$q.defer(),
      url = filter.getOwner() + '/' + filter.getRepo();


    var fetch = function () {
      var githubParams = {
        user: filter.getOwner(),
        repo: filter.getRepo()
      };
      if (_this.urlEtags[url]) {
        githubParams.headers = {
          'If-None-Match': _this.urlEtags[url]
        };
      }

      _this.github.events.getFromRepo(githubParams, function (err, res) {
        if (!err) {
          if (res.meta) {
            if (!__.isUndefined(res.meta['x-poll-interval'])) {
              _this.maxPollInterval = Math.max(_this.maxPollInterval, parseInt(res.meta['x-poll-interval'], 10));
            }
            if (!__.isUndefined(res.meta.etag)) {
              _this.urlEtags[url] = res.meta.etag;
            }
          }
          delete res.meta;

          //modified since last eTag or new events at all
          if (res.length) {
            _this.eventsByUrl[url] = res;
          }
        }
        defer.resolve();
      });
    };

    if (__.contains(this.fetchedUrls, url)) {
      defer.resolve();
    } else {
      this.fetchedUrls.push(url);
      fetch();
    }

    return defer.promise;
  };

  function getNewCommits(filter, eventsByUrl, filterAuthors, currentUserLogin, lastUpdated) {
    var filterRef = 'refs/heads/' + filter.getBranch(),
      eventsFilteredByPushEvent;
    if (lastUpdated) {
      var eventsFilteredByLastUpdate = __.filter(eventsByUrl, function (event) {
        /*jshint camelcase:false*/
        if (_moment(lastUpdated).isBefore(event.created_at)) {
          return event;
        }
      });
      eventsFilteredByPushEvent = __.filter(eventsFilteredByLastUpdate, {type: 'PushEvent'});
    } else {
      eventsFilteredByPushEvent = __.filter(eventsByUrl, {type: 'PushEvent'});
    }
    var eventsFilteredByActor = __.filter(eventsFilteredByPushEvent, function (event) {
      var eventActor = event.actor.login;
      if (eventActor !== currentUserLogin && ((filterAuthors.length > 0 && __.contains(filterAuthors, eventActor)) || (filterAuthors.length === 0))) {
        return event;
      }
    });
    var pushEventsFilteredByRef = __.filter(eventsFilteredByActor, {payload: {ref: filterRef}});
    var eventPayloads = __.pluck(pushEventsFilteredByRef, 'payload');
    var eventCommits = __.pluck(eventPayloads, 'commits');
    var flattenedCommitArray = __.flatten(eventCommits);
    return __.pluck(flattenedCommitArray, 'sha');
  }

  var prozessEvents = function () {
    var defer = this.$q.defer(),
      deferList = [];

    __.each(this.filter.getAll(), function (filter/*, index*/) {
      var defer = this.$q.defer(),
        filterUrl = filter.getOwner() + '/' + filter.getRepo(),
        filterAuthors = filter.getAuthors(),
        eventsByUrl = this.eventsByUrl[filterUrl];

      deferList.push(defer.promise);

      if (eventsByUrl) {
        var lastUpdated = false;
        if (!this.allEvents[filter.getId()]) {
          this.allEvents[filter.getId()] = {};
        }
        if (this.allEvents[filter.getId()].lastUpdated) {
          lastUpdated = this.allEvents[filter.getId()].lastUpdated;
        }
        this.allEvents[filter.getId()].commits = getNewCommits(filter, eventsByUrl, filterAuthors, this.userData.login, lastUpdated);
        this.allEvents[filter.getId()].lastUpdated = _moment().format();
      }

      defer.resolve();
    }, this);

    this.$q.all(deferList)
      .then(defer.resolve);
    return defer.promise;
  };

  function Events($q, _, moment, github, filter, localStorageService, githubUserData) {
    __ = _;
    _moment = moment;
    this.$q = $q;
    this.github = github;
    this.filter = filter;
    this.localStorageService = localStorageService;
    this.maxPollInterval = 60;
    this.eventsByUrl = {};
    this.fetchedUrls = [];
    this.githubUserData = githubUserData;
    this.init();
  }

  Events.prototype.init = function () {
    this.allEvents = this.localStorageService.get('events') || {};
    this.urlEtags = this.localStorageService.get('eventsUrlEtags') || {};
    this.githubUserData.get()
      .then(function (userData) {
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
    __.each(this.allEvents, function (events) {
      __.remove(events.commits, function (sha) {
        return sha === commitSha;
      });
    });
    this.localStorageService.set('events', this.allEvents);
  };

  Events.prototype.fetch = function () {
    var _this = this;
    var allFilter = this.filter.getAll();
    var deferList = __.map(allFilter, fetchEventsForFilter, this);
    this.$q.all(deferList)
      .then(prozessEvents.bind(this))
      .then(function () {
        _this.localStorageService.set('events', _this.allEvents);
        _this.localStorageService.set('eventsUrlEtags', _this.urlEtags);
        _this.fetchedUrls = [];
        __.delay(_this.fetch.bind(_this), _this.maxPollInterval * 1000);
      });
  };

  var eventsModule = angular.module('GHReview');
  eventsModule.service('events', ['$q', '_', 'moment', 'github', 'filter', 'localStorageService', 'githubUserData', Events]);

}(angular));