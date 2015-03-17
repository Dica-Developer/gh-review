(function (angular) {
  'use strict';

  angular.module('GHReview')
    .factory('Events', ['$injector', function ($injector) {

      var $timeout = $injector.get('$timeout'),
        eventCollector = $injector.get('eventCollector'),
        localStorageService = $injector.get('localStorageService');

      function Events(filter) {
        this.filter = filter;
        this.filterId = filter.getId();
        this.owner = filter.getOwner();
        this.repo = filter.getRepo();
        this.branch = filter.getBranch();
        this.filterIsHealthy = filter.isHealthy();
        this.events = [];
        this.etag = '';
        this.lastUpdate = new Date().getTime();

        var storedEvent = localStorageService.get(this.filterId + '_events');
        if(storedEvent) {
          this.events = storedEvent.events;
          this.etag = storedEvent.etag;
          this.lastUpdate = storedEvent.lastUpdate;
        }

        if (this.filterIsHealthy) {
          this.getEvents();
        }
      }

      Events.prototype.getEvents = function () {
        eventCollector.get({
          user: this.owner,
          repo: this.repo,
          etag: this.etag === '' ? false : this.etag
        })
          .then(this.preFilterByDateAndBranch.bind(this), function(){
            $timeout(function(){
              this.getEvents();
            }.bind(this), 60000);
          }.bind(this));
      };

      Events.prototype.preFilterByDateAndBranch = function (data) {
        var lastUpdate = this.lastUpdate,
          branch = this.branch;

        this.etag = data.etag;

        if (Array.isArray(data.result)) {
          this.events = data.result.reduce(function (initialValue, event) {
            /*jshint camelcase:false*/
            var createdAt = new Date(event.created_at).getTime(),
              eventBranch = false;

            if(event.payload && event.payload.ref && event.payload.ref === 'refs/heads/' + branch){
              eventBranch = true;
            }

            if (eventBranch && createdAt > lastUpdate) {
              initialValue.push(event);
            }
            return initialValue;
          }, this.events);
          this.save();
        }

        $timeout(function(){
          this.getEvents();
        }.bind(this), 60000);
      };

      Events.prototype.getPushEvents = function () {
        return this.events
          .reduce(function (initialValue, event) {
            if (event.type === 'PushEvent') {
              initialValue.push(event);
            }
            return initialValue;
          }, []);
      };

      Events.prototype.getCommitCommentEvent = function () {
        return this.events
          .reduce(function (initialValue, event) {
            if (event.type === 'CommitCommentEvent') {
              initialValue.push(event);
            }
            return initialValue;
          }, []);
      };

      Events.prototype.getCommits = function () {
        return this.getPushEvents()
          .reduce(function(initialValue, event){
            return initialValue.concat(event.payload.commits);
          }, []);
      };

      //Events.prototype.getComments = function () {
      //  return this.commentEvents;
      //};
      //
      //Events.prototype.removeCommit = function (commitId) {
      //  //TODO
      //};
      //
      //Events.prototype.removeComment = function (commentId) {
      //  //TODO
      //};

      Events.prototype.save = function () {
        this.lastUpdate = new Date().getTime();
        localStorageService.set(this.filterId + '_events', {
          events: this.events,
          lastUpdate: this.lastUpdate,
          etag: this.etag
        });
      };

      Events.prototype.remove = function () {
        localStorageService.remove(this.filterId + '_events');
      };

      return Events;
    }]);
}(angular));