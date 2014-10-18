/*global Notification*/
(function (angular) {
  'use strict';

  angular.module('GHReview')
    .controller('NotificationController', ['$scope', '_', 'events', 'filter', 'githubUserData', function ($scope, _, events, filter, githubUserData) {

      var allFilter = filter.getAll(),
        filterWithNotificationSettings = [],
        notificationPermissionGranted = false,
        currentUser = githubUserData.login;

      if (Notification && Notification.permission === 'granted') {
        notificationPermissionGranted = true;
      } else if (Notification && Notification.permission === 'default') {
        Notification.requestPermission(function (permission) {
          notificationPermissionGranted = (permission === 'granted');
        });
      }

      var registerDeregisterFilter = function (filter) {
        if (filter.hasNotificationSettings()) {
          filterWithNotificationSettings.push(filter);
        } else {
          var index = _.findIndex(filterWithNotificationSettings, filter);
          filterWithNotificationSettings.splice(index, 1);
        }
      };

      allFilter.forEach(function (filter) {
        $scope.$watch(filter.hasNotificationSettings.bind(filter), function (newValue, oldValue) {
          if (newValue !== oldValue) {
            console.log(newValue, oldValue);
            registerDeregisterFilter(filter);
          }
        });
        registerDeregisterFilter(filter);
      });

      $scope.$watch(events.CommitCommentEvent, function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          console.log('CommitCommentEvent', newValue, oldValue);
          filterWithNotificationSettings.forEach(function (filter) {
            var repoFullName = filter.getOwner() + '/' + filter.getRepo();
            var newCommitComments = _.filter(newValue, {'repo': {'name': repoFullName}});
            if (filter.options.meta.notifications.branch.create && newCommitComments.length > 0) {
              new Notification(newCommitComments.length + 'new pull request comment(s) in ' + repoFullName);
            }
          });
        }
      }, true);

      $scope.$watch(events.PullRequestReviewCommentEvent, function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          console.log('PullRequestReviewCommentEvent', newValue, oldValue);
          filterWithNotificationSettings.forEach(function (filter) {
            var repoFullName = filter.getOwner() + '/' + filter.getRepo();
            var newPullRequestReviewComments = _.filter(newValue, {'repo': {'name': repoFullName}});
            if (filter.options.meta.notifications.branch.create && newPullRequestReviewComments.length > 0) {
              new Notification(newPullRequestReviewComments.length + 'new pull request comment(s) in ' + repoFullName);
            }
          });
        }
      }, true);

      $scope.$watch(events.PushEvent, function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
//          console.log('PushEvent', newValue, oldValue);
          filterWithNotificationSettings.forEach(function (filter) {
            var eventsToPopulate = [];
            var repoFullName = filter.getOwner() + '/' + filter.getRepo();
            var newPushsByFilter = _.filter(newValue, {'repo': {'name': repoFullName}});
            var authors = filter.getAuthors();
            newPushsByFilter.forEach(function (event) {
              var eventActor = event.actor.login;
              if ((authors.length === 0 || _.contains(authors, eventActor)) && eventActor !== currentUser) {
                eventsToPopulate.push(event);
              }
            });
            if (eventsToPopulate.length === 1) {
              var singleEvent = eventsToPopulate[0];
              new Notification(singleEvent.actor.login + ' pushed to ' + repoFullName, {
                /*jshint camelcase:false*/
                icon: singleEvent.actor.login.avatar_url
              });
            } else if (eventsToPopulate.length > 1) {
              var uniqActors = _.uniq(_.pluck(eventsToPopulate, function (event) {
                return event.actor.login;
              }));
              new Notification(uniqActors.length + ' contributor pushed to ' + repoFullName, {
                /*jshint camelcase:false*/
                icon: '/images/icon-social-github-128.png',
                body: 'Actors are "' + uniqActors.join(' ,') +'"'
              });
            }
          });
        }
      }, true);

      $scope.$watch(events.CreateEvent, function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          console.log('CreateEvent', newValue, oldValue);
          var newBranches = _.filter(newValue, {'payload': {'ref_type': 'branch'}});
          filterWithNotificationSettings.forEach(function (filter) {
            var eventsToPopulate = [];
            var authors = filter.getAuthors();
            var repoFullName = filter.getOwner() + '/' + filter.getRepo();
            var newBranchesByFilter = _.filter(newBranches, {'repo': {'name': repoFullName}});
            newBranchesByFilter.forEach(function(event){
              var eventActor = event.actor.login;
              if ((authors.length === 0 || _.contains(authors, eventActor)) && eventActor !== currentUser) {
                eventsToPopulate.push(event);
              }
            });
            if (filter.options.meta.notifications.branch.create && newBranchesByFilter.length > 0) {
              if (eventsToPopulate.length === 1) {
                var singleEvent = eventsToPopulate[0];
                var notification = new Notification(singleEvent.actor.login + ' created 1 new branch', {
                  /*jshint camelcase:false*/
                  icon: singleEvent.actor.avatar_url,
                  body: '"' + singleEvent.payload.ref + '" created in ' + repoFullName
                });
                console.log(notification);
              } else if (eventsToPopulate.length > 1) {
                var uniqActors = _.uniq(_.pluck(eventsToPopulate, function (event) {
                  return event.actor.login;
                }));
                new Notification(uniqActors.length + ' contributor pushed to ' + repoFullName, {
                  /*jshint camelcase:false*/
                  icon: '/images/icon-social-github-128.png',
                  body: 'Actors are "' + uniqActors.join(' ,') +'"'
                });
              }
            }
          });
        }
      }, true);
    }]);

}(angular));
