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

        var storedEvent = localStorageService.get('events-' + this.filterId);
        if (storedEvent) {
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
          .then(this.preFilterByDateAndBranch.bind(this), function () {
            $timeout(function () {
              this.getEvents();
            }.bind(this), 60000);
          }.bind(this));
      };

      Events.prototype.preFilterByDateAndBranch = function (data) {
        var lastUpdate = this.lastUpdate,
          branch = this.branch,
          postEventLength = this.events.length;

        this.etag = data.etag;

        if (Array.isArray(data.result)) {
          this.events = data.result.reduce(function (initialValue, event) {
            /*jshint camelcase:false*/
            var createdAt = new Date(event.created_at).getTime(),
              eventBranch = false;

            if (event.payload && event.payload.ref && event.payload.ref === 'refs/heads/' + branch) {
              eventBranch = true;
            }

            if (eventBranch && createdAt > lastUpdate) {
              initialValue.push(event);
            }
            return initialValue;
          }, this.events);
          this.save();

          if(postEventLength < this.events.length){
            this.filter.invalidateCommitsCache();
          }
        }

        $timeout(function () {
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
          .reduce(function (initialValue, event) {
            return initialValue.concat(event.payload.commits);
          }, []);
      };

      Events.prototype.removeCommit = function (sha) {
        this.events = this.events.reduce(function (previous, event) {
          if (event.type === 'PushEvent') {
            event.payload.commits = event.payload.commits.reduce(function (previous, current) {
              if (current.sha !== sha) {
                previous.push(current);
              }
              return previous;
            }, []);

            if (event.payload.commits.length > 0) {
              previous.push(event);
            }
          } else {
            previous.push();
          }

          return previous;
        }, []);
        this.save();
      };

      Events.prototype.save = function () {
        this.lastUpdate = new Date().getTime();
        localStorageService.set('events-' + this.filterId, {
          events: this.events,
          lastUpdate: this.lastUpdate,
          etag: this.etag
        });
      };

      Events.prototype.remove = function () {
        localStorageService.remove('events-' + this.filterId);
      };

      return Events;
    }]);
}(angular));