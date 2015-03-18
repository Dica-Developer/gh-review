(function (angular) {
  'use strict';

  angular.module('EventsMock', [])
    .factory('Events', function () {

      function Events() {
        this.filterId = 'test_id';
        this.owner = 'test_owner';
        this.repo = 'test_repo';
        this.branch = 'test_branch';
        this.filterIsHealthy = true;
        this.events = [];
        this.etag = '';
        this.lastUpdate = new Date().getTime();

        if (this.filterIsHealthy) {
          this.getEvents();
        }
      }

      Events.prototype.getEvents = function () {

      };

      Events.prototype.preFilter = function () {

      };

      Events.prototype.getPushEvents = function () {

      };


      Events.prototype.getCommits = function () {

      };

      Events.prototype.removeCommit = function () {

      };

      Events.prototype.markAllCommitsAsRead = function () {

      };

      Events.prototype.save = function () {

      };

      Events.prototype.remove = function () {

      };

      return Events;
    });
}(angular));